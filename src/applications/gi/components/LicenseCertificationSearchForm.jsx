import React, { useEffect, useState } from 'react';
import ADDRESS_DATA from 'platform/forms/address/data';
import PropTypes from 'prop-types';
import Dropdown from './Dropdown';
import {
  capitalizeFirstLetter,
  filterLcResults,
  showLcParams,
} from '../utils/helpers';
import LicenseCertificationKeywordSearch from './LicenseCertificationKeywordSearch';
import LicenseCertificationAlert from './LicenseCertificationAlert';

const mappedStates = Object.entries(ADDRESS_DATA.states).map(state => {
  return { optionValue: state[0], optionLabel: state[1] };
});

export const updateDropdowns = (
  category = 'all',
  location = 'all',
  multiples = [],
) => {
  const initialDropdowns = [
    {
      label: 'category',
      options: [
        { optionValue: 'all', optionLabel: 'All' },
        { optionValue: 'License', optionLabel: 'License' },
        {
          optionValue: 'Certification',
          optionLabel: 'Certification',
        },
        {
          optionValue: 'Prep',
          optionLabel: 'Prep Course',
        },
      ],
      alt: 'category type',
      current: { optionValue: 'all', optionLabel: 'All' },
    },
    {
      label: 'state',
      options:
        multiples.length === 0
          ? [{ optionValue: 'all', optionLabel: 'All' }, ...mappedStates]
          : [
              { optionValue: 'all', optionLabel: 'All' },
              ...mappedStates.filter(mappedState =>
                multiples.find(
                  multiple => multiple.state === mappedState.optionValue,
                ),
              ),
            ],
      alt: 'state',
      current: { optionValue: 'all', optionLabel: 'All' },
    },
  ];

  // console.log('category', category);

  return initialDropdowns.map(dropdown => {
    if (dropdown.label === 'category') {
      // console.log('dropdownOptions', dropdown.options);
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
        current: dropdown.options.find(
          option => option.optionValue === location,
        ) ?? { ...dropdown.current },
      };
    }

    return dropdown;
  });
};

export const showMultipleNames = (suggestions, name) => {
  return suggestions.filter(suggestion => suggestion.name === name);
};

export const categoryCheck = type => {
  if (type === 'license') {
    return true;
  }
  if (type === 'prep') return true;

  return false;
};

export const checkAlert = (
  type,
  filteredStates,
  currentLocation,
  newLocation,
) => {
  if (filteredStates.length > 1) {
    return true;
  }

  if (categoryCheck(type) && currentLocation !== newLocation) {
    return true;
  }

  if (type === 'Certification' && currentLocation !== 'all') {
    if (!currentLocation) {
      return false;
    }
    return true;
  }

  return false;
};

