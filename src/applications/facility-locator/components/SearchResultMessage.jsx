import React from 'react';
import PropTypes from 'prop-types';
import Alert from './Alert';
import NoResultsMessage from './NoResultsMessage';

const SearchResultMessage = ({
  error,
  isMobile,
  message,
  resultRef,
  resultsFound,
  searchStarted,
}) => {
  if (error) {
    return (
      <Alert
        displayType="warning"
        title="Find VA locations isn’t working right now"
        description={message}
      />
    );
  }

  if (searchStarted && !resultsFound) {
    return (
      <NoResultsMessage isMobileListView={isMobile} resultRef={resultRef} />
    );
  }

  return (
    <p className="search-result-title">
      Please enter a location (street, city, state, or postal code) and facility
      type, then click search above to find facilities.
    </p>
  );
};

SearchResultMessage.propTypes = {
  error: PropTypes.any,
  isMobile: PropTypes.bool,
  message: PropTypes.string,
  resultRef: PropTypes.any,
  resultsFound: PropTypes.bool,
  searchStarted: PropTypes.bool,
};

export default SearchResultMessage;
