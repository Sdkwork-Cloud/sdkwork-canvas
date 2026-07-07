import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export { formatDatetime, isBlank } from '@sdkwork/utils';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
