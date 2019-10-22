// Same as "rootUrl" in manifest.json
export const BASE_URL =
  '/disability-benefits/apply/form-0996-higher-level-review';

export const selectors = {
  optOutStepVisible: 'view:optOutStep',
};

export const errorMessages = {
  optOutCheckbox: 'You must opt in to the new appeals process to proceed',
  phone: 'Please enter your 10-digit phone number (with or without dashes)',
  email: 'Please enter your email address using this format: X@X.com',
  address1: 'Please enter your street address',
  city: 'Please enter your city',
  state: 'Please enter your state',
  zipCode: 'Please enter your zip code',
  forwardStartDate: 'Please enter an effective start date',
  startDateInPast: 'Start date must be in the future',
  endDateInPast: 'End date must be in the future',
  endDateBeforeStart: 'End date must be after start date',
};
