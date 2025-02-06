import React from 'react';

export const content = {
  title: 'Do you want to limit the information we can request?',

  textAreaLabel:
    'If you want to limit what we can request from your non-VA medical provider(s), describe the limitation (for example, you want your doctor to release only treatment dates or certain types of disabilities)',

  info: (
    <va-additional-info
      class="vads-u-margin-bottom--4"
      trigger="What does &quot;limiting consent&quot; mean?"
    >
      <p>
        If you choose to limit consent, you’re limiting the type or amount of
        information that your doctor or medical facility can release to us. It
        may take us longer to get your non-VA medical records if you limit
        consent.
      </p>
    </va-additional-info>
  ),

  name: 'limitations',

  review: {
    y: 'Yes, I want to limit the information requested',
    n: 'No, I don’t want to limit the information requested',
  },

  update: 'Update page',

  // New form content
  ynTitle: 'Do you want to limit consent for the information requested?',
  errorMessage: 'You must enter a limitation',

  textAreaTitle: 'What do you want your information request to be limited to?',
  textAreaHint:
    'For example, you want your doctor to release only treatment dates or certain types of disabilities',
};
