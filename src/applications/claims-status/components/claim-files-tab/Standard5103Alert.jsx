import React from 'react';
import { Link } from 'react-router-dom-v5-compat';
import PropTypes from 'prop-types';

function Standard5103Alert({ previousPage = null }) {
  // The Standard 5103 Notice Response doesnt come through as a tracked item from our API until it is closed so we need to make a
  // mocked item with information.
  const standard5103Item = {
    displayName: '5103 Evidence Notice',
    type: '5103 Notice Response',
    description: (
      <>
        <p>
          We sent you a "5103 notice" letter that lists the types of evidence we
          may need to decide your claim.
        </p>
        <p>
          Upload the waiver attached to the letter if you’re finished adding
          evidence.
        </p>
      </>
    ),
  };
  return (
    <va-alert
      data-testid="standard-5103-notice-alert"
      class="primary-alert vads-u-margin-bottom--2"
      status="warning"
    >
      <h4 slot="headline" className="alert-title">
        {standard5103Item.displayName}
      </h4>
      <span className="alert-description">{standard5103Item.description}</span>
      <div className="link-action-container">
        <Link
          aria-label={`Details for ${standard5103Item.displayName}`}
          title={`Details for ${standard5103Item.displayName}`}
          className="vads-c-action-link--blue"
          to="../5103-evidence-notice"
          onClick={() => {
            if (previousPage !== null) {
              sessionStorage.setItem('previousPage', previousPage);
            }
          }}
        >
          Details
        </Link>
      </div>
    </va-alert>
  );
}

Standard5103Alert.propTypes = {
  previousPage: PropTypes.string,
};

export default Standard5103Alert;
