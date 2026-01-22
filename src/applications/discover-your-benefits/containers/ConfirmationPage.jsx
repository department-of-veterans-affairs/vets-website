import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import appendQuery from 'append-query';
import { browserHistory } from 'react-router';
import { scrollToTop } from 'platform/utilities/scroll';
import { setSubmission as setSubmissionAction } from 'platform/forms-system/src/js/actions';
import {
  VaPagination,
  VaSearchFilter,
  VaSelect,
} from '@department-of-veterans-affairs/web-components/react-bindings';
import { displayResults as displayResultsAction } from '../reducers/actions';
import { BENEFITS_LIST, WHEN_TO_APPLY } from '../constants/benefits';
import GetFormHelp from '../components/GetFormHelp';
import Benefits from './components/Benefits';

const ConfirmationPage = ({ formConfig, location, router }) => {
  const dispatch = useDispatch();
  const results = useSelector(state => state.results);

  const [benefits, setBenefits] = useState([]);
  const [benefitIds, setBenefitIds] = useState({});
  const [resultsCount, setResultsCount] = useState(0);
  const [sortValue, setSortValue] = useState('alphabetical');
  const [filterValues, setFilterValues] = useState(['recommended']);
  const [tempFilterValues, setTempFilterValues] = useState(['recommended']);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const query = useMemo(
    () => {
      if (location.query) return location.query;
      return Object.fromEntries(new URLSearchParams(location.search));
    },
    [location.search, location.query],
  );

  const isAllBenefits = query.allBenefits;

  const filterOptions = useMemo(
    () => [
      {
        id: 0,
        label: 'Show results',
        category: [
          {
            id: 'recommended',
            label: 'Show only results recommended for you',
            active: tempFilterValues.includes('recommended'),
          },
        ],
      },
      {
        id: 1,
        label: 'When to apply',
        category: [
          {
            id: WHEN_TO_APPLY.BEFORE_SEPARATION,
            label: 'Before separation',
            active: tempFilterValues.includes(WHEN_TO_APPLY.BEFORE_SEPARATION),
          },
          {
            id: WHEN_TO_APPLY.AFTER_SEPARATION,
            label: 'After separation',
            active: tempFilterValues.includes(WHEN_TO_APPLY.AFTER_SEPARATION),
          },
        ],
      },
      {
        id: 2,
        label: 'Benefit type',
        category: [
          { id: 'Burials', label: 'Burials and memorials' },
          { id: 'Careers', label: 'Careers and employment' },
          { id: 'Disability', label: 'Disability' },
          { id: 'Education', label: 'Education' },
          { id: 'Health Care', label: 'Health care' },
          { id: 'Housing', label: 'Housing assistance' },
          { id: 'Life Insurance', label: 'Life insurance' },
          { id: 'Support', label: 'More support' },
          { id: 'Pension', label: 'Pension' },
          { id: 'isTimeSensitive', label: 'Time-sensitive' },
        ].map(cat => ({
          ...cat,
          active: tempFilterValues.includes(cat.id),
        })),
      },
    ],
    [tempFilterValues],
  );

  const filterText = useMemo(
    () => {
      const totalResults = resultsCount || 0;

      const start = totalResults === 0 ? 0 : (currentPage - 1) * pageSize + 1;
      const end =
        totalResults === 0 ? 0 : Math.min(currentPage * pageSize, totalResults);

      return (
        <>
          Showing {start}–{end} of {totalResults} results
          {filterValues.length > 0 &&
            ` with ${filterValues.length} filter${
              filterValues.length > 1 ? 's' : ''
            } applied`}
        </>
      );
    },
    [resultsCount, currentPage, pageSize, filterValues],
  );

  const resultsData = useMemo(() => results.data || [], [results.data]);

  const applyInitialSort = useCallback(
    () => {
      const data = resultsData?.length ? resultsData : [];

      setResultsCount(data.length);
      setBenefitIds(
        data.reduce((acc, curr) => {
          acc[curr.id] = true;
          return acc;
        }, {}),
      );
      setBenefits(data);
      setCurrentPage(prevPage => (prevPage === 1 ? prevPage : 1));
    },
    [resultsData],
  );

  const displayResults = useCallback(
    benefitIdsFromQuery => dispatch(displayResultsAction(benefitIdsFromQuery)),
    [dispatch],
  );

  const displayResultsFromQuery = useCallback(
    (queryParams, displayResultsFn) => {
      const { benefits: benefitsParam } = queryParams;

      if (benefitsParam) {
        const benefitIdsFromQuery = benefitsParam.split(',');
        displayResultsFn(benefitIdsFromQuery);
      }
    },
    [],
  );

  const filterAndSortBenefits = useCallback(
    () => {
      const filterKeys = filterValues;
      const isRecommendedOnly = filterKeys.includes('recommended');
      const sourceData = isRecommendedOnly ? resultsData || [] : BENEFITS_LIST;
      const nonRecommendedFilters = filterKeys.filter(f => f !== 'recommended');

      let filtered = sourceData;
      if (nonRecommendedFilters.length > 0) {
        filtered = sourceData.filter(benefit =>
          nonRecommendedFilters.some(key => {
            if (key === 'isTimeSensitive') {
              return benefit.isTimeSensitive;
            }

            if (benefit.category?.includes(key)) {
              return true;
            }

            if (
              key === WHEN_TO_APPLY.BEFORE_SEPARATION ||
              WHEN_TO_APPLY.AFTER_SEPARATION
            ) {
              return benefit.whenToApply?.includes(key);
            }

            return false;
          }),
        );
      }

      const sortKey = sortValue === 'alphabetical' ? 'name' : sortValue;

      const sorted = [...filtered].sort((a, b) => {
        if (sortKey === 'isTimeSensitive') {
          return a[sortKey] ? -1 : 1;
        }
        return (a[sortKey] || '').localeCompare(b[sortKey] || '');
      });

      setBenefits(sorted);
      setResultsCount(sorted.length);
      setBenefitIds(
        sorted.reduce((acc, b) => {
          acc[b.id] = true;
          return acc;
        }, {}),
      );
      setCurrentPage(prevPage => (prevPage === 1 ? prevPage : 1));
    },
    [filterValues, resultsData, sortValue],
  );

  const getPaginatedBenefits = useCallback(
    () => {
      const startIndex = (currentPage - 1) * pageSize;
      return benefits.slice(startIndex, startIndex + pageSize);
    },
    [currentPage, pageSize, benefits],
  );

  const handleBackClick = useCallback(
    e => {
      e.preventDefault();

      if (window.history.length > 2) {
        router.goBack();
      }
    },
    [router],
  );

  const extractSelectedFilters = activeFilters => {
    const selected = [];

    activeFilters.forEach(facet => {
      facet.category.forEach(cat => {
        if (cat.active) {
          selected.push(cat.id);
        }
      });
    });

    return selected;
  };

  const handleFilterApply = useCallback(event => {
    const selectedFilter = extractSelectedFilters(event.detail);
    setFilterValues(selectedFilter);
    setTempFilterValues(selectedFilter);
  }, []);

  const handleFilterChange = useCallback(event => {
    const selectedFilter = extractSelectedFilters(event.detail);
    setTempFilterValues(selectedFilter);
  }, []);

  const handleFilterClearAll = useCallback(() => {
    setFilterValues([]);
    setTempFilterValues([]);
    setSortValue('alphabetical');
  }, []);

  const handlePageChange = useCallback(
    event => {
      const newPage = event.detail.page;
      setCurrentPage(newPage);
      scrollToTop('results-container');
    },
    [setCurrentPage],
  );

  const handleResultsData = useCallback(
    () => {
      if (!resultsData?.length) return;

      const benefitIdsQueryString = resultsData.map(r => r.id).join(',');
      const queryParams = { benefits: benefitIdsQueryString };
      const queryStringObj = appendQuery(
        `${location.basename}${location.pathname}`,
        queryParams,
      );

      browserHistory.replace(queryStringObj);
      applyInitialSort();
    },
    [resultsData, location.pathname, location.basename, applyInitialSort],
  );

  const handleResults = useCallback(
    () => {
      if (isAllBenefits) return;

      if (Array.isArray(resultsData) && resultsData.length > 0) {
        handleResultsData();
      } else if (query && Object.keys(query).length > 0) {
        displayResultsFromQuery(query, displayResults);
      }
    },
    [
      isAllBenefits,
      resultsData,
      query,
      handleResultsData,
      displayResultsFromQuery,
      displayResults,
    ],
  );

  const handleSortSelect = useCallback(e => {
    const selectedSortKey = e.detail?.value;
    setSortValue(selectedSortKey);
  }, []);

  const resetSubmissionStatus = useCallback(
    () => {
      const now = new Date().getTime();
      dispatch(setSubmissionAction('status', false));
      dispatch(setSubmissionAction('hasAttemptedSubmit', false));
      dispatch(setSubmissionAction('timestamp', now));
    },
    [dispatch],
  );

  const renderTitleParagraph = () => {
    return (
      <>
        {window.history.length > 2 ? (
          <>
            <p className="vads-u-margin-bottom--0">
              Based on your answers, we’ve recommended benefits for you to
              explore. If you need to, you can&nbsp;
              <va-link
                data-testid="back-link"
                href="#"
                onClick={handleBackClick}
                text="go back and update your answers"
              />
              . Remember to check your eligibility before you apply.
            </p>
          </>
        ) : (
          <>
            <p className="vads-u-margin-bottom--0">
              Based on your answers, we’ve recommended benefits for you to
              explore. Remember to check your eligibility before you apply.
            </p>
          </>
        )}
      </>
    );
  };

  useEffect(
    () => {
      scrollToTop('topScrollElement');

      if (isAllBenefits) {
        setBenefits(BENEFITS_LIST);
        setResultsCount(BENEFITS_LIST.length);
        setBenefitIds(
          BENEFITS_LIST.reduce((acc, b) => ({ ...acc, [b.id]: true }), {}),
        );
        setSortValue('alphabetical');
        setCurrentPage(prevPage => (prevPage === 1 ? prevPage : 1));
      } else {
        handleResults();
        resetSubmissionStatus();
      }
    },
    [isAllBenefits, handleResults, resetSubmissionStatus],
  );

  useEffect(
    () => {
      filterAndSortBenefits();
    },
    [filterValues, sortValue, filterAndSortBenefits],
  );

  return (
    <div>
      <article className="description-article vads-u-padding--0 vads-u-margin--0">
        <div className="description-padding-btm">
          {isAllBenefits ? (
            <div>
              <p>
                Below are all of the benefits that this tool can recommend.
                Remember to check your eligibility before you apply.
              </p>
              <p>
                These aren’t your personalized benefit recommendations, but you
                can go back to your recommendations if you’d like.
              </p>
              <p className="vads-u-margin-bottom--0">
                We’re also planning to add more benefits and resources to this
                tool. Check back soon to find more benefits you may want to
                apply for.
              </p>
            </div>
          ) : (
            renderTitleParagraph()
          )}
        </div>

        <va-additional-info trigger="Benefits for transitioning service members">
          <p className="vads-u-margin--0">
            We can help guide you as you transition from active-duty service or
            from service in the National Guard or Reserves. Some benefits are
            only available while you’re still serving, and others are best
            explored soon after you separate. We’re here to help you understand
            your options so you can take the steps that are right for you.
          </p>
          <br />
          <va-link
            href="https://www.va.gov/service-member-benefits/"
            external
            text="Learn more about VA benefits for service members"
            type="secondary"
            label="Learn more about VA benefits for service members"
          />
        </va-additional-info>
      </article>

      <div
        id="results-container"
        className="vads-u-margin-top--4 medium-screen:vads-u-margin-top--6 "
      >
        <div className="vads-l-row vads-u-margin-y--2">
          <div id="filters-section-desktop">
            <VaSearchFilter
              filterOptions={filterOptions}
              header="Filters"
              onVaFilterChange={handleFilterChange}
              onVaFilterApply={handleFilterApply}
              onVaFilterClearAll={handleFilterClearAll}
            />
          </div>
          <div id="results-section">
            <h2 className="vads-u-font-size--h2 vads-u-margin-top--0">
              {isAllBenefits ? 'All benefits' : 'Recommended benefits for you'}
            </h2>
            <VaSelect
              data-testid="sort-select"
              enableAnalytics
              full-width
              aria-label="Sort Benefits"
              label="Sort"
              name="sort-benefits"
              value={sortValue}
              onVaSelect={handleSortSelect}
              style={{ maxWidth: '288px' }}
            >
              <option key="alphabetical" value="alphabetical">
                Name (A-Z)
              </option>
              <option key="type" value="category">
                Type of benefit (A-Z)
              </option>
              <option key="isTimeSensitive" value="isTimeSensitive">
                Time-sensitive
              </option>
            </VaSelect>
            {filterText && <div id="filter-text">{filterText}</div>}
            <Benefits
              results={results}
              benefits={getPaginatedBenefits()}
              benefitsList={benefits}
              handleBackClick={handleBackClick}
              benefitIds={benefitIds}
              queryString={query}
            />
            <VaPagination
              onPageSelect={handlePageChange}
              page={currentPage}
              pages={Math.ceil(resultsCount / pageSize)}
              className="vads-u-padding-top--0 vads-u-justify-content--flex-start vads-u-border-top--0"
            />
          </div>
        </div>
      </div>
      <div className="row vads-u-margin-bottom--2">
        <div className="vads-u-padding-x--0 vads-u-margin-x--0">
          <va-need-help>
            <div slot="content">
              <GetFormHelp formConfig={formConfig} />
            </div>
          </va-need-help>
        </div>
      </div>
    </div>
  );
};

ConfirmationPage.propTypes = {
  formConfig: PropTypes.object,
  location: PropTypes.shape({
    basename: PropTypes.string,
    pathname: PropTypes.string,
    search: PropTypes.string,
    query: PropTypes.object,
  }),
  router: PropTypes.object,
};

export default ConfirmationPage;
