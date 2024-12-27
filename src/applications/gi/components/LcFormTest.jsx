// LicenseCertificationSearchForm.js
import React, { useEffect, useState, useMemo } from 'react';
import {
  updateDropdowns,
  showMultipleNames,
  checkAlert,
  filterLcResults,
  useSearchState,
  capitalizeFirstLetter,
} from '../utils/helpers';
import Dropdown from './Dropdown';
import LicenseCertificationKeywordSearch from './LicenseCertificationKeywordSearch';
import LicenseCertificationAlert from './LicenseCertificationAlert';

export default function LcFormTest({
  suggestions,
  handleShowModal,
  handleReset,
}) {
  const { searchState, updateSearch, navigateToResults } = useSearchState();
  const { name, categoryParam, stateParam } = searchState;

  const [dropdowns, setDropdowns] = useState(updateDropdowns());
  const [showAlert, setShowAlert] = useState(false);

  const [categoryDropdown, locationDropdown] = dropdowns;

  // Filter suggestions based on current search state
  const filteredSuggestions = useMemo(
    () => {
      const results = filterLcResults(suggestions, name, {
        type: categoryDropdown.current.optionValue,
        state: locationDropdown.current.optionValue,
      });

      if (name.trim() !== '') {
        results.unshift({
          name,
          link: 'lce/',
          type: 'all',
        });
      }

      return results;
    },
    [
      suggestions,
      name,
      categoryDropdown.current.optionValue,
      locationDropdown.current.optionValue,
    ],
  );

  // Update dropdowns when params change
  useEffect(
    () => {
      // console.log('params updated', { categoryParam, stateParam });
      setDropdowns(updateDropdowns(categoryParam, stateParam));
    },
    [categoryParam, stateParam],
  );

  // Update query params AFTER onSelection in special cases
  useEffect(
    () => {
      // console.log('dropdowns changed, updateSearh 🟢', {
      //   currentDropdowns: dropdowns,
      // });

      if (categoryDropdown.current.optionValue === 'certification') {
        updateSearch({
          state: 'all',
          category: 'certification',
          name,
        });
      }
      if (categoryDropdown.current.optionValue === 'license') {
        updateSearch({
          state: locationDropdown.current.optionValue,
          category: 'license',
          name,
        });
      }
    },
    [dropdowns],
  );

  const handleChange = e => {
    const multiples = showMultipleNames(filteredSuggestions, name);

    if (name) {
      if (
        e.target.id === 'state' &&
        categoryParam === 'license' &&
        multiples.length === 2
      ) {
        return handleShowModal(
          e.target.id,
          `The ${name} is specific to the state of ${stateParam}, if you modify the state you will not get results you are looking for.`,
        );
      }

      if (categoryParam !== 'all') {
        return handleShowModal(
          e.target.id,
          'Your current selection will be lost, if you choose continue to change, you will have to start over',
        );
      }
    }

    return updateSearch({ [e.target.id]: e.target.value });
  };

  const onUpdateAutocompleteSearchTerm = value => {
    updateSearch({ name: value });
  };

  const onSelection = selection => {
    if (selection.selected !== filteredSuggestions[0]) {
      const { type, state, name: _name } = selection;
      const multiples = showMultipleNames(filteredSuggestions, _name);

      const newDropdowns =
        multiples.length > 1
          ? updateDropdowns(type, multiples)
          : updateDropdowns(type, state);

      setShowAlert(
        checkAlert(
          type,
          multiples,
          locationDropdown.current.optionValue,
          state,
        ),
      );

      // console.log('setting newDropdowns 🚀', newDropdowns);
      setDropdowns(newDropdowns);
    }
  };

  const handleClearInput = () => {
    updateSearch({ name: '' });
    setShowAlert(false);
  };

  const handleSubmit = () => {
    navigateToResults();
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
        value={locationDropdown.current.optionValue ?? 'all'} // align here
        onChange={handleChange}
        alt={locationDropdown.alt}
        selectClassName="lc-dropdown-filter"
        required={locationDropdown.label === 'category'}
      >
        {showAlert && name.length > 0 ? (
          <LicenseCertificationAlert
            changeStateAlert={
              categoryDropdown.current.optionValue === 'license' &&
              showMultipleNames(filteredSuggestions, name).length === 2
            }
            changeDropdownsAlert={
              categoryDropdown.current.optionValue === 'license' &&
              showMultipleNames(filteredSuggestions, name).length > 2
            }
            changeStateToAllAlert={
              categoryDropdown.current.optionValue === 'certification'
            }
            visible={showAlert}
            name={name}
            state={locationDropdown.current.optionLabel}
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
        <va-button text="Submit" onClick={handleSubmit} />
        <va-button
          text="Reset Search"
          className="usa-button-secondary reset-search"
          onClick={() =>
            handleReset(() => {
              setDropdowns(updateDropdowns());
              setShowAlert(false);
            })
          }
        />
      </div>
    </form>
  );
}
