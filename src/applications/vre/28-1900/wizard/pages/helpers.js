import recordEvent from 'platform/monitoring/record-event';

const mapValueToOption = (value, options) => {
  const optionText = options.filter(option => option.value === value);
  return optionText[0].label;
};

export const handleChangeAndPageSet = (setPageState, value, options, label) => {
  setPageState({ selected: value }, value);
  const optionText = mapValueToOption(value, options);
  recordEvent({
    event: 'howToWizard-formChange',
    'form-field-type': 'form-radio-buttons',
    'form-field-label': label,
    'form-field-value': optionText,
  });
};

export const recordNotificationEvent = description => {
  recordEvent({
    event: 'howToWizard-alert-displayed',
    'reason-for-alert': description,
  });
};

export const fireLinkClickEvent = event => {
  recordEvent({
    event: 'howToWizard-alert-link-click',
    'howToWizard-alert-link-click-label': event.target.innerText,
  });
};
