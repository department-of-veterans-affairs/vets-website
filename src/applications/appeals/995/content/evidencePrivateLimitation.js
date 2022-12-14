import React from 'react';

export const content = {
  title: 'Do you want to limit the information we can request?',

  textAreaLabel:
    'Describe the limitation (for example, you want to release only treatment dates or a type of disability.)',

  info: (
    <va-additional-info trigger="What does &quot;limit my consent&quot; mean?">
      <p>
        If you choose to limit consent, you’re limiting the type or amount of
        information that your doctor or medical facility can release to us.
        Limiting consent may add the time it takes us to get your private
        medical records.
      </p>
    </va-additional-info>
  ),

  name: 'limitations',

  review: {
    y: 'Yes, I want to limit the information',
    n: 'No, I don’t want to limit the information',
  },
};
