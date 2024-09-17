import React from 'react';
import { Link } from 'react-router-dom-v5-compat';
import PropTypes from 'prop-types';

import { standard5103Item } from '../../constants';

function Standard5103Alert({ previousPage = null }) {
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
