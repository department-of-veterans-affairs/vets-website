import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import Result from './Result';

const RecommendedResults = ({ query, searchData, typeaheadUsed }) => {
  const { recommendedResults } = searchData;
  const searchResultsUiUpdateEnabled = useSelector(
    state => toggleValues(state)[FEATURE_FLAG_NAMES.searchResultsUiUpdate],
  );

  if (recommendedResults && recommendedResults.length > 0) {
    return (
      <div>
        <h3
          className={
            searchResultsUiUpdateEnabled
              ? 'vads-u-margin-top--4 vads-u-margin-bottom--4 vads-u-font-size--base vads-u-font-family--sans vads-u-color--gray-dark vads-u-font-weight--bold'
              : 'vads-u-font-size--base vads-u-font-family--sans vads-u-color--gray-dark vads-u-font-weight--bold'
          }
        >
          Our top recommendations for you
        </h3>
        <ul className="results-list" data-e2e-id="top-recommendations">
          {recommendedResults.map((result, index) => (
            <Result
              index={index}
              isBestBet
              key={index}
              query={query}
              result={result}
              searchData={searchData}
              snippetKey="description"
              typeaheadUsed={typeaheadUsed}
            />
          ))}
        </ul>
        <hr
          aria-hidden="true"
          className={
            searchResultsUiUpdateEnabled
              ? 'vads-u-margin-top--0 vads-u-margin-bottom--4'
              : undefined
          }
        />
      </div>
    );
  }

  return null;
};

RecommendedResults.propTypes = {
  query: PropTypes.string,
  searchData: PropTypes.object,
  typeaheadUsed: PropTypes.bool,
};

export default RecommendedResults;
