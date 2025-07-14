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

  /* ------------------------------------------------------------
   *    Defer only scripts whose hostnames are explicitly allowed.
   *    Feature teams can opt-out by adding `data-no-partytown`.
   * ---------------------------------------------------------- */
  const allowedHosts = new Set([
    'www.googletagmanager.com',
    'www.google-analytics.com',
    'dap.digitalgov.gov',
    'www.dap.digitalgov.gov',
    'cdn.dap.digitalgov.gov',
    'kit.fontawesome.com',
    'use.fontawesome.com',
  ]);

  const deferThirdPartyScripts = () => {
    document.querySelectorAll('script[src]').forEach(original => {
      if (original.type === 'text/partytown') return; // Already handled.
      if (original.hasAttribute('data-no-partytown')) return; // Explicit opt-out.

      let host;
      try {
        host = new URL(original.src, window.location.href).hostname;
      } catch (_) {
        return; // Malformed URL or relative path – skip.
      }

      if (!allowedHosts.has(host)) return; // Not in allow-list.

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
