import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom-v5-compat';
import { buildDateFormatter } from '../../utils/helpers';

function Automated5103Notice({ item }) {
  const formattedDueDate = buildDateFormatter()(item.suspenseDate);
  if (item.displayName !== 'Automated 5103 Notice Response') {
    return null;
  }
  return (
    <div id="automated-5103-notice-page">
      <h1 className="vads-u-margin-top--0 vads-u-margin-bottom--2">
        Review the list of evidence we need
      </h1>
      <p>
        We sent you a “5103 notice” letter that lists the types of evidence we
        may need to decide your claim.
      </p>
      <Link
        className="active-va-link"
        aria-label="Go to claim letters"
        title="Go to claim letters"
        to="/your-claim-letters"
      >
        Go to claim letters
        <va-icon icon="chevron_right" size={3} aria-hidden="true" />
      </Link>
      <p>
        You don’t need to do anything on this page. We’ll wait until{' '}
        <strong>{formattedDueDate}</strong>, to move your claim to the next
        step.
      </p>
      <h2 className="vads-u-margin-top--4 vads-u-margin-bottom--2">
        If you have more evidence to submit
      </h2>
      <p>
        <strong>Note:</strong> You can add evidence at any time. But if you add
        evidence later in the process, your claim will move back to this step.
        So we encourage you to add all your evidence now.
      </p>
      <Link
        data-testid="upload-evidence-link"
        aria-label="Upload your evidence here"
        title="Upload your evidence here"
        to="../files"
      >
        Upload your evidence here
      </Link>
      <p>
        If you finish adding evidence before that date,{' '}
        <strong>
          you can submit the 5103 notice response waiver attached to the letter.
        </strong>{' '}
        This might help speed up the claim process.
      </p>
    </div>
  );
}

Automated5103Notice.propTypes = {
  item: PropTypes.object.isRequired,
};

export default Automated5103Notice;
