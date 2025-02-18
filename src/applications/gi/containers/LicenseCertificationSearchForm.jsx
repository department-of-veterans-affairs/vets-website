import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useSelector } from 'react-redux';
import { useLcpFilter } from '../utils/useLcpFilter';
import {
  capitalizeFirstLetter,
  showLcParams,
  updateCategoryDropdown,
} from '../utils/helpers';

import LicenseCertificationKeywordSearch from '../components/LicenseCertificationKeywordSearch';
import Dropdown from '../components/Dropdown';
import LicesnseCertificationServiceError from '../components/LicesnseCertificationServiceError';

export default function LicenseCertificationSearchForm({
  handleSearch,
  location,
  handleReset,
  flag,
}) {
  const [dropdown, setDropdown] = useState(updateCategoryDropdown());
  const [name, setName] = useState('');

  const { hasFetchedOnce, fetchingLc, filteredResults, error } = useSelector(
    state => state.licenseCertificationSearch,
  );

  const { nameParam, categoryParams } = showLcParams(location);

  useLcpFilter({
    flag,
    name,
    categoryValues: dropdown.current.optionValue,
  });

  const suggestions = [
    {
      lacNm: name,
      type: 'all',
    },
    ...filteredResults,
  ];

  // If available, use url query params to assign initial dropdown values
  useEffect(() => {
    if (categoryParams) {
      setDropdown(updateCategoryDropdown(categoryParams[0]));
    }

    if (nameParam) {
      setName(nameParam);
    }
  }, []);

  const handleChange = e => {
    setDropdown(updateCategoryDropdown(e.target.value));
  };

  const onSelection = selection => {
    const { selected } = selection;
    const { lacNm } = selected;

    setName(lacNm);
  };

  const handleClearInput = () => {
    setName('');
  };

  const onUpdateAutocompleteSearchTerm = value => {
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
                // suggestions={filteredResults}
                onSelection={onSelection}
                handleClearInput={handleClearInput}
                onUpdateAutocompleteSearchTerm={onUpdateAutocompleteSearchTerm}
              />
            </div>

            <div className="button-wrapper row">
              <VaButton
                className="va-button"
                text="Submit"
                onClick={() => handleSearch(dropdown.current.optionValue, name)}
              />
              <VaButton
                text="Reset Search"
                // className="reset-search"
                secondary
                onClick={() =>
                  handleReset(() => {
                    setName('');
                    setDropdown(updateCategoryDropdown());
                  })
                }
              />
            </div>
          </form>
        )}
    </>
  );
}

LicenseCertificationSearchForm.propTypes = {
  handleSearch: PropTypes.func.isRequired,
};
