import React from 'react';
import { VaSearchInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const FacilitySearch = () => {
  return (
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
        value=""
        label="Search by city, state or postal code"
        onInput={function noRefCheck() {}}
        onSubmit={function noRefCheck() {}}
      />
    </div>
  );
};

export default FacilitySearch;
