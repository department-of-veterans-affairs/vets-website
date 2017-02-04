// import { api } from '../config';

export const DISPLAY_MODAL = 'DISPLAY_MODAL';

export function displayModal(modal) {
  return {
    type: DISPLAY_MODAL,
    modal
  };
}

export function closeModal() {
  return {
    type: DISPLAY_MODAL,
    modal: null
  };
}
