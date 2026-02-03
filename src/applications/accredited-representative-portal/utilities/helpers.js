import { waitForShadowRoot } from 'platform/utilities/ui/webComponents';

export const paramUpdate = (param, status) => {
  const setSortBy = status === 'processed' ? 'resolved_at' : 'created_at';
  switch (param) {
    case 'newest':
      return { order: 'desc', sortBy: setSortBy };
    case 'oldest':
      return { order: 'asc', sortBy: setSortBy };
    default:
      return null;
  }
};

export async function addStyleToShadowDomOnPages(
  urlArray,
  targetElements,
  style,
) {
  // If we're on one of the desired pages (per URL array), inject CSS
  // into the specified target elements' shadow DOMs:
  if (urlArray.some(u => window.location.href.includes(u)))
    targetElements.map(async e => {
      try {
        document.querySelectorAll(e).forEach(async item => {
          const el = await waitForShadowRoot(item);
          if (el?.shadowRoot) {
            const sheet = new CSSStyleSheet();
            sheet.replaceSync(style);
            el.shadowRoot.adoptedStyleSheets.push(sheet);
          }
        });
      } catch (err) {
        // Fail silently (styles just won't be applied)
      }
    });
}
