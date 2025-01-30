import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import ADDRESS_DATA from 'platform/forms/address/data';

import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import PropTypes from 'prop-types';
import {
  capitalizeFirstLetter,
  formatResultCount,
  isSmallScreen,
  showLcParams,
  showMultipleNames,
  updateStateDropdown,
} from '../utils/helpers';
import { useLcpFilter } from '../utils/useLcpFilter';
import LicesnseCertificationServiceError from '../components/LicesnseCertificationServiceError';
import Dropdown from '../components/Dropdown';
// import SearchAccordion from '../components/SearchAccordion';
import LicenseCertificationFilterAccordion from '../components/LicenseCertificationFilterAccordion';

export default function LicenseCertificationSearchResults({
  // error,
  flag,
}) {
  const location = useLocation();
  const history = useHistory();
  const [currentPage, setCurrentPage] = useState(1);
  const [smallScreen, setSmallScreen] = useState(isSmallScreen());

  const { hasFetchedOnce, fetchingLc, filteredResults, error } = useSelector(
    state => state.licenseCertificationSearch,
  );

  const { nameParam, categoryParam, stateParam } = showLcParams(location);

  const [dropdown, setDropdown] = useState(
    updateStateDropdown(showMultipleNames(filteredResults, nameParam)),
  );

  useLcpFilter({
    flag,
    name: nameParam,
    categoryValue: categoryParam,
    locationValue: stateParam,
  });

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

  // TODO
  // address UI updates to show new filter container along side results container
  // add separate loading spinners for both results and filter containers

  const renderStateFilter = () => {
    return (
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
    );
  };

  const categoryTypeFilter = () => {
    // on mount ake checked state of each option reflect filter options from current page
    // on checkbox click make reflect updated options in filter logic

    const categories = ['all', 'license', 'certification', 'prep course'];
    const options = [
      {
        name: categories[0],
        // checked: excludedSchoolTypes.includes(type.toUpperCase()),
        checked: false,
        label: capitalizeFirstLetter(categories[0]),
        // dataTestId: `school-type-${type}`,
      },
      {
        name: categories[1],
        checked: false,
        label: capitalizeFirstLetter(categories[1]),
        // dataTestId: `school-type-${type}`,
      },
      {
        name: categories[2],
        checked: false,
        label: capitalizeFirstLetter(categories[2]),
        // dataTestId: `school-type-${type}`,
      },
      {
        name: categories[3],
        checked: false,
        label: capitalizeFirstLetter(categories[3]),
        // dataTestId: `school-type-${type}`,
      },
    ];

    return (
      <>
        <va-checkbox-group
          // onChange={handleIncludedSchoolTypesChange}
          options={options}
          label="Category"
          label-header-level="3"
          // setIsCleared={setIsCleared}
          class="vads-u-margin-top--0"
        >
          {options.map((option, index) => {
            return (
              <va-checkbox
                key={index}
                label={option.label}
                name={option.name}
                value={index}
              />
            );
          })}
        </va-checkbox-group>
      </>
    );
  };

  const renderLocation = () => {
    return (
      <>
        <h3 className="vads-u-margin-bottom--0">State</h3>
        {renderStateFilter()}
      </>
    );
  };

  const renderSearchInfo = () => {
    return (
      <>
        "<strong>{categoryParam}</strong>
        ", "<strong>{nameParam}</strong>"
      </>
    );
  };

  const controls = (
    <div>
      {categoryTypeFilter()}
      {renderLocation()}
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
                <div className="lc-result-info-wrapper">
                  <div className="vads-u-display--flex vads-u-justify-content--space-between  vads-u-align-items--center">
                    <p className="vads-u-color--gray-dark vads-u-margin--0 vads-u-padding-bottom--4">
                      Showing{' '}
                      {filteredResults.length - 1 === 0 ? (
                        '0 results for:'
                      ) : (
                        <>
                          {`${formatResultCount(
                            filteredResults,
                            currentPage,
                            itemsPerPage,
                          )} of ${filteredResults.length - 1} results for: `}
                          {renderSearchInfo()}
                        </>
                      )}
                    </p>
                  </div>
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
                      // buttonOnClick={() => console.log('update results')}
                    >
                      {controls}
                    </LicenseCertificationFilterAccordion>
                  </div>
                </div>
                {filteredResults.length - 1 > 0 ? (
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
                            <h3 className="vads-u-margin--0">{result.lacNm}</h3>
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
                              onClick={handleRouteChange(result.enrichedId)}
                            />
                          </va-card>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p>
                    We didn't find results based on the selected criteria.
                    Please go back to search and try again.
                  </p>
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
          )}
      </section>
    </div>
  );
}

LicenseCertificationSearchResults.propTypes = {
  flag: PropTypes.string,
  // error: Proptypes // verify error Proptypes
};
