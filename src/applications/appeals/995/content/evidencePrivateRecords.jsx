import numberToWords from 'platform/forms-system/src/js/utilities/data/numberToWords';

export const content = {
  title: (addOrEdit, index) =>
    `${addOrEdit === 'add' ? 'Add' : 'Edit'} the ${numberToWords(
      index || 1,
    )} provider where you received treatment`,
  description:
    'We’ll request your private medical records from this provider or hospital.',
  nameLabel: 'Name of private provider or hospital',
  addressLabels: {
    country: 'Country',
    street: 'Street address',
    street2: 'Street address line 2',
    city: 'City',
    state: 'State',
    postal: 'Postal code',
  },
  issuesLabel:
    'Choose the conditions you received treatment for at this facility.',
  fromLabel: 'First treatment date (you can estimate)',
  toLabel: 'Last treatment date (you can estimate)',
  modal: {
    title: ({ providerFacilityName }) =>
      `Do you want to keep ${providerFacilityName || 'this location'}?`,
    description: 'We’ve saved your current information',
    yes: 'Yes, keep location',
    no: 'No, remove location',
  },
  addAnotherLink: 'Add another location',
};
