import React from 'react';
import PropTypes from 'prop-types';

const RecommendedResults = (loading, recommendedResults) => {
  if (!loading && recommendedResults && recommendedResults.length > 0) {
    return (
      <div>
        <h3 className="vads-u-font-size--base vads-u-font-family--sans vads-u-color--gray-dark vads-u-font-weight--bold">
          Our top recommendations for you
        </h3>
        <ul className="results-list">
          {recommendedResults.map((result, index) =>
            this.renderWebResult(result, 'description', true, index),
          )}
        </ul>
        <hr aria-hidden="true" />
      </div>
    );
  }

  return null;
};

RecommendedResults.propTypes = {
  loading: PropTypes.bool.isRequired,
  recommendedResults: PropTypes.array
};

export default RecommendedResults;