// make sure no first-time UX modals are in the way
const disableFTUXModals = () => {
  window.localStorage.setItem('DISMISSED_ANNOUNCEMENTS', '*');
};

export default disableFTUXModals;
