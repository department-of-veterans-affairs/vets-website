export function closeModal(content) {
  return {
    type: 'CLOSE_MODAL',
    content
  };
}

export function openModal(content) {
  return {
    type: 'OPEN_MODAL',
    content
  };
}
