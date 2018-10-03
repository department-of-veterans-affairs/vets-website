export const UPDATE_CURRENT_SECTION = 'UPDATE_CURRENT_SECTION';
export const TOGGLE_PANEL_OPEN = 'TOGGLE_PANEL_OPEN';
export const TOGGLE_DISPLAY_HIDDEN = 'TOGGLE_DISPLAY_HIDDEN';

export const togglePanel = megaMenu => ({
  type: 'TOGGLE_PANEL_OPEN',
  megaMenu,
});

export const toggleDisplayHidden = display => ({
  type: 'TOGGLE_DISPLAY_HIDDEN',
  display,
});

export function updateCurrentSection(currentSection) {
  return {
    type: UPDATE_CURRENT_SECTION,
    currentSection,
  };
}

export const toggleMobileDisplayHidden = hidden => (dispatch, getState) => {
  const state = getState();

  if (window.innerWidth > 768) {
    dispatch(toggleDisplayHidden({}));
  } else if (hidden) {
    dispatch(toggleDisplayHidden({ hidden: true }));
  } else if (
    !Object.prototype.hasOwnProperty.call(state.megaMenu.display, 'hidden')
  ) {
    dispatch(toggleDisplayHidden({ hidden: true }));
  } else {
    dispatch(toggleDisplayHidden({}));
  }
};

export function togglePanelOpen(currentDropdown) {
  return (dispatch, getState) => {
    const state = getState();

    const shouldUpdateDropdown =
      !state.megaMenu.currentDropdown ||
      state.megaMenu.currentDropdown !== currentDropdown;

    if (shouldUpdateDropdown) {
      dispatch(
        togglePanel({
          currentDropdown,
        }),
      );
    } else {
      dispatch(
        togglePanel({
          currentDropdown: '',
        }),
      );
    }
  };
}
