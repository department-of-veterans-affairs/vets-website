import React from 'react';

const submissionError = ({ form }) => (
  <va-alert status="error" class="vads-u-margin-bottom--4">
    <h3 slot="headline">Your decision review request didn’t go through</h3>
    <p>
      We’re sorry. We’re working to fix the problem, but it may take us a while.
      Please try again tomorrow.
    </p>
    <p>
      If you’re still having trouble submitting your request, call us at{' '}
      <va-telephone contact="8006982411" /> (<va-telephone contact="711" tty />
      ). We’re here 24/7. Your in-progress ID is {form.inProgressFormId}.
    </p>
  </va-alert>
);

export default submissionError;
