export default function initPartytown() {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  if (window.__PARTYTOWN_INITIALIZED__) {
    return;
  }
  window.__PARTYTOWN_INITIALIZED__ = true;

  const configScript = document.createElement('script');
  configScript.innerHTML = `
    partytown = {
      lib: 'https://unpkg.com/@builder.io/partytown@0.8.1/lib/',
      forward: ['dataLayer.push', 'gtag']
    };
  `;
  document.head.appendChild(configScript);

  const loaderScript = document.createElement('script');
  loaderScript.src =
    'https://unpkg.com/@builder.io/partytown@0.8.1/lib/partytown.js';
  loaderScript.async = true;
  document.head.appendChild(loaderScript);

  const deferThirdPartyScripts = () => {
    const selectors = [
      'script[src*="googletagmanager.com/gtm.js"]',
      'script[src*="google-analytics.com/analytics.js"]',
      'script[src*="dap.digitalgov.gov"]',
      'script[src*="fontawesome"]',
      'script[src*="kit.fontawesome.com"]',
    ].join(',');

    document.querySelectorAll(selectors).forEach(original => {
      if (original.type === 'text/partytown') return;

      const replacement = original.cloneNode(true);
      replacement.type = 'text/partytown';
      original.replaceWith(replacement);
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', deferThirdPartyScripts);
  } else {
    deferThirdPartyScripts();
  }
}
