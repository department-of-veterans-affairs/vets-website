// Helper function to allow the user to change a dropdown input to the value provided
export function changeDropdown(form, selector, value) {
  const field = form.find(selector);
  field.simulate('change', {
    target: { value },
  });
}
