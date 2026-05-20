(function() {
  const BRANDING_CONFIG_URL = window.__BRANDING_CONFIG_URL__ || '/config/branding.json';
  
  async function loadBrandingConfig() {
    try {
      const response = await fetch(BRANDING_CONFIG_URL);
      if (response.ok) {
        const config = await response.json();
        window.__BRANDING_CONFIG__ = config;
        
        if (config.iconUrl) {
          updateFavicon(config.iconUrl);
        }
        if (config.pageName) {
          document.title = config.pageName;
        }
      }
    } catch (error) {
      console.warn('Failed to load branding config:', error);
    }
  }

  function updateFavicon(url) {
    let link = document.querySelector("link[rel*='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'shortcut icon';
      document.head.appendChild(link);
    }
    link.href = url;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadBrandingConfig);
  } else {
    loadBrandingConfig();
  }
})();
