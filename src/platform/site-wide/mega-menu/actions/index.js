export const UPDATE_CURRENT_SECTION = 'UPDATE_CURRENT_SECTION';
export const TOGGLE_PANEL_OPEN = 'TOGGLE_PANEL_OPEN';

export const togglePanel = (megaMenu) => ({
  type: 'TOGGLE_PANEL_OPEN',
  megaMenu,
});

export function updateCurrentSection(currentSection) {
  return {
    type: UPDATE_CURRENT_SECTION,
    currentSection,
  };
}

export function togglePanelOpen(currentDropdown) {
  return (dispatch, getState) => {
    const state = getState();
    const shouldUpdateDropdown = !state.megaMenu.currentDropdown ||
      state.megaMenu.currentDropdown !== currentDropdown;

    if (shouldUpdateDropdown) {
      dispatch(togglePanel({
        currentDropdown,
      }));
    } else {
      dispatch(togglePanel({
        currentDropdown: '',
      }));
    }
  };
}
