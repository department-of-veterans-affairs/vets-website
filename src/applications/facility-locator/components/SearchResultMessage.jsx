import React from 'react';
import PropTypes from 'prop-types';
import Alert from './Alert';

const SearchResultMessage = ({
  message,
  error,
  resultsFound,
  resultRef,
  facilityType,
}) => {
  if (facilityType && error) {
    return (
      <div className="search-result-title" ref={resultRef}>
        <p>{message}</p>
        <p>
          If you need care right away for a minor illness or injury, select
          Urgent care under facility type, then select either VA or community
          providers as the service type.
        </p>
        <p>
          If you have a medical emergency, please go to your nearest emergency
          room or call 911.
        </p>
      </div>
    );
  } else if (facilityType && !resultsFound) {
    return (
      <div className="search-result-title" ref={resultRef}>
        <Alert
          displayType="error"
          title="System Error!"
          description="Sorry, something went wrong on our end  - please try searching again later."
        />
      </div>
    );
  }

  return (
    <div className="search-result-title">
      Please enter a location (street, city, state, or postal code) and facility
      type, then click search above to find facilities.
    </div>
  );
};

SearchResultMessage.propTypes = {
  message: PropTypes.string,
  error: PropTypes.any,
  resultsFound: PropTypes.bool,
  resultRef: PropTypes.any,
  facilityType: PropTypes.string,
};

export default SearchResultMessage;
