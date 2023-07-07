import React from 'react';

export const content = {
  title: {
    add: 'Add an issue',
    edit: 'Edit an issue',
  },
  description: (
    <div>
      If you’re filing a Supplemental Claim within 1 year of receiving a
      decision from 1 of these courts, provide the date listed on your decision
      notice and upload a copy of your decision notice as evidence:
      <ul>
        <li>The United States Court of Appeals for Veterans Claims</li>
        <li>The United States Court of Appeals for the Federal Circuit</li>
        <li>The Supreme Court of the United States</li>
      </ul>
    </div>
  ),
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
    hint:
      'Enter the date on your decision notice (the letter you received in the mail from us).',
  },
};
