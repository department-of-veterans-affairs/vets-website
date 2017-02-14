export function closeModal() {
  return {
    type: 'GLOSSARY_MODAL_CLOSED',
  };
}

export function openModal(holdLength, holdExplanation) {
  return {
    type: 'GLOSSARY_MODAL_OPENED',
    holdLength,
    holdExplanation,
  };
}
