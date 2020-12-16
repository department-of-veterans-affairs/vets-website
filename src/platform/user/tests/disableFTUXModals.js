// make sure no first-time UX modals are in the way
export function disableFTUXModals() {
  window.localStorage.setItem('DISMISSED_ANNOUNCEMENTS', '*');
}
