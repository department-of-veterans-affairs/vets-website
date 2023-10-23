import numberToWords from 'platform/forms-system/src/js/utilities/data/numberToWords';

// Link text for review & submit page errors
// key = "name" from `form.formErrors.errors`
// see src/platform/forms-system/docs/reviewErrors.md
export default {
  servicePeriods:
    'Military service history (fill in any missing information for branch of service or service start and end dates)',
  servedInCombatZonePost911:
    'Did you serve in a combat zone after September 11, 2001? (select yes or no)',
  ratedDisabilities:
    'Rated disability (select the disability you’re filing for)',
  // newDisabilities is returning null so it doesn't render because a missing
  // "condition" will show the error
  newDisabilities: () => null,
  condition: index =>
    `New conditions (in the ${numberToWords(
      index + 1,
    )} section, enter a condition or select one from the list)`,
  cause: 'What caused this condition? (select from the list of causes)',
  'view:hasMilitaryRetiredPay':
    'Have you ever received military retirement pay? (select yes or no)',
  hasTrainingPay:
    'Do you expect to receive active or inactive duty training pay? (select yes or no)',
  'view:powStatus': 'Are you a former POW? (select yes or no)',
  'view:selectableEvidenceTypes':
    'What type of evidence do you want us to review as part of your claim? (select at least one type)',
  primaryPhone: 'Contact information (enter your phone number)',
  emailAddress: 'Contact information (enter your email address)',
  city: 'Contact information (enter a city for your mailing address)',
  addressLine1: 'Contact information (enter a street address)',
  state: 'Contact information (enter a state for your mailing address)',
  zipCode: 'Contact information (enter a postal code for your mailing address)',
  homelessOrAtRisk:
    'Are you homeless or at risk of becoming homeless? (select one of the answers)',
  isVaEmployee: 'Are you a VA employee? (select yes or no)',
};
