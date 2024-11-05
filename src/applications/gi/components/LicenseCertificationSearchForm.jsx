import React, { useRef, useState } from 'react';
import ADDRESS_DATA from 'platform/forms/address/data';
import PropTypes from 'prop-types';
import Dropdown from './Dropdown';
import { updateLcFilterDropdowns } from '../utils/helpers';
// import { VaSearchInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const dropdownSchema = [
  {
    label: 'category',
    options: [
      { optionValue: '', optionLabel: '-Select-' },
      { optionValue: 'licenses', optionLabel: 'License' },
      {
        optionValue: 'certifications',
        optionLabel: 'Certification',
      },
      {
        optionValue: 'preps',
        optionLabel: 'Prep Course',
      },
    ],
    alt: 'category type',
    current: { optionValue: 'all', optionLabel: '-Select-' },
  },
  {
    label: 'state',
    options: [
      { optionValue: 'All', optionLabel: 'All' },
      ...Object.entries(ADDRESS_DATA.states).map(state => {
        return { optionValue: state[0], optionLabel: state[1] };
      }),
    ],
    alt: 'state',
    current: { optionValue: 'all', optionLabel: 'All' },
  },
];

// const mockSuggestions = [
//   'foreign study',
//   'forever gi bill',
//   'form',
//   'form finder',
//   'form search',
//   'forms',
// ];

export default function LicenseCertificationSearchForm({ handleSearch }) {
  const [dropdowns, setDropdowns] = useState(dropdownSchema);
  const nameSearchRef = useRef(null);

  const handleReset = () => {
    setDropdowns(dropdownSchema);
    nameSearchRef.current.value = '';
  };

  const handleChange = e => {
    const newDropdowns = updateLcFilterDropdowns(dropdowns, e.target);
    setDropdowns(newDropdowns);
  };

  return (
    <form>
      <Dropdown
        disabled={false}
        label={capitalizeFirstLetter(dropdowns[0].label)}
        visible
        name={dropdowns[0].label}
        options={dropdowns[0].options}
        value={dropdowns[0].current.optionValue}
        onChange={handleChange}
        alt={dropdowns[0].alt}
        selectClassName="lc-dropdown-filter"
        required={dropdowns[0].label === 'category'}
      />
      <div>
        {/* <VaSearchInput */}
        <va-text-input
          label={
            dropdowns[0].current.optionValue !== 'Prep Course'
              ? 'License/Certification Name'
              : 'Course Name'
          }
          ref={nameSearchRef}
          // suggestions={mockSuggestions}
          className="lc-dropdown-filter"
          style={{ border: 'red' }}
        />
      </div>

      {dropdowns[0].current.optionLabel !== 'Prep Course' && (
        <Dropdown
          disabled={false}
          label={capitalizeFirstLetter(dropdowns[1].label)}
          visible
          name={dropdowns[1].label}
          options={dropdowns[1].options}
          value={dropdowns[1].current.optionValue}
          onChange={handleChange}
          alt={dropdowns[1].alt}
          selectClassName="lc-dropdown-filter"
          required={dropdowns[1].label === 'category'}
        />
      )}
      <div className="button-wrapper row vads-u-padding-y--6 vads-u-padding-x--1">
        <va-button
          text="Submit"
          onClick={() => handleSearch(nameSearchRef.current.value)}
        />
        <va-button
          text="Reset Search"
          className="usa-button-secondary"
          onClick={handleReset}
        />
      </div>
    </form>
  );
}

LicenseCertificationSearchForm.propTypes = {
  handleSearch: PropTypes.func.isRequired,
};
