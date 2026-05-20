import { getPageName } from '@/utils/branding';

export function getDynamicMetaTitle(): string {
  return getPageName();
}

export function getDynamicMetaDescription(): string {
  return `${getPageName()} - Network Management Dashboard`;
}
