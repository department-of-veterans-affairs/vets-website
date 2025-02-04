import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import ADDRESS_DATA from 'platform/forms/address/data';

import {
  VaCheckboxGroup,
  VaPagination,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import PropTypes from 'prop-types';
import { filterLcResults, fetchLicenseCertificationResults } from '../actions';
import {
  capitalizeFirstLetter,
  formatResultCount,
  handleLcResultsSearch,
  isSmallScreen,
  showLcParams,
  showMultipleNames,
  updateStateDropdown,
} from '../utils/helpers';
// import { useLcpFilter } from '../utils/useLcpFilter';
import LicesnseCertificationServiceError from '../components/LicesnseCertificationServiceError';
import Dropdown from '../components/Dropdown';
// import SearchAccordion from '../components/SearchAccordion';
import LicenseCertificationFilterAccordion from '../components/LicenseCertificationFilterAccordion';
import { lacpCategoryList } from '../constants';

const checkboxMap = (categories, checkedList) => {
  return [
    {
      name: categories[0],
      checked: checkedList.includes(categories[0]),
      label: capitalizeFirstLetter(categories[0]),
    },
    {
      name: categories[1],
      checked: checkedList.includes(categories[1]),
      label: capitalizeFirstLetter(categories[1]),
    },
    {
      name: categories[2],
      checked: checkedList.includes(categories[2]),
      label: capitalizeFirstLetter(categories[2]),
    },
    {
      name: categories[3],
      checked: checkedList.includes(categories[3]),
      label: capitalizeFirstLetter(categories[3]),
    },
  ];
};

// export default function LicenseCertificationSearchResults({ flag }) {
export default function LicenseCertificationSearchResults() {
  const location = useLocation();
  const history = useHistory();
  // const { nameParam, categoryParams, stateParam } = showLcParams(location);
  const { nameParam, categoryParams } = showLcParams(location);

  const [currentPage, setCurrentPage] = useState(1);
  const [smallScreen, setSmallScreen] = useState(isSmallScreen());
  const [allowUpdate, setAllowUpdate] = useState(false);
  const [activeCategories, setActiveCategories] = useState(categoryParams);
  const [categoryCheckboxes, setCategoryCheckboxes] = useState(
    checkboxMap(lacpCategoryList, categoryParams),
  );

  const dispatch = useDispatch();

  const { hasFetchedOnce, fetchingLc, filteredResults, error } = useSelector(
    state => state.licenseCertificationSearch,
  );

  const handleSearch = (categories, name, state) => {
    const newParams = {
      category: categories,
      name,
      state,
    };

    setAllowUpdate(true);
    setActiveCategories(categories);
    handleLcResultsSearch(history, newParams.category, name, state);
  };

  const [dropdown, setDropdown] = useState(
    updateStateDropdown(showMultipleNames(filteredResults, nameParam)),
  );

  useEffect(() => {
    if (!hasFetchedOnce) {
      dispatch(fetchLicenseCertificationResults());
    }
  }, []);

  useEffect(
    () => {
      if (allowUpdate) {
        dispatch(filterLcResults('', categoryParams, 'all'));
        // dispatch(filterLcResults(nameParam, categoryParams, locationValue));
      }

      return () => {
        setAllowUpdate(false);
      };
    },
    [categoryParams, allowUpdate],
  );

  // useLcpFilter({
  //   flag,
  //   name: nameParam,
  //   categoryValues: activeCategories,
  //   locationValue: stateParam,
  // });

  const itemsPerPage = 10;

  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
  const currentResults = filteredResults.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleChange = e => {
    setDropdown(updateStateDropdown(e.target.value));
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    const checkScreen = () => {
      setSmallScreen(isSmallScreen());
    };

    window.addEventListener('resize', checkScreen);

    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  const handlePageChange = page => {
    setCurrentPage(page);
    window.scroll({ top: 0, bottom: 0, behavior: 'smooth' }); // troubleshoot scrollTo functions in platform to align with standards
  };

  const handleRouteChange = id => event => {
    event.preventDefault();
    history.push(`/lc-search/results/${id}`);
  };

  const handleCheckboxGroupChange = e => {
    const { name, checked } = e.target;

    const updatedCheckboxes = categoryCheckboxes.map(categoryCheckbox => {
      if (categoryCheckbox.label.toLowerCase() !== name) {
        return categoryCheckbox;
      }
      return {
        ...categoryCheckbox,
        checked,
      };
    });

    setCategoryCheckboxes(updatedCheckboxes);
  };

  // TODO
  // add separate loading spinners for both results and filter containers

  const renderStateFilter = () => {
    return (
      <>
        <h3 className="vads-u-margin-bottom--0">State</h3>
        <Dropdown
          label="Applies to only license and prep course category type. Certifications are available nationwide."
          name={dropdown.label}
          alt="Filter results by state"
          options={dropdown.options}
          value={dropdown.current.optionLabel}
          onChange={handleChange}
          className="state-dropdown"
          visible
        />
      </>
    );
  };

  const categoryTypeFilter = options => {
    // on mount make checked state of each option reflect filter options from current page
    // on checkbox click make reflect updated options in filter logic

    return (
      <>
        <VaCheckboxGroup
          onVaChange={e => handleCheckboxGroupChange(e)}
          options={options}
          label="Category"
          label-header-level="3"
          class="vads-u-margin-top--0"
        >
          {options.map((option, index) => {
            return (
              <va-checkbox
                key={index}
                label={option.label}
                name={option.name}
                checked={option.checked}
              />
            );
          })}
        </VaCheckboxGroup>
      </>
    );
  };

  const renderSearchInfo = () => {
    return (
      <>
        {categoryParams.map((category, index) => {
          return (
            <span className="info-option vads-u-padding-right--0p5" key={index}>
              "
              <strong key={index}>
                {capitalizeFirstLetter(category, ['course'])}
              </strong>
              ",
            </span>
          );
        })}
        <span className="info-option">
          "<strong>{nameParam}</strong>"{' '}
        </span>
      </>
    );
  };

  const filterControls = (
    <div>
      {categoryTypeFilter(categoryCheckboxes)}
      {renderStateFilter()}
    </div>
  );

  return (
    <div>
      {fetchingLc && (
        <va-loading-indicator
          // data-testid="loading-indicator"
          message="Loading..."
        />
      )}
      <section className="vads-u-display--flex vads-u-flex-direction--column vads-u-padding-x--2p5 mobile-lg:vads-u-padding-x--2">
        {error && (
          <div className="row">
            <LicesnseCertificationServiceError />
          </div>
        )}
        {!fetchingLc &&
          hasFetchedOnce && (
            <>
              <div className="row">
                <h1 className="mobile-lg:vads-u-text-align--left vads-u-margin-bottom--4">
                  Search Results
                </h1>
              </div>

              {filteredResults.length - 1 > 0 ? (
                <>
                  <div className="lc-result-info-wrapper row">
                    <div className="vads-u-display--flex vads-u-justify-content--space-between  vads-u-align-items--center">
                      <p className="vads-u-color--gray-dark vads-u-margin--0 vads-u-padding-bottom--4">
                        Showing{' '}
                        <>
                          {`${formatResultCount(
                            filteredResults,
                            currentPage,
                            itemsPerPage,
                          )} of ${filteredResults.length - 1} results for: `}
                          {renderSearchInfo()}
                        </>
                      </p>
                    </div>
                  </div>

                  <div className="row lc-results-wrapper">
                    <div
                      className={
                        !smallScreen
                          ? 'column small-4 vads-u-padding--0'
                          : 'column small-12 vads-u-padding--0'
                      }
                    >
                      <div className="filter-your-results lc-filter-accordion-wrapper vads-u-margin-bottom--2">
                        <LicenseCertificationFilterAccordion
                          button="Filter your results"
                          buttonLabel="Filter your
                      results"
                          expanded={!smallScreen}
                          buttonOnClick={() =>
                            handleSearch(
                              categoryCheckboxes
                                .filter(checkbox => checkbox.checked === true)
                                .map(option => option.name),
                              nameParam,
                              dropdown.current.optionValue,
                            )
                          }
                        >
                          {filterControls}
                        </LicenseCertificationFilterAccordion>
                      </div>
                    </div>

                    {activeCategories.length > 0 ? (
                      <ul
                        className={
                          !smallScreen
                            ? 'column small-8 vads-u-padding--0 vads-u-padding-left--2 lc-result-cards-wrapper vads-u-margin-top--0 '
                            : 'column small-12 vads-u-padding--0 lc-result-cards-wrapper vads-u-margin-top--0'
                        }
                      >
                        {currentResults.map((result, index) => {
                          if (index === 0) return null;
                          return (
                            <li
                              className="vads-u-padding-bottom--2"
                              key={index}
                            >
                              <va-card class="vads-u-background-color--gray-lightest vads-u-border--0">
                                <h3 className="vads-u-margin--0">
                                  {result.lacNm}
                                </h3>
                                <h4 className="lc-card-subheader vads-u-margin-top--1p5">
                                  {result.eduLacTypeNm}
                                </h4>
                                {result.eduLacTypeNm !== 'Certification' && (
                                  <p className="state vads-u-margin-y--1">
                                    {ADDRESS_DATA.states[result.state]}
                                  </p>
                                )}
                                <va-link
                                  href={`/lc-search/results/${
                                    result.enrichedId
                                  }`}
                                  text={`View test amount details for ${
                                    result.lacNm
                                  }`}
                                  type="secondary"
                                  onClick={handleRouteChange(result.enrichedId)}
                                />
                              </va-card>
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <p className="vads-u-margin-top--0">
                        We didn't find results based on the selected criteria.
                        Please go back to search and try again.
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <div className="row">
                  <p className="vads-u-margin-top--0">
                    We didn't find results based on the selected criteria.
                    Please go back to search and try again.
                  </p>
                </div>
              )}

              {filteredResults.length > itemsPerPage && (
                <VaPagination
                  page={currentPage}
                  pages={totalPages}
                  maxPageListLength={itemsPerPage}
                  onPageSelect={e => handlePageChange(e.detail.page)}
                />
              )}
            </>
          )}
      </section>
    </div>
  );
}

LicenseCertificationSearchResults.propTypes = {
  flag: PropTypes.string,
  // error: Proptypes // verify error Proptypes
};
