// import React from 'react';

import numberToWords from 'platform/forms-system/src/js/utilities/data/numberToWords';

export const content = {
  title: (addOrEdit, index) =>
    `${addOrEdit === 'add' ? 'Add' : 'Edit'} the ${numberToWords(
      index || 1,
    )} VA facility that treated you`,
  description: 'We’ll request your VA medical records from this facility',
  locationAndName:
    'Name of VA medical center, VA treatment facility, or Federal department or agency',
  conditions:
    'Choose the conditions you received treatment for at this facility.',
  dateStart: 'First treatment date (you can estimate)',
  dateEnd: 'Last treatment date (you can estimate)',
  addAnother: 'Add another location',
  modalTitle: ({ locationAndName }) =>
    `Do you want to keep ${locationAndName || 'this location'}?`,
  modalDescription: 'We’ve saved your current information.',
  modalYes: 'Yes, keep location',
  modalNo: 'No, remove location',
};
