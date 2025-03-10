import React, { useEffect, useState } from 'react';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';

import {
  capitalizeFirstLetter,
  handleLcResultsSearch,
  showLcParams,
  updateCategoryDropdown,
  updateQueryParam,
} from '../utils/helpers';

import { filterLcResults, fetchLicenseCertificationResults } from '../actions';

import LicenseCertificationKeywordSearch from '../components/LicenseCertificationKeywordSearch';
import Dropdown from '../components/Dropdown';
import LicesnseCertificationServiceError from '../components/LicesnseCertificationServiceError';

export default function LicenseCertificationSearchForm() {
  const history = useHistory();
  const location = useLocation();

  const { nameParam, categoryParams } = showLcParams(location);

  const dispatch = useDispatch();

  const [dropdown, setDropdown] = useState(updateCategoryDropdown());
  const [name, setName] = useState('');

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
    if (!hasFetchedOnce) {
      const controller = new AbortController();

      dispatch(fetchLicenseCertificationResults(controller.signal));

      return () => {
        controller.abort();
      };
    }
    return null;
  }, []);

  useEffect(
    () => {
      dispatch(filterLcResults(name, dropdown.current.optionValue));
      return null;
    },
    [name, dropdown],
  );

  // If available, use url query params to assign initial dropdown values
  useEffect(() => {
    if (categoryParams) {
      setDropdown(updateCategoryDropdown(categoryParams[0]));
    }

    if (nameParam) {
      setName(nameParam);
    }
    return undefined;
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
  };

  const handleChange = e => {
    setDropdown(updateCategoryDropdown(e.target.value));
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
              label={capitalizeFirstLetter(dropdown.label)}
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
