import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { fetchMapBoxBBoxCoordinates } from '../../actions/fetchMapBoxBBoxCoordinates';
import { FacilityList } from './FacilityList';

const FacilitySearch = props => {
  const { value } = props;
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [coordinates, setCoordinates] = useState(null);

  const handleInputChange = e => {
    setInput(e.target.value);
  };

  const handleClick = async event => {
    event.preventDefault();
    setLoading(true);

    // Check if input is empty
    if (!input.trim()) {
      setError('Please provide a city, state or postal code');
      setLoading(false);
      return;
    }

    setError(null);
    setCoordinates(null);

    const response = await fetchMapBoxBBoxCoordinates(input);
    if (
      response.type === 'NO_SEARCH_RESULTS' ||
      response.type === 'SEARCH_FAILED'
    ) {
      setError(response.errorMessage);
    } else {
      setCoordinates(response);
    }
    setLoading(false);
  };

  return (
    <>
      <div
        role="search"
        className="vads-u-padding-top--2 vads-u-padding-bottom--3 vads-u-padding-left--4 vads-u-padding-right--3 vads-u-background-color--gray-lightest"
      >
        <p className="vads-u-margin-top--0 vads-u-margin-bottom--1p5">
          Search by city, state or postal code
        </p>
        <va-text-input
          hint={null}
          label=""
          aria-label="Preferred Facility Search Input"
          message-aria-describedby="preferred-facility-search"
          name="preferred-facility-search"
          onInput={handleInputChange}
          error={error}
          required
        />
        <button onClick={handleClick}>Search</button>
      </div>

      {loading && (
        <va-loading-indicator
          label="Loading"
          message="Loading available facilities..."
          set-focus
        />
      )}
      {coordinates && (
        <FacilityList
          input={input}
          coordinates={coordinates}
          value={value}
          {...props}
        />
      )}
    </>
  );
};

FacilitySearch.propTypes = {
  formContext: PropTypes.object,
  onChange: PropTypes.func,
  plannedClinic: PropTypes.string,
  value: PropTypes.string,
};

export default FacilitySearch;
