import React from 'react';

const hintText =
  'You can only add an issue that you’ve received a VA decision notice for.';

export const content = {
  title: {
    add: 'Add an issue',
    edit: 'Edit an issue',
  },
  button: {
    cancel: 'Cancel',
    add: 'Add issue',
    edit: 'Update issue',
  },
  name: {
    label: 'Name of issue',
    hintText,
    hint: (
      <p className="vads-u-font-weight--normal label-description">{hintText}</p>
    ),
  },
  date: {
    label: 'Date of decision',
    hint:
      'Enter the date on your decision notice (the letter you received in the mail from us).',
  },
};
