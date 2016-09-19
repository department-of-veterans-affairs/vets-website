export const TOGGLE_CONFIRM_DELETE = 'TOGGLE_CONFIRM_DELETE';
export const TOGGLE_ATTACHMENTS = 'TOGGLE_ATTACHMENTS';

export function toggleConfirmDelete() {
  return {
    type: TOGGLE_CONFIRM_DELETE
  };
}


export function toggleAttachmentsModal() {
  return {
    type: TOGGLE_ATTACHMENTS
  };
}
