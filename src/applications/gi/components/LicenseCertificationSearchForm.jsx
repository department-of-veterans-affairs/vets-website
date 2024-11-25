import React, { useEffect, useState } from 'react';
import ADDRESS_DATA from 'platform/forms/address/data';
import PropTypes from 'prop-types';
import Dropdown from './Dropdown';
import { updateLcFilterDropdowns } from '../utils/helpers';
import LcKeywordSearch from './LcKeywordSearch';

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const mappedStates = Object.entries(ADDRESS_DATA.states).map(state => {
  return { optionValue: state[0], optionLabel: state[1] };
});

export const dropdownSchema = [
  {
    label: 'category',
    options: [
      { optionValue: 'all', optionLabel: 'All' },
      { optionValue: 'license', optionLabel: 'License' },
      {
        optionValue: 'certification',
        optionLabel: 'Certification',
      },
      {
        optionValue: 'prep',
        optionLabel: 'Prep Course',
      },
    ],
    alt: 'category type',
    current: { optionValue: 'all', optionLabel: 'All' },
  },
  {
    label: 'state',
    options: [{ optionValue: 'all', optionLabel: 'All' }, ...mappedStates],
    alt: 'state',
    current: { optionValue: 'all', optionLabel: 'All' },
  },
];

const filterSuggestions = (suggestions, value) => {
  // add filter options as arg
  if (!value) {
    return [];
  }

  return suggestions.filter(suggestion => {
    // TODO add logic to account for filterOptions
    return suggestion.name.toLowerCase().includes(value.toLowerCase());
  });
};

export default function LicenseCertificationSearchForm({
  suggestions,
  handleSearch,
}) {
  const [dropdowns, setDropdowns] = useState(dropdownSchema);
  const [name, setName] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState(suggestions);
  const [showStateAlert, setShowStateAlert] = useState(false);

  useEffect(
    () => {
      const newSuggestions = filterSuggestions(suggestions, name);

      if (name.trim() !== '') {
        newSuggestions.unshift({
          name,
          link: 'lce/', // verify link
          type: 'all', // verify type
        });
      }

      setFilteredSuggestions(newSuggestions);
    },
    [name, suggestions],
  );

  const handleReset = () => {
    setDropdowns(dropdownSchema);
    setName('');
  };

  const handleChange = e => {
    const newDropdowns = updateLcFilterDropdowns(dropdowns, e.target);
    setDropdowns(newDropdowns);
  };

  const onUpdateAutocompleteSearchTerm = value => {
    setName(value);
  };

  const onSelection = selection => {
    const { type, state } = selection; // TODO ensure state is added to response object
    const stateItem = mappedStates.find(_state => {
      return _state.optionValue === state;
    });

    const updateStateDropdown = dropdowns.map(dropdown => {
      return dropdown.label === 'state'
        ? {
            ...dropdown,
            current: {
              optionValue: stateItem.optionValue,
              optionLabel: stateItem.optionValue,
            },
          }
        : dropdown;
    });

    if (type === 'license' && dropdowns[1].current.optionValue !== state) {
      setDropdowns(updateStateDropdown);
      setShowStateAlert(true);
    }
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

      <Dropdown
        disabled={dropdowns[0].current.optionLabel === 'Certification'}
        label={`${capitalizeFirstLetter(dropdowns[1].label)}`}
        visible
        name={dropdowns[1].label}
        options={dropdowns[1].options}
        value={dropdowns[1].current.optionValue}
        onChange={handleChange}
        alt={dropdowns[1].alt}
        selectClassName="lc-dropdown-filter"
        required={dropdowns[1].label === 'category'}
      >
        {showStateAlert && name.length > 0 ? (
          <va-alert
            className="license-alert"
            // slim={true}
            // disable-analytics={true}
            visible={dropdowns[0].current.optionLabel === 'License'}
            // close-btn-aria-label={closeBtnAriaLabel}
            closeable={false}
            fullWidth={false}
            style={{ maxWidth: '30rem' }}
          >
            The state of {dropdowns[1].current.optionLabel} has been selected
            becuase the {name} license is specific to it.
          </va-alert>
        ) : (
          <>
            (Note: Certifications are nationwide. Selecting a state from this
            dropdown will only impact licenses and prep courses)
          </>
        )}
      </Dropdown>
      <div>
        <LcKeywordSearch
          inputValue={name}
          suggestions={filteredSuggestions}
          onUpdateAutocompleteSearchTerm={onUpdateAutocompleteSearchTerm}
          onSelection={onSelection}
        />
      </div>

      <div className="button-wrapper row vads-u-padding-y--6 vads-u-padding-x--1">
        <va-button
          text="Submit"
          onClick={() => handleSearch(name, dropdowns[0].current.optionValue)}
        />
        <va-button
          text="Reset Search"
          className="usa-button-secondary reset-search"
          onClick={handleReset}
        />
      </div>
    </form>
  );
}

LicenseCertificationSearchForm.propTypes = {
  handleSearch: PropTypes.func.isRequired,
  suggestions: PropTypes.array,
};
