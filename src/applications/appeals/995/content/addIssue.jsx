import React from 'react';

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
    hint: (
      <p className="vads-u-font-weight--normal label-description">
        You can only add an issue that you’ve received a VA decision notice for.
      </p>
    ),
  },
  date: {
    label: 'Date of decision',
    hint: (
      <p className="vads-u-font-weight--normal label-description">
        Enter the date on your decision notice (the letter you received in the
        mail from us).
      </p>
    ),
  },
};
