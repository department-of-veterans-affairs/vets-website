import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';

export default function AskVAToDecide({ id }) {
  return (
    <div className="inset with-details">
      <div>
        <h4>Ask for your Claim Decision</h4>
        <p>
          You can ask us to start evaluating your claim if you don’t have any
          more documents or evidence to file.
        </p>
      </div>
      <div className="button-container">
        <Link
          aria-label="View details about asking VA for a claim decision"
          className="usa-button usa-button-secondary view-details-button"
          title="View details about asking VA for a claim decision"
          to={`/your-claims/${id}/ask-va-to-decide`}
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
