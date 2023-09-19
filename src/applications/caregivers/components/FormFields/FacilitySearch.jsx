import React, { useState } from 'react';
import { VaSearchInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const FacilitySearch = () => {
  // Using React's useState to manage the input state
  const [input, setInput] = useState('');

  // Handler for the input change
  const handleInputChange = e => {
    setInput(e.target.value);
  };

  // Handler for the form submission
  const handleSubmit = e => {
    e.preventDefault();
    // Whatever you want to do onSubmit
    // For example, you can make an API call here with the input value
  };

  return (
    <>
      <div
        role="search"
        className="vads-u-padding-top--2 vads-u-padding-bottom--3 vads-u-padding-left--4 vads-u-padding-right--3 vads-u-background-color--gray-lightest"
      >
        <p
          className="vads-u-margin-top--0 vads-u-margin-bottom--1p5"
          aria-hidden="true"
        >
          Search by city, state or postal code
        </p>
        <VaSearchInput
          id="preferred-facility-search"
          buttonText="Search"
          value={input}
          label="Search"
          onInput={handleInputChange}
          onSubmit={handleSubmit}
        />
      </div>
    </>
  );
};

export default FacilitySearch;
