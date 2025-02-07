import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import ADDRESS_DATA from 'platform/forms/address/data';

import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import PropTypes from 'prop-types';
import { filterLcResults, fetchLicenseCertificationResults } from '../actions';
import {
  capitalizeFirstLetter,
  formatResultCount,
  handleLcResultsSearch,
  isSmallScreen,
  mappedStates,
  showLcParams,
  showMultipleNames,
  updateStateDropdown,
} from '../utils/helpers';
import { lacpCategoryList } from '../constants';

import LicesnseCertificationServiceError from '../components/LicesnseCertificationServiceError';
import LicenseCertificationFilterAccordion from '../components/LicenseCertificationFilterAccordion';
import FilterControls from '../components/FilterControls';

const checkboxMap = (categories, checkedList) => {
  const valuesToCheck = ['license', 'certification', 'prep course'];

  const allValuesIncluded = valuesToCheck.every(value =>
    checkedList.includes(value),
  );

  return [
    {
      name: categories[0],
      checked: checkedList.includes(categories[0]) || allValuesIncluded,
      label: capitalizeFirstLetter(categories[0]),
    },
    {
      name: categories[1],
      checked:
        checkedList.includes(categories[1]) ||
        checkedList.includes(categories[0]),
      label: capitalizeFirstLetter(categories[1]),
    },
    {
      name: categories[2],
      checked:
        checkedList.includes(categories[2]) ||
        checkedList.includes(categories[0]),
      label: capitalizeFirstLetter(categories[2]),
    },
    {
      name: categories[3],
      checked:
        checkedList.includes(categories[3]) ||
        checkedList.includes(categories[0]),
      label: capitalizeFirstLetter(categories[3]),
    },
  ];
};
// export default function LicenseCertificationSearchResults({ flag }) {
export default function LicenseCertificationSearchResults() {
  const location = useLocation();
  const history = useHistory();

  const previousRoute = history.location.state?.path;
  const previousRouteHome =
    previousRoute === '/lc-search' || previousRoute === '/lc-search/';

  const {
    nameParam,
    categoryParams,
    stateParam,
    initialCategoryParam,
  } = showLcParams(location);

  const dispatch = useDispatch();

  const {
    hasFetchedOnce,
    fetchingLc,
    filteredResults,
    lcResults,
    error,
  } = useSelector(state => state.licenseCertificationSearch);

  const [currentPage, setCurrentPage] = useState(1);
  const [smallScreen, setSmallScreen] = useState(isSmallScreen());
  const [allowUpdate, setAllowUpdate] = useState(false);
  const [activeCategories, setActiveCategories] = useState(categoryParams);
  const [categoryCheckboxes, setCategoryCheckboxes] = useState(
    checkboxMap(lacpCategoryList, categoryParams),
  );
  const [filterLocation, setFilterLocation] = useState(stateParam);
  const [dropdown, setDropdown] = useState(() => {
    return updateStateDropdown(
      showMultipleNames(lcResults, nameParam),
      filterLocation,
    );
  });

  const itemsPerPage = 10;

  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
  const currentResults = filteredResults.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  useEffect(() => {
    if (!hasFetchedOnce) {
      dispatch(fetchLicenseCertificationResults());
    }
  }, []);

  useEffect(
    () => {
      if (hasFetchedOnce) {
        dispatch(filterLcResults(nameParam ?? '', categoryParams, stateParam));
      }
    },
    [hasFetchedOnce, stateParam],
  );

  useEffect(
    () => {
      if (allowUpdate) {
        dispatch(
          filterLcResults(nameParam ?? '', activeCategories, filterLocation),
        );
      }

      return () => {
        setAllowUpdate(false);
      };
    },
    [categoryParams, allowUpdate],
  );

  useEffect(
    () => {
      let final = updateStateDropdown(
        showMultipleNames(lcResults, nameParam),
        filterLocation,
      );

      if (
        categoryParams.length === 1 &&
        categoryParams[0] === 'certification'
      ) {
        final = updateStateDropdown([null, null]);
      }

      setDropdown(final);
    },
    [filterLocation, filteredResults, nameParam],
  );

  useEffect(() => {
    window.scrollTo(0, 0);

    const checkScreen = () => {
      setSmallScreen(isSmallScreen());
    };

    window.addEventListener('resize', checkScreen);

    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  const handleSearch = (categoryNames, name, state) => {
    const newParams = {
      category: categoryNames.length > 0 ? categoryNames : [null],
      name,
      state,
    };

    setAllowUpdate(true);
    setActiveCategories(categoryNames);
    handleLcResultsSearch(
      history,
      newParams.category,
      name,
      state,
      initialCategoryParam,
    );
  };

  const handleChange = e => {
    setFilterLocation(e.target.value);
  };

  const handlePageChange = page => {
    setCurrentPage(page);
    window.scroll({ top: 0, bottom: 0, behavior: 'smooth' }); // troubleshoot scrollTo functions in platform to align with standards
  };

  const handleRouteChange = (e, id) => {
    e.preventDefault();
    history.push(`/lc-search/results/${id}`);
  };

  const handleGoHome = e => {
    e.preventDefault();
    history.push(`/lc-search`);
  };

  const handleCheckboxGroupChange = e => {
    const { name, checked } = e.target;

    const updatedCheckboxes = categoryCheckboxes.map(categoryCheckbox => {
      if (name === 'all') {
        return {
          ...categoryCheckbox,
          checked,
        };
      }

      if (
        name !== 'all' &&
        !checked &&
        categoryCheckbox.label.toLowerCase() === 'all'
      ) {
        return {
          ...categoryCheckbox,
          checked: false,
        };
      }

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

  const handleResetSearch = () => {
    setAllowUpdate(true);
    setActiveCategories([initialCategoryParam]);
    setCategoryCheckboxes(
      checkboxMap(lacpCategoryList, [initialCategoryParam]),
    );
    // setDropdown(updateStateDropdown());
    setFilterLocation('all');
    handleLcResultsSearch(
      history,
      [initialCategoryParam],
      nameParam,
      'all',
      initialCategoryParam,
    );
  };

  const renderSearchInfo = () => {
    const valuesToCheck = ['license', 'certification', 'prep course'];

    const allValuesIncluded = valuesToCheck.every(value =>
      activeCategories.includes(value),
    );

    return (
      <>
        {allValuesIncluded ? (
          <span className="info-option vads-u-padding-right--0p5">
            "<strong>All</strong>
            ",
          </span>
        ) : (
          activeCategories.map((category, index) => {
            return (
              <span
                className="info-option vads-u-padding-right--0p5"
                key={index}
              >
                "
                <strong key={index}>
                  {capitalizeFirstLetter(category, ['course'])}
                </strong>
                "{index === activeCategories.length - 1 && <>,</>}
              </span>
            );
          })
        )}
        <span className="info-option">
          "<strong>{nameParam}</strong>"{!previousRouteHome && <>,</>}{' '}
        </span>
        {!previousRouteHome && (
          <span className="info-option">
            "
            <strong>
              {stateParam === 'all'
                ? 'All'
                : mappedStates.find(state => stateParam === state.optionValue)
                    .optionLabel}
            </strong>
            "{' '}
          </span>
        )}
      </>
    );
  };

  if (fetchingLc) {
    return <va-loading-indicator message="Loading..." />;
  }

  if (error) {
    <div className="row">
      <LicesnseCertificationServiceError />
    </div>;
  }

  if (
    !fetchingLc &&
    hasFetchedOnce &&
    filteredResults.length - 1 <= 0 &&
    previousRouteHome
  ) {
    return (
      <>
        <div className="row">
          <h1 className="mobile-lg:vads-u-text-align--left vads-u-margin-bottom--4">
            Search Results
          </h1>
        </div>
        <div className="row">
          <p className="vads-u-margin-top--0">
            We didn't find any results for "<strong>{nameParam}</strong>" Please{' '}
            <va-link
              href="./" // check link structure
              onClick={e => handleGoHome(e)}
              text="go back to search"
            />{' '}
            and try using different words or checking the spelling of the words
            you’re using.
            <p className="">
              If you don’t see a test or prep course listed, it may be a valid
              test that’s not yet approved. We encourage you to submit an
              application for reimbursement. If approved, we’ll prorate the
              entitlement charges based on the actual amount of the fee charged
              for the test.{' '}
              <va-link
                href="../../find-forms/about-form-22-0803/" // check link structure
                text="Find out how to get reimbursed for
                licenses, certifications and prep courses."
              />
            </p>
          </p>
        </div>
      </>
    );
  }

  return (
    <div>
      <section className="vads-u-display--flex vads-u-flex-direction--column vads-u-padding-x--2p5 mobile-lg:vads-u-padding-x--2">
        {!fetchingLc &&
          hasFetchedOnce && (
            <>
              <div className="row">
                <h1 className="mobile-lg:vads-u-text-align--left vads-u-margin-bottom--4">
                  Search Results
                </h1>
              </div>

              <div className="lc-result-info-wrapper row">
                <div className="vads-u-display--flex vads-u-justify-content--space-between  vads-u-align-items--center">
                  {filteredResults.length - 1 <= 0 ? (
                    <p className="vads-u-color--gray-dark vads-u-margin--0 vads-u-padding-bottom--4">
                      {activeCategories.length >= 1
                        ? `There is no ${activeCategories} available in the state of ${stateParam}`
                        : `Please update the filter options to see results.`}
                    </p>
                  ) : (
                    <p className="vads-u-color--gray-dark vads-u-margin--0 vads-u-padding-bottom--4">
                      Showing{' '}
                      <>
                        {`${formatResultCount(
                          filteredResults,
                          currentPage,
                          itemsPerPage,
                        )} of ${filteredResults.length - 1} results for `}
                        {renderSearchInfo()}
                      </>
                    </p>
                  )}
                </div>
              </div>

              <>
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
                        button="Update Search"
                        buttonLabel="Update Search"
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
                        resetSearch={handleResetSearch}
                      >
                        <FilterControls
                          categoryCheckboxes={categoryCheckboxes}
                          handleCheckboxGroupChange={handleCheckboxGroupChange}
                          dropdown={dropdown}
                          handleDropdownChange={handleChange}
                          filterLocation={filterLocation}
                        />
                      </LicenseCertificationFilterAccordion>
                    </div>
                  </div>

                  {filteredResults.length - 1 > 0 && (
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
                          <li className="vads-u-padding-bottom--2" key={index}>
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
                                href={`/lc-search/results/${result.enrichedId}`}
                                text={`View test amount details for ${
                                  result.lacNm
                                }`}
                                type="secondary"
                                onClick={e =>
                                  handleRouteChange(e, result.enrichedId)
                                }
                              />
                            </va-card>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>

                {filteredResults.length > itemsPerPage && (
                  <VaPagination
                    page={currentPage}
                    pages={totalPages}
                    maxPageListLength={itemsPerPage}
                    onPageSelect={e => handlePageChange(e.detail.page)}
                  />
                )}
              </>
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
