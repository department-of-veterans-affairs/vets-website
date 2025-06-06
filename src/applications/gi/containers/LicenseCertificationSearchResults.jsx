import React, { useEffect, useState, useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import ADDRESS_DATA from 'platform/forms/address/data';

import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { fetchLicenseCertificationResults, filterLcResults } from '../actions';
import {
  handleLcResultsSearch,
  isSmallScreen,
  showLcParams,
  showMultipleNames,
  createCheckboxes,
  updateStateDropdown,
  handleZoom,
} from '../utils/helpers';
import { lacpCategoryList } from '../constants';

import LicesnseCertificationServiceError from '../components/LicesnseCertificationServiceError';
import FilterAccordion from '../components/FilterAccordion';
import FilterControls from '../components/FilterControls';
import LicenseCertificationSearchInfo from '../components/LicenseCertificationSearchInfo';

export default function LicenseCertificationSearchResults() {
  const location = useLocation();
  const history = useHistory();

  const searchInfoWrapperRef = useRef(null);
  const previousRoute = history.location.state?.path;
  const previousRouteHome =
    previousRoute === '/licenses-certifications-and-prep-courses' ||
    previousRoute === '/licenses-certifications-and-prep-courses/';

  const {
    nameParam,
    categoryParams,
    stateParam,
    initialCategoryParam,
    pageParam,
  } = showLcParams(location);

  const dispatch = useDispatch();

  const {
    hasFetchedOnce,
    fetchingLc,
    filteredResults,
    lcResults,
    error,
  } = useSelector(state => state.licenseCertificationSearch);

  const [currentPage, setCurrentPage] = useState(Number(pageParam));
  const [smallScreen, setSmallScreen] = useState(isSmallScreen());
  const [allowUpdate, setAllowUpdate] = useState(false);
  const [activeCategories, setActiveCategories] = useState(categoryParams);
  const [categoryCheckboxes, setCategoryCheckboxes] = useState(
    createCheckboxes(lacpCategoryList, categoryParams),
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
    document.title = `Search results: GI Bill® Comparison Tool | Veterans Affairs`;
  }, []);

  useEffect(() => {
    if (!hasFetchedOnce) {
      dispatch(fetchLicenseCertificationResults());
    }
    return null;
  }, []);

  useEffect(
    () => {
      if (hasFetchedOnce && (allowUpdate || stateParam)) {
        dispatch(
          filterLcResults(
            nameParam ?? '',
            allowUpdate ? activeCategories : categoryParams,
            allowUpdate ? filterLocation : stateParam,
            filteredResults,
          ),
        );

        if (allowUpdate) {
          setAllowUpdate(false);
        }
      }
    },
    [hasFetchedOnce, stateParam, allowUpdate, previousRoute],
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

  useEffect(
    () => {
      window.scroll({ top: 0, bottom: 0, behavior: 'smooth' });
      setCurrentPage(Number(pageParam));
    },
    [pageParam],
  );

  // handle UI for changes for high zoom levels
  useEffect(() => {
    window.addEventListener('resize', handleZoom);
    window.addEventListener('load', handleZoom);
    window.addEventListener('zoom', handleZoom);
    window.visualViewport?.addEventListener('resize', handleZoom);

    return () => {
      window.removeEventListener('resize', handleZoom);
      window.removeEventListener('load', handleZoom);
      window.removeEventListener('zoom', handleZoom);
      window.visualViewport?.removeEventListener('resize', handleZoom);
    };
  }, []);

  const handleSearch = (categoryNames, name, state) => {
    const newParams = {
      category: categoryNames.length > 0 ? categoryNames : [null],
      name,
      state,
      currentPage,
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

  const updateResults = () => {
    handleSearch(
      categoryCheckboxes
        .filter(checkbox => checkbox.checked === true)
        .map(option => option.name),
      nameParam,
      dropdown.current.optionValue,
    );
  };

  const handleStateChange = e => {
    setFilterLocation(e.target.value);
  };

  const handlePageChange = page => {
    const newParams = {
      category: categoryParams,
      name: nameParam,
      state: stateParam,
    };

    handleLcResultsSearch(
      history,
      newParams.category,
      newParams.name,
      newParams.state,
      initialCategoryParam,
      page,
    );
    setCurrentPage(page);
  };

  const handleGoToDetails = (e, id, name) => {
    e.preventDefault();

    const routerPath = `/licenses-certifications-and-prep-courses/results/${id}/${name}`;
    history.push(routerPath);
  };

  const handleGoHome = e => {
    e.preventDefault();
    history.push(`/licenses-certifications-and-prep-courses`);
  };

  const handleCheckboxGroupChange = e => {
    const { name, checked } = e.target;

    const newCheckboxes = categoryCheckboxes.map(categoryCheckbox => {
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

    if (newCheckboxes.filter(checkbox => checkbox.checked).length === 3) {
      const final = newCheckboxes.map(checkbox => {
        return {
          ...checkbox,
          checked: true,
        };
      });

      return setCategoryCheckboxes(final);
    }

    return setCategoryCheckboxes(newCheckboxes);
  };

  const handleResetSearch = () => {
    setAllowUpdate(true);
    setActiveCategories([initialCategoryParam]);
    setCategoryCheckboxes(
      createCheckboxes(lacpCategoryList, [initialCategoryParam]),
    );
    setFilterLocation('all');
    handleLcResultsSearch(
      history,
      [initialCategoryParam],
      nameParam,
      'all',
      initialCategoryParam,
    );
  };

  if (fetchingLc) {
    return <va-loading-indicator message="Loading..." />;
  }

  if (error) {
    return (
      <div className="row">
        <LicesnseCertificationServiceError />
      </div>
    );
  }

  if (
    !fetchingLc &&
    hasFetchedOnce &&
    filteredResults.length === 0 &&
    previousRouteHome
  ) {
    return (
      <>
        <div className="row vads-u-padding-x--2p5 desktop:vads-u-padding-x--0 ">
          <h1 className="mobile-lg:vads-u-text-align--left vads-u-margin-bottom--4">
            Search results
          </h1>
          <div className="vads-u-margin-top--0 usa-width-two-thirds ">
            <p className="">
              We didn't find any results for "<strong>{nameParam}</strong>
              ." Please{' '}
              <va-link
                href="./"
                onClick={e => handleGoHome(e)}
                text="go back to search"
              />{' '}
              and try using different words or checking the spelling of the
              words you're using.
            </p>
            <p className="">
              If you don't see a test or prep course listed, it may be a valid
              test that's not yet approved. For license or certification, take
              the test, then apply for approval by submitting VA Form 22-0803.{' '}
              <va-link
                text="Get VA Form 22-0803 to download."
                href="https://www.va.gov/find-forms/about-form-22-0803/"
              />{' '}
              For prep course, take the course, then apply for approval by
              submitting VA Form 22-10272.{' '}
              <va-link
                text="Get VA Form 22-10272 to download."
                href="https://www.va.gov/find-forms/about-form-22-10272/"
              />
            </p>
          </div>
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
                  Search results
                </h1>
              </div>

              <div className="lc-result-info-wrapper row">
                <LicenseCertificationSearchInfo
                  key={`${activeCategories.join(
                    '-',
                  )}-${nameParam}-${stateParam}-${currentPage}`}
                  filteredResults={filteredResults}
                  currentPage={currentPage}
                  itemsPerPage={itemsPerPage}
                  activeCategories={activeCategories}
                  nameParam={nameParam}
                  stateParam={stateParam}
                  previousRouteHome={previousRouteHome}
                  ref={searchInfoWrapperRef}
                />
              </div>

              <>
                <div className="row lc-results-wrapper">
                  <div
                    className={
                      !smallScreen
                        ? 'column small-4 vads-u-padding--0 zoom-wrapper'
                        : 'column small-12 vads-u-padding--0 zoom-wrapper'
                    }
                  >
                    <div className="filter-your-results lc-filter-accordion-wrapper vads-u-margin-bottom--2">
                      <FilterAccordion
                        button="Update search"
                        buttonLabel="Filter your results"
                        smallScreen={smallScreen}
                        updateResults={updateResults}
                        resetSearch={handleResetSearch}
                      >
                        <FilterControls
                          categoryCheckboxes={categoryCheckboxes}
                          handleCheckboxGroupChange={handleCheckboxGroupChange}
                          dropdown={dropdown}
                          handleDropdownChange={handleStateChange}
                          filterLocation={filterLocation}
                        />
                      </FilterAccordion>
                    </div>
                  </div>

                  {filteredResults.length > 0 && (
                    <ul
                      className={
                        !smallScreen
                          ? 'column small-8 vads-u-padding--0 vads-u-padding-left--2 lc-result-cards-wrapper vads-u-margin-top--0 '
                          : 'column small-12 vads-u-padding--0 lc-result-cards-wrapper vads-u-margin-top--0'
                      }
                    >
                      {currentResults.map((result, index) => {
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
                                href={`/education/gi-bill-comparison-tool/licenses-certifications-and-prep-courses/results/${
                                  result.enrichedId
                                }/${result.lacNm}`}
                                text={`Learn more about ${result.lacNm}`}
                                type="secondary"
                                onClick={e =>
                                  handleGoToDetails(
                                    e,
                                    result.enrichedId,
                                    result.lacNm,
                                  )
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
