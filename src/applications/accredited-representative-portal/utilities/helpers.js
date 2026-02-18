import { waitForShadowRoot } from 'platform/utilities/ui/webComponents';
import {
  OAUTH_ERRORS,
  OAUTH_ERROR_RESPONSES,
  OAUTH_EVENTS,
  OAUTH_KEYS,
} from 'platform/utilities/oauth/constants';
import { AUTH_ERRORS } from 'platform/user/authentication/errors';
import { requestToken } from 'platform/utilities/oauth/utilities';

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

export const handleTokenRequest = async ({
  code,
  state,
  csp,
  generateOAuthError,
}) => {
  // Verify the state matches in storage
  if (
    !localStorage.getItem(OAUTH_KEYS.STATE) ||
    localStorage.getItem(OAUTH_KEYS.STATE) !== state
  ) {
    generateOAuthError({
      oauthErrorCode: AUTH_ERRORS.OAUTH_STATE_MISMATCH.errorCode,
      event: OAUTH_ERRORS.OAUTH_STATE_MISMATCH,
    });
  } else {
    // Matches - requestToken exchange
    const response = await requestToken({ code, csp });

    if (!response.ok) {
      const data = await response?.json();
      const oauthErrorCode = OAUTH_ERROR_RESPONSES[(data?.errors)];
      const event = OAUTH_EVENTS[(data?.errors)] ?? OAUTH_EVENTS.ERROR_DEFAULT;
      generateOAuthError({ oauthErrorCode, event });
    }
  }
};
