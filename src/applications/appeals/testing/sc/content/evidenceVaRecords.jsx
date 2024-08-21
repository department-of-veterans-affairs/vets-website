// import React from 'react';

import numberToWords from 'platform/forms-system/src/js/utilities/data/numberToWords';

export const content = {
  title: (addOrEdit, index) =>
    `${addOrEdit === 'add' ? 'Add a' : 'Edit the'} ${numberToWords(
      index || 1,
    )} VA or military treatment location`,
  description:
    'We’ll request your VA medical records from this facility or provider',
  locationAndName: 'Name of facility or provider that treated you',
  locationAndNameHint:
    'You can enter the name of a VA medical center or clinic, Vet Center,  military treatment facility, or community care provider',

  issuesLabel: 'What did they treat you for?',
  // dateStart: 'First treatment date (you can estimate)',
  treatmentDate: 'When did they treat you?',
  treatmentHint:
    'If treatment began from 2005 to present, you do not need to provide date.',
  noDate: 'I don’t have the date',
  // dateEnd: 'Last treatment date (you can estimate)',
  addAnotherLink: 'Add another VA or military treatment location',
  modal: {
    title: ({ locationAndName }) =>
      `Do you want to keep ${locationAndName || 'this location'}?`,
    description: 'We’ve saved your current information.',
    yes: 'Yes, keep location',
    no: 'No, remove location',
  },
};
