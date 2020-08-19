import React from 'react';

function SearchResultMessage({
  message,
  error,
  resultsFound,
  resultRef,
  facilityType,
}) {
  const renderMessage = (err, msg, found, ref, facility) => {
    if (facility && err) {
      return (
        <div className="search-result-title facility-result" ref={ref}>
          <p>{msg}</p>
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
    } else if (facility && !found) {
      return (
        <div className="search-result-title facility-result" ref={ref}>
          We didn't find any facilities near you. <br />
          <strong>To try again, please enter a different:</strong>
          <ul className="vads-u-margin-y--1p5">
            <li>
              <strong>Search term</strong> (street, city, state, or postal
              code), <strong>or</strong>
            </li>
            <li>
              <strong>Service type</strong> (like “primary care”), and select
              the option that best meets your needs
            </li>
          </ul>
          Then click <strong>Search</strong>.
        </div>
      );
    }

    return (
      <div className="search-result-title facility-result">
        Please enter a location (street, city, state or postal code) and click
        search above to find facilities.
      </div>
    );
  };

  return renderMessage(error, message, resultsFound, resultRef, facilityType);
}

export default SearchResultMessage;
