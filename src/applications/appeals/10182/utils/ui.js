import { $ } from 'platform/forms-system/src/js/utilities/ui';

// work-around for error message not showing :(
export const areaOfDisagreementWorkAround = (hasSelection, index) => {
  // we can't target the fieldset because it doesn't get re-rendered on other
  // pages by React
  // see https://dsva.slack.com/archives/CBU0KDSB1/p1620840904269500
  const label = $(`#area-of-disagreement-label-${index}`);
  if (label) {
    const showError = label.dataset.submitted === 'true' && !hasSelection;
    label.classList.toggle('usa-input-error', showError);
  }
};
