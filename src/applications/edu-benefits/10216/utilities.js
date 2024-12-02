import { waitForShadowRoot } from 'platform/utilities/ui/webComponents';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';

/*
* @param {Array} urlArray Array of page URLs where these styles should be applied - to target all URLs, use value: ['']
 * @param {Array} targetElements Array of HTML elements we want to inject styles into, e.g.: ['va-select', 'va-radio']
 * @param {String} style String of CSS to inject into the specified elements on the specified pages
 */
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
export const validateFacilityCode = async field => {
  try {
    const response = await apiRequest(
      `/gi/institutions/${field?.facilityCode}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return response?.data?.attributes?.accredited;
  } catch (error) {
    return false;
  }
};
