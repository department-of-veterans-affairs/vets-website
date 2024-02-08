import React from 'react';

export const content = {
  title: 'Do you want to limit the information we can request?',

  textAreaLabel:
    'If you want to limit what we can request from your private medical provider(s), describe the limitation (for example, you want to release only treatment dates or a type of disability.)',

  info: (
    <va-additional-info
      trigger="What does &quot;limiting consent&quot; mean?"
      uswds
    >
      <p>
        If you choose to limit consent, you’re limiting the type or amount of
        information that your doctor or medical facility can release to us. It
        may take us longer to get your private medical records if you limit
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
};
