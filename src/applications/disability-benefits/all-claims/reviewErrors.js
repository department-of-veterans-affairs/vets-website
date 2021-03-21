import numberToWords from 'platform/forms-system/src/js/utilities/data/numberToWords';

// Link text for review & submit page errors
// key = "name" from `form.formErrors.errors`
export default {
  servicePeriods: 'Please add a military service period',
  'view:hasMilitaryRetiredPay':
    'Please share if you have received military retired pay at any time',
  servedInCombatZonePost911:
    'Please let us know if you served in a combat zone after September 11, 2001',
  hasTrainingPay:
    'Please share if you expect to receive active or inactive duty training pay',
  'view:powStatus': 'Please let us know if you have ever been a POW',
  'view:selectableEvidenceTypes':
    'Please select at least one type of supporting evidence',
  primaryPhone: 'Please provide a contact phone number',
  emailAddress: 'Please provide an email address',
  city: 'Please include a city in your mailing address',
  addressLine1: 'Please include an address line in your mailing address',
  state: 'Please include a state in your mailing address',
  zipCode: 'Please include a postal or zip code in your mailing address',
  homelessOrAtRisk:
    'Please let us know if you are homeless or at risk of becoming homeless',
  isVaEmployee: 'Please let us know if you are currently a VA employee',
  condition: index =>
    `In the ${numberToWords(
      index + 1,
    )} entry under new conditions, please enter a condition or select one from the suggested list`,
  cause: index =>
    `In the ${numberToWords(
      index + 1,
    )} new condition follow up question, please choose an appropriate cause for the condition`,
};
