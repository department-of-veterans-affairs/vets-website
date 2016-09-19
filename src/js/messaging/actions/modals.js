export const TOGGLE_CONFIRM_DELETE = 'TOGGLE_CONFIRM_DELETE';

export function toggleConfirmDelete(visible) {
  return {
    type: TOGGLE_CONFIRM_DELETE,
    visible
  };
}
