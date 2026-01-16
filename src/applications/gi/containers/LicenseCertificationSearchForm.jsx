import React, { useEffect, useState } from 'react';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import recordEvent from 'platform/monitoring/record-event';
import {
  focusElement,
  handleLcResultsSearch,
  showLcParams,
  updateCategoryDropdown,
  updateQueryParam,
} from '../utils/helpers';
import { fetchLicenseCertificationResults, filterLcResults } from '../actions';

import LicenseCertificationKeywordSearch from '../components/LicenseCertificationKeywordSearch';
import Dropdown from '../components/Dropdown';
import LicesnseCertificationServiceError from '../components/LicesnseCertificationServiceError';

export default function LicenseCertificationSearchForm() {
  const history = useHistory();
  const location = useLocation();

  const { nameParam, categoryParams } = showLcParams(location);

  const [dropdown, setDropdown] = useState(updateCategoryDropdown());
  const [name, setName] = useState('');
  const [shouldFocusDropdown, setShouldFocusDropdown] = useState(false);

  const dispatch = useDispatch();

  const { hasFetchedOnce, fetchingLc, filteredResults, error } = useSelector(
    state => state.licenseCertificationSearch,
  );

  const suggestions = [
    {
      lacNm: name,
      type: 'all',
    },
    ...filteredResults,
  ];

  useEffect(() => {
    document.title = `Licenses, certifications, and prep courses: GI Bill® Comparison Tool  | Veterans Affairs`;
  }, []);

  useEffect(() => {
    if (!hasFetchedOnce) {
      dispatch(fetchLicenseCertificationResults());
    }
    return null;
  }, []);

  useEffect(
    () => {
      return dispatch(filterLcResults(name, dropdown.current.optionValue));
    },
    [name, dropdown.current.optionValue],
  );

  useEffect(
    () => {
      if (shouldFocusDropdown) {
        const selectElement = document.getElementById(dropdown.label);
        if (selectElement) {
          focusElement(selectElement, 0);
        }
        setShouldFocusDropdown(false);
      }
    },
    [shouldFocusDropdown, dropdown.label],
  );

  // If available, use url query params to assign initial values ONLY on mount
  useEffect(() => {
    if (categoryParams) {
      setDropdown(updateCategoryDropdown(categoryParams[0]));
    }

    if (nameParam) {
      setName(nameParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (category, nameInput) => {
    const newParams = {
      category: [category],
      name: nameInput,
    };

    updateQueryParam(history, location, newParams);
    handleLcResultsSearch(
      history,
      newParams.category,
      nameInput,
      'all',
      category,
    );
  };

  const handleReset = () => {
    history.replace('/licenses-certifications-and-prep-courses');
    setName('');
    setDropdown(updateCategoryDropdown());
    setShouldFocusDropdown(true);
  };

  const handleChange = e => {
    setDropdown(updateCategoryDropdown(e.target.value));
    recordEvent({
      event: 'gibct-form-change',
      'gibct-form-field': e.target.name,
      'gibct-form-value': e.target.value,
    });
  };

  const onSelection = selection => {
    const { selected } = selection;
    const { lacNm } = selected;

    setName(lacNm);
  };

  const updateAutocompleteSearchTerm = value => {
    setName(value);
  };

  return (
    <>
      {error && <LicesnseCertificationServiceError />}
      {fetchingLc && <va-loading-indicator message="Loading..." />}
      {!fetchingLc &&
        hasFetchedOnce && (
          <form>
            <Dropdown
              disabled={false}
              label="Category type"
              visible
              name={dropdown.label}
              options={dropdown.options}
              value={dropdown.current.optionValue}
              onChange={handleChange}
              alt={dropdown.alt}
              selectClassName="dropdown-filter"
              required={dropdown.label === 'category'}
            />
            <div>
              <LicenseCertificationKeywordSearch
                inputValue={name}
                suggestions={suggestions}
                onSelection={onSelection}
                handleClearInput={() => updateAutocompleteSearchTerm('')}
                onUpdateAutocompleteSearchTerm={updateAutocompleteSearchTerm}
              />
            </div>

            <div className="button-wrapper row">
              <VaButton
                className="va-button"
                text="Submit"
                onClick={() => handleSearch(dropdown.current.optionValue, name)}
              />
              <VaButton text="Reset search" secondary onClick={handleReset} />
            </div>
          </form>
        )}
    </>
  );
}
