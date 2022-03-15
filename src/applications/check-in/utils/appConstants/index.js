const APP_NAMES = Object.freeze({
  CHECK_IN: 'dayOf',
  PRE_CHECK_IN: 'preCheckIn',
});

const EDITING_PAGE_NAMES = Object.freeze({
  DEMOGRAPHICS: 'demographics',
  NEXT_OF_KIN: 'nextOfKin',
  EMERGENCY_CONTACT: 'emergencyContact',
});

const getLabelForPhoneOrAddress = (
  field,
  options = { capitalizeFirstLetter: false },
) => {
  let rv = 'phone';
  if (field === 'homePhone') {
    rv = 'home phone';
  }
  if (field === 'mobilePhone') {
    rv = 'mobile phone';
  }
  if (field === 'workPhone') {
    rv = 'work phone';
  }
  if (field === 'address') {
    rv = 'address';
  }
  if (field === 'homeAddress') {
    rv = 'home address';
  }
  if (field === 'mailingAddress') {
    rv = 'mailing address';
  }
  if (options.capitalizeFirstLetter) {
    rv = rv.charAt(0).toUpperCase() + rv.slice(1);
  }
  return rv;
};

export { APP_NAMES, EDITING_PAGE_NAMES, getLabelForPhoneOrAddress };
