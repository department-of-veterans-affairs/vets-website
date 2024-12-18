import React, { useEffect, useState } from 'react';
import ADDRESS_DATA from 'platform/forms/address/data';
import PropTypes from 'prop-types';
import Dropdown from './Dropdown';
import {
  capitalizeFirstLetter,
  filterLcResults,
  handleUpdateLcFilterDropdowns,
  matchFilterIndex,
} from '../utils/helpers';
import LicenseCertificationKeywordSearch from './LicenseCertificationKeywordSearch';
import LicenseCertificationAlert from './LicenseCertificationAlert';

const mappedStates = Object.entries(ADDRESS_DATA.states).map(state => {
  return { optionValue: state[0], optionLabel: state[1] };
});

export const updateDropdowns = (category = 'all', state = 'all') => {
  // console.log('updateDropdowns 🟢', { category, state });
  const initialDropdowns = [
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

  // console.log('newDropdowns', newDropdowns);
  return initialDropdowns.map(dropdown => {
    if (dropdown.label === 'category') {
      return {
        ...dropdown,
        current: dropdown.options.find(
          option => option.optionValue === category,
        ),
      };
    }

    if (dropdown.label === 'state') {
      return {
        ...dropdown,
        current: dropdown.options.find(option => option.optionValue === state),
      };
    }

    return dropdown;
  });
};

export default function LicenseCertificationSearchForm({
  suggestions,
  handleSearch,
  handleUpdateQueryParam,
  location,
  history,
}) {
  const [dropdowns, setDropdowns] = useState(updateDropdowns());
  const [filteredSuggestions, setFilteredSuggestions] = useState(suggestions);
  const [showAlert, setShowAlert] = useState(false);

  const searchParams = new URLSearchParams(location.search);
  const name = searchParams.get('name') ?? '';
  const category = searchParams.get('category') ?? 'all';
  const stateParam = searchParams.get('state') ?? 'all';

  const [categoryDropdown, locationDropdown] = dropdowns;

  // Update dropdown values when param values change
  useEffect(
    () => {
      setDropdowns(updateDropdowns(category, stateParam));
    },
    [category, stateParam],
  );

  // Update query params in special cases
  useEffect(
    () => {
      if (categoryDropdown.current.optionValue === 'certification') {
        handleUpdateQueryParam()('state', 'all');
      }
    },
    [dropdowns],
  );

  // Filter suggestions based on query string
  useEffect(
    () => {
      const newSuggestions = filterLcResults(suggestions, name, {
        type: categoryDropdown.current.optionValue,
        state: locationDropdown.current.optionValue,
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
    history.replace('/lc-search');
    setDropdowns(updateDropdowns());
  };

  const handleChange = e => {
    const { updatedField, selectedOption } = matchFilterIndex(
      dropdowns,
      e.target,
    );

    handleUpdateQueryParam()(e.target.id, e.target.value);

    if (
      dropdowns[updatedField].options[selectedOption].optionValue ===
      'certification'
    ) {
      setDropdowns(updateDropdowns('certification', 'all'));
    }

    const newDropdowns = handleUpdateLcFilterDropdowns(
      dropdowns,
      updatedField,
      selectedOption,
    );

    setDropdowns(newDropdowns);
  };

  const onUpdateAutocompleteSearchTerm = value => {
    handleUpdateQueryParam()('name', value);
  };

  const onSelection = selection => {
    const { type, state } = selection;

    const newDropdowns = updateDropdowns(type, state);

    if (type === 'license' && locationDropdown.current.optionValue !== state) {
      setShowAlert(true);
    }

    setDropdowns(newDropdowns);
  };

  const handleClearInput = () => {
    handleUpdateQueryParam()('name', '');
    setShowAlert(false);
  };

  return (
    <form>
      <Dropdown
        disabled={false}
        label={capitalizeFirstLetter(categoryDropdown.label)}
        visible
        name={categoryDropdown.label}
        options={categoryDropdown.options}
        value={categoryDropdown.current.optionValue} // align here
        onChange={handleChange}
        alt={categoryDropdown.alt}
        selectClassName="lc-dropdown-filter"
        required={categoryDropdown.label === 'category'}
      />

      <Dropdown
        disabled={categoryDropdown.current.optionValue === 'certification'}
        label={`${capitalizeFirstLetter(locationDropdown.label)}`}
        visible
        name={locationDropdown.label}
        options={locationDropdown.options}
        value={locationDropdown.current.optionValue} // align here
        onChange={handleChange}
        alt={locationDropdown.alt}
        selectClassName="lc-dropdown-filter"
        required={locationDropdown.label === 'category'}
      >
        {showAlert && name.length > 0 ? (
          <LicenseCertificationAlert
            changeStateAlert
            changeDropdownsAlert={false}
            changeStateToAllAlert={false}
            visible={showAlert}
            name={name}
            state={categoryDropdown.current.optionLabel}
          />
        ) : (
          <>
            (Note: Certifications are nationwide. Selecting a state from this
            dropdown will only impact licenses and prep courses)
          </>
        )}
      </Dropdown>
      <div>
        <LicenseCertificationKeywordSearch
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
          onClick={() =>
            handleSearch(
              categoryDropdown.current.optionValue,
              name,
              locationDropdown.current.optionValue,
            )
          }
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
