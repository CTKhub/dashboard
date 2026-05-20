const DEFAULT_BRANDING = {
  logoUrl: '/assets/netbird-logo.svg',
  iconUrl: '/favicon.ico',
  pageName: 'NetBird Dashboard',
  companyName: 'NetBird',
};

interface BrandingConfig {
  logoUrl: string;
  iconUrl: string;
  pageName: string;
  companyName: string;
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return url.startsWith('/') || url.startsWith('./');
  }
}

function loadBrandingFromConfig(): BrandingConfig {
  if (typeof window === 'undefined') {
    return DEFAULT_BRANDING;
  }

  try {
    const config = (window as any).__BRANDING_CONFIG__ || DEFAULT_BRANDING;
    return config;
  } catch {
    return DEFAULT_BRANDING;
  }
}

export function getBrandingConfig(): BrandingConfig {
  return loadBrandingFromConfig();
}

export function getLogoUrl(): string {
  const config = getBrandingConfig();
  return isValidUrl(config.logoUrl) ? config.logoUrl : DEFAULT_BRANDING.logoUrl;
}

export function getIconUrl(): string {
  const config = getBrandingConfig();
  return isValidUrl(config.iconUrl) ? config.iconUrl : DEFAULT_BRANDING.iconUrl;
}

export function getPageName(): string {
  return getBrandingConfig().pageName || DEFAULT_BRANDING.pageName;
}

export function getCompanyName(): string {
  return getBrandingConfig().companyName || DEFAULT_BRANDING.companyName;
}
