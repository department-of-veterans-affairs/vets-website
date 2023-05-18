import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';

const getToUrl = claimId => {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const query = Object.fromEntries(urlSearchParams.entries());

  return {
    pathname: `your-claims/${claimId}/ask-va-to-decide`,
    query,
  };
};

export default function AskVAToDecide({ id }) {
  return (
    <div className="usa-alert usa-alert-info background-color-only claims-alert-status alert-with-details">
      <div className="item-title-container">
        <h4 className="claims-alert-header">Ask for your Claim Decision</h4>
        <p>
          You can ask us to start evaluating your claim if you don’t have any
          more documents or evidence to file.
        </p>
      </div>
      <div className="button-container">
        <Link
          aria-label="View details about asking VA for a claim decision"
          title="View details about asking VA for a claim decision"
          className="usa-button usa-button-secondary view-details-button"
          to={getToUrl(id)}
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

AskVAToDecide.propTypes = {
  id: PropTypes.string.isRequired,
};
