// This is temporary code, intended to allow us to hide scss behind a flipper
// When removing TOGGLE_NAMES.pensionMultiresponseStyles, move the contents of style.textContent to sass/pensions.scss
export function addMultiresponseStyles() {
  const style = document.createElement('style');
  style.setAttribute('id', 'multiresponse-styles');
  style.textContent = `
  .rjsf-web-component-field[error]:not([error=""]) {
    margin-left: 0;
  }
  .usa-input-error {
    right: 0;
  }
  .rjsf-array-field button.edit {
    align-self: flex-end;
  }
  .row .row.small-collapse {
    margin: 0;
  }
  .progress-box {
    padding: 0;
  }
`;
  document.head.append(style);
}

export function removeMultiresponseStyles() {
  const styleElement = document.getElementById('multiresponse-styles');
  if (styleElement) {
    styleElement.remove();
  }
}
