import React, { useEffect, useState } from 'react';
import ADDRESS_DATA from 'platform/forms/address/data';
import PropTypes from 'prop-types';
import Dropdown from './Dropdown';
import {
  capitalizeFirstLetter,
  filterLcResults,
  handleUpdateLcFilterDropdowns,
} from '../utils/helpers';
import LcKeywordSearch from './LcKeywordSearch';

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

const resetStateDropdown = dropdowns => {
  return dropdowns.map(dropdown => {
    return dropdown.label === 'state'
      ? {
          ...dropdown,
          current: dropdown.options.find(
            option => option.optionValue === 'all',
          ),
        }
      : dropdown;
  });
};

export default function LicenseCertificationSearchForm({
  suggestions,
  handleSearch,
  handleUpdateQueryParam,
  location,
}) {
  const [dropdowns, setDropdowns] = useState(dropdownSchema);
  const [filteredSuggestions, setFilteredSuggestions] = useState(suggestions);
  const [showStateAlert, setShowStateAlert] = useState(false);

  const searchParams = new URLSearchParams(location.search);
  const name = searchParams.get('name') ?? '';
  const category = searchParams.get('category') ?? '';
  const stateParam = searchParams.get('state') ?? '';

  useEffect(
    () => {
      const newSuggestions = filterLcResults(suggestions, name, {
        type: dropdowns[0].current.optionValue,
      });

      if (name.trim() !== '') {
        newSuggestions.unshift({
          name,
          link: 'lce/',
          type: 'all',
        });
      }

      setFilteredSuggestions(newSuggestions);
    },
    [name, suggestions, dropdowns],
  );

  const handleReset = () => {
    setDropdowns(dropdownSchema);
  };

  const handleChange = e => {
    const newDropdowns = handleUpdateLcFilterDropdowns(dropdowns, e.target);

    if (newDropdowns[0].current.optionValue === 'certification') {
      setDropdowns(resetStateDropdown);
    }

    handleUpdateQueryParam()(e.target.id, e.target.value);

    setDropdowns(current => handleUpdateLcFilterDropdowns(current, e.target));
  };

  const onUpdateAutocompleteSearchTerm = value => {
    handleUpdateQueryParam()('name', value);
  };

  const onSelection = selection => {
    const { type, state } = selection;

    const updateDropdowns = dropdowns.map(dropdown => {
      if (dropdown.label === 'state') {
        return {
          ...dropdown,
          current: dropdown.options.find(option => {
            return option.optionValue === state;
          }),
        };
      }

      return {
        ...dropdown,
        current: dropdown.options.find(option => {
          return option.optionValue === type;
        }),
      };
    });

    if (type === 'license' && dropdowns[1].current.optionValue !== state) {
      setShowStateAlert(true);
    }

    setDropdowns(updateDropdowns);
  };

  const handleClearInput = () => {
    handleUpdateQueryParam()('name', '');
    setShowStateAlert(false);
  };

  return (
    <form>
      <Dropdown
        disabled={false}
        label={capitalizeFirstLetter(dropdowns[0].label)}
        visible
        name={dropdowns[0].label}
        options={dropdowns[0].options}
        value={category ?? dropdowns[0].current.optionValue}
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
        value={stateParam ?? dropdowns[1].current.optionValue}
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
          handleClearInput={handleClearInput}
        />
      </div>

      <div className="button-wrapper row vads-u-padding-y--6 vads-u-padding-x--1">
        <va-button
          text="Submit"
          onClick={() => handleSearch(dropdowns[0].current.optionValue, name)}
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
