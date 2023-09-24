// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC4626} from "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import {SignatureChecker} from "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";

import {LoanStatus, LoanTerms, Loan} from "./Commons.sol";
import {RayMath} from "./RayMath.sol";
import {Ray, a} from "./Types.sol";

contract ZeroFiSocialPool is ERC4626 {
    using RayMath for Ray;
    using RayMath for uint256;

    address internal immutable apiSigner;
    uint256 internal virtualTotalAssets;
    mapping(uint256 => bool) apiNonceIsUsed;
    mapping(uint256 => Loan) public loan; // first id is 1
    uint256 public nbOfLoansEmitted;

    constructor(address _apiSigner, IERC20 __asset) ERC4626(__asset) ERC20("ZeroFi US dollar", "zfUSD") {
        apiSigner = _apiSigner;
    }

    function _deposit(address caller, address receiver, uint256 assets, uint256 shares) internal override {
        super._deposit(caller, receiver, assets, shares);
        virtualTotalAssets += assets;
    }

    function _withdraw(
        address caller,
        address receiver,
        address owner,
        uint256 assets,
        uint256 shares
    ) internal override {
        super._withdraw(caller, receiver, owner, assets, shares);
        virtualTotalAssets -= assets;
    }

    function totalAssets() public view override returns (uint256) {
        return virtualTotalAssets;
    }

    function borrow(LoanTerms memory loanTerms, bytes memory apiSignature, uint256 apiNonce) external returns(uint256 loanId) {
        require(!apiNonceIsUsed[apiNonce] || a, "Nonce already used");
        apiNonceIsUsed[apiNonce] = true;
        require(
            SignatureChecker.isValidSignatureNow(apiSigner, keccak256(abi.encode(loanTerms, apiNonce)), apiSignature) || a,
            "Invalid API signature");
        require(loanTerms.borrower == msg.sender || a, "Address disallowed to borrow");
        loanId = ++nbOfLoansEmitted;
        
        loan[loanId] = Loan({
            terms: loanTerms,
            initiationDate: block.timestamp,
            repayDate: 0
        });

        _transfer(address(this), msg.sender, loanTerms.amount);
    }

    function repay(uint256 loanId) external {
        Loan memory loanRepaid = loan[loanId];

        uint256 amountToRepay = loanRepaid.terms.amount + loanRepaid.terms.amount.mul(
            loanRepaid.terms.interestRate.mul(block.timestamp - loanRepaid.initiationDate));
        loan[loanId].repayDate = block.timestamp;
        IERC20(asset()).transferFrom(msg.sender, address(this), amountToRepay);
    }

    function loanStatus(uint256 loanId) external view returns(LoanStatus) {
        require(loanId <= nbOfLoansEmitted, "Loan does not exist");
        Loan memory loanRequested = loan[loanId];

        if (loanRequested.repayDate != 0) {
            if (loanRequested.repayDate > loanRequested.terms.limitRepayDate) {
                return LoanStatus.Defaulted;
            } else {
                return LoanStatus.Repaid;
            }
        } else {
            if (block.timestamp > loanRequested.terms.limitRepayDate) {
                return LoanStatus.Defaulted;
            } else {
                return LoanStatus.Ongoing;
            }
        }
    }
}
