// makeUserObject used to be defined in this file. To avoid updating all places
// that were already using it, we're just re-exporting it
export { makeUserObject } from '~/applications/personalization/common/helpers';

export function mockLocalStorage() {
  // make sure no first-time UX modals are in the way
  window.localStorage.setItem(
    'DISMISSED_ANNOUNCEMENTS',
    JSON.stringify(['single-sign-on-intro', 'find-benefits-intro']),
  );
}
