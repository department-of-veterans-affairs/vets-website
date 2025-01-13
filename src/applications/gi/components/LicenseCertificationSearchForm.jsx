import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import Dropdown from './Dropdown';
import {
  capitalizeFirstLetter,
  categoryCheck,
  checkAlert,
  filterLcResults,
  mappedStates,
  showLcParams,
  showMultipleNames,
  updateDropdowns,
} from '../utils/helpers';
import LicenseCertificationKeywordSearch from './LicenseCertificationKeywordSearch';
import LicenseCertificationAlert from './LicenseCertificationAlert';

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
        selectClassName="dropdown-filter"
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
        selectClassName="dropdown-filter"
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
