import React, { useEffect, useState } from 'react';
import ADDRESS_DATA from 'platform/forms/address/data';
import PropTypes from 'prop-types';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
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
          optionValue: 'Prep Course',
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
        current: dropdown.options.find(
          option => option.optionValue === location,
        ) ?? { ...dropdown.current },
      };
    }

    return dropdown;
  });
};

export const showMultipleNames = (suggestions, nameInput) => {
  return suggestions.filter(
    suggestion => suggestion.lacNm.toLowerCase() === nameInput?.toLowerCase(),
  );
};

export const categoryCheck = type => {
  if (type === 'License') {
    return true;
  }
  if (type === 'Prep Course') return true;

  return false;
};

export const checkAlert = (type, multiples, currentLocation, newLocation) => {
  if (multiples.length > 1 && type !== 'Certification') {
    return true;
  }

  if (categoryCheck(type) && currentLocation !== newLocation) {
    return true;
  }

  if (type === 'Certification' && currentLocation !== 'all') {
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

  // If available, use url query params to assign initial dropdown values
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

      if (name.trim() !== '') {
        newSuggestions.unshift({
          lacNm: name,
          type: 'all',
        });
      }
      setFilteredSuggestions(newSuggestions);
    },
    [name, suggestions, dropdowns],
  );

  const handleChange = e => {
    const multiples =
      multipleOptions ?? showMultipleNames(filteredSuggestions, name);

    let allowContinue = false;

    // check if selection combo should enable the modal
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
              setMultipleOptions(null);
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
            setMultipleOptions(null);
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
      setDropdowns(newDropdowns);
    }

    return newDropdowns;
  };

  const onSelection = selection => {
    const { selected } = selection;

    if (selected !== filteredSuggestions[0]) {
      const { eduLacTypeNm: type, state, lacNm: _name } = selected;
      const multiples = showMultipleNames(filteredSuggestions, _name);

      if (multiples.length > 1) {
        setMultipleOptions(multiples);
      }

      const _state = type === 'Certification' ? 'all' : state;

      const newDropdowns =
        multiples.length > 1
          ? updateDropdowns(type, 'all', multiples)
          : updateDropdowns(type, _state);

      setShowAlert(
        checkAlert(
          type,
          multiples,
          locationDropdown.current.optionValue,
          _state,
        ),
      );

      setName(_name);
      setDropdowns(newDropdowns);
    }
  };

  const handleClearInput = () => {
    setName('');
    setShowAlert(false);
    setMultipleOptions(null);
    setDropdowns(
      updateDropdowns(
        categoryDropdown.current.optionValue,
        locationDropdown.current.optionValue,
      ),
    );
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
        disabled={categoryDropdown.current.optionValue === 'Certification'}
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
              categoryDropdown.current.optionValue === 'Certification'
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

      <div className="button-wrapper vads-u-flex row vads-u-padding-y--6 vads-u-padding-x--1">
        <VaButton
          text="Submit"
          onClick={() =>
            handleSearch(
              categoryDropdown.current.optionValue,
              name,
              locationDropdown.current.optionValue,
            )
          }
        />
        <VaButton
          text="Reset Search"
          className="reset-search"
          secondary
          onClick={() =>
            handleReset(() => {
              setDropdowns(updateDropdowns());
              setName('');
              setShowAlert(false);
              setMultipleOptions(null);
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
