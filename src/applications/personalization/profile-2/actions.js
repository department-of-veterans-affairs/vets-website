export const OPEN_SIDE_NAV = 'OPEN_SIDE_NAV';
export const CLOSE_SIDE_NAV = 'CLOSE_SIDE_NAV';
export const PIN_MENU_TRIGGER = 'PIN_MENU_TRIGGER';
export const UNPIN_MENU_TRIGGER = 'UNPIN_MENU_TRIGGER';

export const openSideNav = () => ({
  type: OPEN_SIDE_NAV,
});

export const closeSideNav = (focusTriggerButton = false) => ({
  type: CLOSE_SIDE_NAV,
  focusTriggerButton,
});

export const pinMenuTrigger = () => ({
  type: PIN_MENU_TRIGGER,
});

export const unpinMenuTrigger = () => ({
  type: UNPIN_MENU_TRIGGER,
});