export default function LicenseCertificationSearchForm({
  suggestions,
  handleSearch,
  handleShowModal,
  location,
  handleReset,
}) {
  const [dropdowns, setDropdowns] = useState(updateDropdowns());
  const [filteredSuggestions, setFilteredSuggestions] = useState(suggestions);
  const [showAlert, setShowAlert] = useState(false);
  const [name, setName] = useState('');
  const [multipleOptions, setMultipleOptions] = useState(null);

  const { nameParam, categoryParam, stateParam } = showLcParams(location);

  const [categoryDropdown, locationDropdown] = dropdowns;

  // Use params if present to assign initial dropdown values
  useEffect(
    () => {
      setDropdowns(updateDropdowns(categoryParam, stateParam));
      setName(nameParam);
    },
    [categoryParam, stateParam],
  );

  // Filter suggestions based on query string
  useEffect(
    () => {
      const newSuggestions = filterLcResults(suggestions, name, {
        type: categoryDropdown.current.optionValue,
        state: locationDropdown.current.optionValue,
      });

      // console.log('newSuggestions', newSuggestions);

      if (name.trim() !== '') {
        newSuggestions.unshift({
          lacNm: name,
          // link: 'lce/',
          type: 'all',
        });
      }
      setFilteredSuggestions(newSuggestions);
    },
    [name, suggestions, dropdowns],
  );

  // Set state value to all whenever cert is selected
  useEffect(
    () => {
      if (
        categoryDropdown.current.optionValue === 'certification' &&
        locationDropdown.current.optionValue !== 'all'
      ) {
        setDropdowns(updateDropdowns('certification', 'all'));
      }
    },
    [dropdowns],
  );

  const handleChange = e => {
    const multiples =
      multipleOptions || showMultipleNames(filteredSuggestions, name);

    let allowContinue = false;

    if (name) {
      if (
        e.target.id === 'state' &&
        categoryCheck(categoryDropdown.current.optionValue)
      ) {
        if (
          multiples.length === 2 &&
          locationDropdown.options.length - 1 === mappedStates.length
        ) {
          return handleShowModal(
            e.target.id,
            `The ${name} ${
              categoryDropdown.current.optionValue
            } is specific to the state of ${
              locationDropdown.current.optionLabel
            }, if you modify the state you will not get results you are looking for.`,
            () => {
              setDropdowns(
                updateDropdowns(categoryDropdown.current.optionValue, 'all'),
              );
              setShowAlert(false);
              setName('');
            },
          );
        }
        allowContinue = true;
      }

      if (categoryDropdown.current.optionValue !== 'all' && !allowContinue) {
        return handleShowModal(
          e.target.id,
          'Your current selection will be lost, if you choose continue to change, you will have to start over',
          () => {
            setDropdowns(updateDropdowns());
            setShowAlert(false);
            setName('');
          },
        );
      }
    }

    allowContinue = true;

    let newDropdowns;

    if (e.target.id === 'category') {
      newDropdowns = updateDropdowns(
        e.target.value,
        locationDropdown.current.optionValue,
      );
      setShowAlert(
        checkAlert(
          e.target.value,
          multiples,
          locationDropdown.current.optionValue,
          locationDropdown.current.optionValue,
        ),
      );
    } else {
      newDropdowns = updateDropdowns(
        categoryDropdown.current.optionValue,
        e.target.value,
        multiples,
      );
    }

    if (allowContinue) {
      // console.log('newDropdowns 🟢', newDropdowns);
      setDropdowns(newDropdowns);
    }

    return newDropdowns;
  };

  const onSelection = selection => {
    const { selected } = selection;
    if (selected !== filteredSuggestions[0]) {
      const { eduLacTypeNm: type, state, lacNm: _name } = selected;
      const multiples = showMultipleNames(filteredSuggestions, _name);

      // console.log({ type, state, name });

      if (multiples.length > 1) {
        setMultipleOptions(multiples);
      }

      const newDropdowns =
        multiples.length > 1
          ? updateDropdowns(type, 'all', multiples)
          : updateDropdowns(type, state);

      // console.log('newDropdowns', newDropdowns);

      setShowAlert(
        checkAlert(
          type,
          multiples,
          locationDropdown.current.optionValue,
          state,
        ),
      );

      setName(_name);
      setDropdowns(newDropdowns);
    }
  };

  const handleClearInput = () => {
    setName('');
    setDropdowns(updateDropdowns(categoryDropdown.current.optionValue));
    setShowAlert(false);
  };

  const onUpdateAutocompleteSearchTerm = value => {
    setName(value);
  };

  return (
    <form>
      <Dropdown
        disabled={false}
        label={capitalizeFirstLetter(categoryDropdown.label)}
        visible
        name={categoryDropdown.label}
        options={categoryDropdown.options}
        value={categoryDropdown.current.optionValue}
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
        value={locationDropdown.current.optionValue ?? 'all'}
        onChange={handleChange}
        alt={locationDropdown.alt}
        selectClassName="lc-dropdown-filter"
        required={locationDropdown.label === 'category'}
      >
        {showAlert ? (
          <LicenseCertificationAlert
            changeStateAlert={
              categoryCheck(categoryDropdown.current.optionValue) &&
              !multipleOptions
            }
            changeDropdownsAlert={
              categoryCheck(categoryDropdown.current.optionValue) &&
              multipleOptions?.length > 1
            }
            changeStateToAllAlert={
              categoryDropdown.current.optionValue === 'certification'
            }
            visible={showAlert}
            name={name}
            state={locationDropdown.current.optionLabel}
            type={categoryDropdown.current.optionValue}
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
          onSelection={onSelection}
          handleClearInput={handleClearInput}
          onUpdateAutocompleteSearchTerm={onUpdateAutocompleteSearchTerm}
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
          onClick={() =>
            handleReset(() => {
              setDropdowns(updateDropdowns());
              setName('');
              setShowAlert(false);
            })
          }
        />
      </div>
    </form>
  );
}

LicenseCertificationSearchForm.propTypes = {
  handleSearch: PropTypes.func.isRequired,
  suggestions: PropTypes.array,
};
