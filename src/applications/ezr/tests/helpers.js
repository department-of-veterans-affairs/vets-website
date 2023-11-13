// trigger vaTextInput event
export const inputVaTextInput = (selector, value) => {
  const vaTextInput = selector;
  vaTextInput.value = value;
  const event = new CustomEvent('input', {
    bubbles: true,
    detail: { value },
  });
  vaTextInput.dispatchEvent(event);
};
