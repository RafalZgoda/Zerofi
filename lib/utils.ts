import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
// 2023-09-23T21:50:16.000Z return 2 hours ago
export function timeAgo(date: string) {
  const time = new Date(date).getTime();
  const now = new Date().getTime();
  const diff = now - time;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor(diff / (1000 * 60));
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) {
    return `${seconds} seconds ago`;
  } else if (minutes < 60) {
    return `${minutes} minutes ago`;
  } else if (hours < 24) {
    return `${hours} hours ago`;
  } else {
    return `${new Date(date).toLocaleDateString()}`;
  }
}
