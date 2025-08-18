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
import { BENEFITS_LIST } from '../constants/benefits';
import GetFormHelp from '../components/GetFormHelp';
import Benefits from './components/Benefits';

const ConfirmationPage = ({ formConfig, location, router }) => {
  const dispatch = useDispatch();
  const results = useSelector(state => state.results);

  const [benefits, setBenefits] = useState([]);
  const [benefitIds, setBenefitIds] = useState({});
  const [resultsCount, setResultsCount] = useState(0);
  const [sortValue, setSortValue] = useState('alphabetical');
  const [filterValues, setFilterValues] = useState([]);
  const [tempFilterValues, setTempFilterValues] = useState([]);
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
        id: 1,
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

  const applyInitialSort = useCallback(
    () => {
      const data = results?.data?.length ? results.data : [];

      const newResultsCount = data.length || 0;
      const newBenefitIds = data.reduce((acc, curr) => {
        acc[curr.id] = true;
        return acc;
      }, {});

      setResultsCount(newResultsCount);
      setBenefitIds(newBenefitIds);
      setBenefits(data);
      setCurrentPage(1);
    },
    [results.data],
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
      const keys = filterValues;
      const sourceData = isAllBenefits ? BENEFITS_LIST : results.data || [];

      let filtered = sourceData;
      if (keys && keys.length > 0) {
        filtered = sourceData.filter(benefit =>
          keys.some(
            key =>
              key === 'isTimeSensitive'
                ? benefit.isTimeSensitive
                : benefit.category.includes(key),
          ),
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
      setCurrentPage(1);
    },
    [filterValues, isAllBenefits, results.data, sortValue],
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

  const handleFilterApply = useCallback(event => {
    const activeFilters = event.detail;
    const selectedFilterFacet = activeFilters.find(
      f => f.label === 'Benefit type',
    );

    const selectedFilter =
      selectedFilterFacet?.category?.map(cat => cat.id) || [];

    setFilterValues(selectedFilter);
    setTempFilterValues(selectedFilter);
  }, []);

  const handleFilterChange = useCallback(event => {
    const activeFilters = event.detail;

    const selectedFilterFacet = activeFilters.find(
      f => f.label === 'Benefit type',
    );

    const selectedFilter =
      selectedFilterFacet?.category?.map(cat => cat.id) || [];

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
    },
    [setCurrentPage],
  );

  const handleResultsData = useCallback(
    () => {
      if (!results?.data?.length) return;

      const benefitIdsQueryString = results.data.map(r => r.id).join(',');
      const queryParams = { benefits: benefitIdsQueryString };
      const queryStringObj = appendQuery(
        `${location.basename}${location.pathname}`,
        queryParams,
      );

      browserHistory.replace(queryStringObj);
      applyInitialSort();
    },
    [results, location, applyInitialSort],
  );

  const handleResults = useCallback(
    () => {
      if (isAllBenefits) return;

      if (Array.isArray(results?.data) && results.data.length > 0) {
        handleResultsData();
      } else if (query && Object.keys(query).length > 0) {
        displayResultsFromQuery(query, displayResults);
      }
    },
    [
      isAllBenefits,
      results?.data,
      query,
      handleResultsData,
      displayResultsFromQuery,
      displayResults,
    ],
  );

  const handleSortSelect = useCallback(e => {
    const selectedSortKey = e.target.value;
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

  const titleParagraph = () => {
    return (
      <>
        {window.history.length > 2 ? (
          <>
            <p className="vads-u-margin-bottom--0">
              Based on your answers, we’ve suggested some benefits for you to
              explore. If you need to, you can
              <va-link
                data-testid="back-link"
                href="#"
                onClick={handleBackClick}
                text="go back and review your entries"
              />
              . Remember to check your eligibility before you apply.
            </p>
          </>
        ) : (
          <>
            <p className="vads-u-margin-bottom--0">
              Based on your answers, we’ve suggested some benefits for you to
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
        setCurrentPage(1);
      } else {
        handleResults();
        resetSubmissionStatus();
      }
    },
    [isAllBenefits, handleResults, resetSubmissionStatus],
  );

  useEffect(
    () => {
      scrollToTop();
    },
    [currentPage],
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
            titleParagraph()
          )}
        </div>

        <va-alert
          close-btn-aria-label="Close notification"
          status="info"
          visible
        >
          <h2>Benefits for transitioning service members</h2>
          <p>
            We can help guide you as you transition from active-duty service or
            from service in the Guard or Reserve. You’ll need to act quickly to
            take advantage of certain time-sensitive benefits.
            <br />
            <va-link
              href="https://www.va.gov/service-member-benefits/"
              external
              text="Learn more about VA benefits for service members"
              type="secondary"
              label="Learn more about VA benefits for service members"
            />
          </p>
        </va-alert>
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
            {!isAllBenefits && (
              <div className="all-benefits">
                <span>
                  If you’d like to explore all of the benefits that this tool
                  can recommend, select the link below.
                </span>
                <va-link
                  href="/discover-your-benefits/confirmation?allBenefits=true"
                  external
                  message-aria-describedby="Show every benefit in this tool"
                  text="Show every benefit in this tool"
                  data-testid="show-all-benefits"
                  type="secondary"
                  className=""
                />
              </div>
            )}
          </div>
          <div id="results-section">
            <h2 className="vads-u-font-size--h2 vads-u-margin-top--0">
              {isAllBenefits ? 'All benefits' : 'Recommended benefits for you'}
            </h2>
            <VaSelect
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
