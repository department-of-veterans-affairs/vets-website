export function closeModal() {
  return {
    type: 'GLOSSARY_MODAL_CLOSED',
  };
}

export function openModal(title, content) {
  return {
    type: 'GLOSSARY_MODAL_OPENED',
    title,
    content,
  };
}
