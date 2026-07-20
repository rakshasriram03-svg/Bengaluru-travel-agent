import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind class names safely (standard shadcn/ui helper).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
