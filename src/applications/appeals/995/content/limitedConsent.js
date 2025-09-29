import React from 'react';

export const content = {
  promptQuestion: 'Do you want to limit consent for the information requested?',
  detailsQuestion:
    'What do you want your information request to be limited to?',
  detailsHint:
    'For example, you want your doctor to release only treatment dates or certain types of disabilities',
  detailsError: 'You must enter a limitation',
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
};
