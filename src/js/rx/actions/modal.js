export function closeRefillModal(content) {
  return {
    type: 'CLOSE_REFILL_MODAL',
    content
  };
}

export function openRefillModal(content) {
  return {
    type: 'OPEN_REFILL_MODAL',
    content
  };
}

export function closeGlossaryModal() {
  return {
    type: 'CLOSE_GLOSSARY_MODAL'
  };
}

export function openGlossaryModal(content) {
  return {
    type: 'OPEN_GLOSSARY_MODAL',
    content
  };
}
