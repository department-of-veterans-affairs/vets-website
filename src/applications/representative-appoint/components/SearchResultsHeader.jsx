import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { focusElement } from 'platform/utilities/ui';

export const SearchResultsHeader = props => {
  const { query, resultCount, searchWasPerformed, inProgress } = props;

  const handleNumberOfResults = () => {
    const headerClasses =
      'vads-u-font-family--sans vads-u-font-weight--normal vads-u-margin-bottom--3 vads-u-margin-top--3 search-header';

    if (resultCount === 1) {
      return (
        <h4 className={headerClasses}>
          Showing 1 result for <b>"{query}"</b>
        </h4>
      );
    }
    if (resultCount > 1) {
      return (
        <h4 className={headerClasses}>
          Showing {resultCount} results for <b>"{query}"</b>
        </h4>
      );
    }
    return (
      <h4 className={headerClasses}>
        No results found for <b>"{query}"</b>. For better results, double-check
        your spelling.
      </h4>
    );
  };

  useEffect(
    () => {
      if (searchWasPerformed && !inProgress) {
        focusElement('.search-header');
      }
    },
    [query, resultCount, searchWasPerformed, inProgress],
  );

  if (!searchWasPerformed || inProgress) {
    return <></>;
  }

  return <>{handleNumberOfResults()}</>;
};

SearchResultsHeader.propTypes = {
  inProgress: PropTypes.bool,
  query: PropTypes.string,
  resultCount: PropTypes.number,
  searchWasPerformed: PropTypes.bool,
};
