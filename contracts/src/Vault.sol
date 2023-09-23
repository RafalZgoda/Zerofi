// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC4626} from "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import {SignatureChecker} from "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";

import {RayMath} from "./RayMath.sol";
import {ONE, Ray} from "./Types.sol";

contract Vault is ERC4626 {
    using RayMath for Ray;
    using RayMath for uint256;

    address internal immutable apiSigner;
    Ray internal immutable interestRate;
    uint256 internal virtualTotalAssets;
    Ray internal interestTracker;
    uint256 internal lastInterestTrackerUpdateDate;
    mapping(uint256 => bool) apiNonceIsUsed;

    constructor(address _apiSigner, IERC20 __asset, Ray _interestRate) ERC4626(__asset) ERC20("ZeroFi US dollar", "zfUSD") {
        apiSigner = _apiSigner;
        interestTracker = ONE;
        lastInterestTrackerUpdateDate = block.timestamp;
        interestRate = _interestRate;
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

    function borrow(uint256 amount, bytes memory apiSignature, uint256 apiNonce) external {
        require(!apiNonceIsUsed[apiNonce], "Nonce already used");
        apiNonceIsUsed[apiNonce] = true;
        require(
            SignatureChecker.isValidSignatureNow(apiSigner, keccak256(abi.encode(msg.sender, amount)), apiSignature),
            "Invalid API signature");
        _transfer(address(this), msg.sender, amount);
    }

    function updateInterestRateTracker() internal {
        uint256 timeDelta = block.timestamp - lastInterestTrackerUpdateDate;
        interestTracker = interestTracker.add(interestRate.mul(timeDelta));
        lastInterestTrackerUpdateDate = block.timestamp;
    }
}
