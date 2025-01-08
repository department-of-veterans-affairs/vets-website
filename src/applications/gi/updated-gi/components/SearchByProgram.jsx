import React, { useState } from 'react';
import {
  VaButton,
  VaSelect,
  VaTextInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const SearchByProgram = () => {
  const distanceDropdownOptions = [
    { value: '5', label: 'within 5 miles' },
    { value: '15', label: 'within 15 miles' },
    { value: '25', label: 'within 25 miles' },
    { value: '50', label: 'within 50 miles' },
    { value: '75', label: 'within 75 miles' },
  ];
  const [distance, setDistance] = useState('25');

  const useLocation = e => {
    e.preventDefault();
  };

  const onSelectChange = e => {
    setDistance(e.target.value);
  };

  const search = () => {};

  return (
    <div className="vads-u-display--flex mobile:vads-u-flex-direction--column medium-screen:vads-u-flex-direction--row vads-u-justify-content--space-between mobile:vads-u-align-items--flex-start medium-screen:vads-u-align-items--flex-end">
      <VaTextInput
        className="tablet:vads-u-flex--3 mobile:vads-u-width--full vads-u-margin-right--2p5 mobile:vads-u-margin-top--neg2p5"
        name="program-name"
        type="text"
        label="Name of program"
        required
      />
      <VaTextInput
        className="tablet:vads-u-flex--3 mobile:vads-u-width--full vads-u-margin-right--2p5"
        name="program-location"
        type="text"
        label="City, state, or postal code"
        required
      />
      <div className="medium-screen:vads-u-flex--2 tablet:vads-u-flex--auto vads-u-margin-right--2p5 mobile:vads-u-margin-top--2p5">
        <button
          type="button"
          className="vads-u-line-height--3 vads-u-padding--0 vads-u-margin--0 vads-u-color--primary vads-u-background-color--white vads-u-font-weight--normal"
          onClick={useLocation}
        >
          <va-icon icon="near_me" size={3} />
          Use my location
        </button>
        <VaSelect
          name="program-distance"
          onVaSelect={onSelectChange}
          value={distance}
        >
          {distanceDropdownOptions.map(option => (
            <option value={option.value} key={option.value}>
              {option.label}
            </option>
          ))}
        </VaSelect>
      </div>
      <VaButton
        className="vads-u-flex--auto mobile:vads-u-margin-top--2p5"
        onClick={search}
        text="Search"
      />
    </div>
  );
};

export default SearchByProgram;
