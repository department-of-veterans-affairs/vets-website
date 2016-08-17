export function closeModal(content) {
  return {
    type: 'CLOSE_MODAL',
    content
  };
}

export function openModal() {
  return {
    type: 'OPEN_MODAL'
  };
}
