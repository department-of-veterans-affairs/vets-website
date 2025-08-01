import React from 'react';
import { connect } from 'react-redux';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { scrollToTop } from 'platform/utilities/scroll';
import PropTypes from 'prop-types';
import { setSubmission as setSubmissionAction } from 'platform/forms-system/src/js/actions';
import {
  VaPagination,
  VaSearchFilter,
  VaSelect,
} from '@department-of-veterans-affairs/web-components/react-bindings';
import appendQuery from 'append-query';
import { browserHistory } from 'react-router';
import { displayResults as displayResultsAction } from '../reducers/actions';
import GetFormHelp from '../components/GetFormHelp';
import { BENEFITS_LIST } from '../constants/benefits';
import Benefits from './components/Benefits';

export class ConfirmationPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      resultsCount: 0,
      benefitIds: {},
      sortValue: 'alphabetical',
      filterValues: ['All'],
      filterText: '',
      benefits: [],
      benefitsList: BENEFITS_LIST,
      filterOptions: [
        {
          id: 1,
          label: 'Benefit type',
          category: [
            { id: 'All', label: 'All' },
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
          ],
        },
      ],
      currentPage: 1,
      pageSize: 10,
    };

    this.applyInitialSort = this.applyInitialSort.bind(this);
    this.createFilterText = this.createFilterText.bind(this);
    this.sortBenefits = this.sortBenefits.bind(this);
    this.filterBenefits = this.filterBenefits.bind(this);
    this.handleResultsData = this.handleResultsData.bind(this);
    this.filterAndSort = this.filterAndSort.bind(this);
  }

  componentDidMount() {
    this.initializePage();
    this.handleResults();
    this.resetSubmissionStatus();
    this.sortBenefits();
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.results.data &&
      this.props.results.data.length > 0 &&
      (!prevProps.results.data || prevProps.results.data.length === 0)
    ) {
      this.handleResultsData();
    }
  }

  handleResults() {
    const { results, location, displayResults } = this.props;

    if (results.data && results.data.length > 0) {
      this.handleResultsData();
    } else if (location.query && Object.keys(location.query).length > 0) {
      this.displayResultsFromQuery(location.query, displayResults);
    }
  }

  handleBackClick = e => {
    e.preventDefault();

    if (window.history.length > 2) {
      this.props.router.goBack();
    }
  };

  handleResultsData() {
    const benefits = this.props.results.data.map(r => r.id).join(',');
    const queryParams = { benefits };
    const queryStringObj = appendQuery(
      `${this.props.location.basename}${this.props.location.pathname}`,
      queryParams,
    );
    browserHistory.replace(queryStringObj);

    this.applyInitialSort();
  }

  handleSortSelect = e => {
    const key = e.target.value;
    const sortStrings = {
      alphabetical: 'alphabetical',
      category: 'category',
      isTimeSensitive: 'isTimeSensitive',
    };
    this.setState({ sortValue: sortStrings[key] }, this.sortBenefits);
  };

  sortBenefitObj = (benefitObj, sortKey) => {
    if (sortKey === 'isTimeSensitive') {
      return [...benefitObj].sort((a, b) => {
        if (a[sortKey] === b[sortKey]) return 0;
        return a[sortKey] ? -1 : 1;
      });
    }

    return [...benefitObj].sort((a, b) => {
      const aValue = a[sortKey] || '';
      const bValue = b[sortKey] || '';

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue);
      }

      if (aValue < bValue) return -1;
      if (aValue > bValue) return 1;

      return 0;
    });
  };

  sortBenefits = () => {
    const key = this.state.sortValue;
    const sortKey = key === 'alphabetical' ? 'name' : key;
    this.setState(
      prevState => {
        if (!prevState.benefits || !Array.isArray(prevState.benefits)) {
          return { benefits: [], benefitsList: [] };
        }

        const sortedBenefits = this.sortBenefitObj(prevState.benefits, sortKey);
        const sortedBenefitsList = this.sortBenefitObj(
          prevState.benefitsList,
          sortKey,
        );

        return {
          benefits: sortedBenefits,
          benefitsList: sortedBenefitsList,
        };
      },
      () =>
        this.setState(() => ({
          filterText: this.createFilterText(),
          currentPage: 1,
        })),
    );
  };

  handleFilterApply = event => {
    const activeFilters = event.detail;

    this.setState(prevState => {
      const updatedFilterOptions = prevState.filterOptions.map(facet => {
        const activeFacet = activeFilters.find(af => af.label === facet.label);
        if (!activeFacet) {
          return {
            ...facet,
            category: facet.category.map(cat => ({ ...cat, active: false })),
          };
        }

        return {
          ...facet,
          category: facet.category.map(cat => {
            const isActive = activeFacet.category.some(
              activeCat => activeCat.id === cat.id,
            );
            return { ...cat, active: isActive };
          }),
        };
      });

      const selectedFilterFacet = activeFilters.find(
        f => f.label === 'Benefit type',
      );
      const selectedSortFacet = activeFilters.find(f => f.label === 'Sort');

      const selectedFilter =
        selectedFilterFacet?.category?.length > 0
          ? selectedFilterFacet.category.map(cat => cat.id)
          : ['All'];

      const selectedSort =
        selectedSortFacet?.category?.[0]?.id || 'alphabetical';

      return {
        filterValues: selectedFilter,
        sortValue: selectedSort,
        filterOptions: updatedFilterOptions,
      };
    }, this.filterAndSort);
  };

  handleFilterClearAll = () => {
    this.setState(prevState => {
      const resetFilterOptions = prevState.filterOptions.map(facet => ({
        ...facet,
        category: facet.category.map(cat => ({ ...cat, active: false })),
      }));

      return {
        filterValues: ['All'],
        sortValue: 'alphabetical',
        filterOptions: resetFilterOptions,
      };
    }, this.filterAndSort);
  };

  matchesFilters = (benefit, keys) => {
    return keys.some(
      key =>
        key === 'isTimeSensitive'
          ? benefit.isTimeSensitive
          : benefit.category.includes(key),
    );
  };

  filterBenefits = sortingCallback => {
    const keys = this.state.filterValues;

    if (keys.includes('All')) {
      this.setState(
        () => ({
          benefits: this.props.results.data,
          benefitsList: BENEFITS_LIST,
          resultsCount: this.props.results.data.length,
          currentPage: 1,
        }),
        sortingCallback,
      );
      return;
    }

    const filteredBenefits = this.props.results.data.filter(benefit =>
      this.matchesFilters(benefit, keys),
    );

    const filteredBenefitsList = BENEFITS_LIST.filter(benefit =>
      this.matchesFilters(benefit, keys),
    );

    this.setState(() => {
      return {
        benefits: filteredBenefits,
        benefitsList: filteredBenefitsList,
        resultsCount: filteredBenefits.length,
      };
    }, sortingCallback);
  };

  displayResultsFromQuery = (query, displayResults) => {
    const { benefits } = query;

    if (benefits) {
      const benefitIds = benefits.split(',');
      displayResults(benefitIds);
    }
  };

  getPaginatedBenefits = () => {
    const { currentPage, pageSize, benefits } = this.state;
    const startIndex = (currentPage - 1) * pageSize;
    return benefits.slice(startIndex, startIndex + pageSize);
  };

  handlePageChange = event => {
    const newPage = event.detail.page;
    this.setState({ currentPage: newPage }, () => {
      this.setState({ filterText: this.createFilterText() });
      scrollToTop();
    });
  };

  initializePage = () => {
    focusElement('h1');
    scrollToTop('topScrollElement');
  };

  createFilterText() {
    const { currentPage, pageSize, resultsCount, filterValues } = this.state;

    const totalResults = resultsCount || 0;

    const start = totalResults === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const end =
      totalResults === 0 ? 0 : Math.min(currentPage * pageSize, totalResults);

    const filtersApplied = filterValues.includes('All')
      ? 0
      : filterValues.length;

    return (
      <>
        Showing {start}–{end} of {totalResults} results
        {filtersApplied > 0 &&
          ` with ${filtersApplied} filter${
            filtersApplied > 1 ? 's' : ''
          } applied`}
      </>
    );
  }

  resetSubmissionStatus() {
    const now = new Date().getTime();

    this.props.setSubmission('status', false);
    this.props.setSubmission('hasAttemptedSubmit', false);
    this.props.setSubmission('timestamp', now);
  }

  applyInitialSort() {
    const resultsCount = this.props.results.data.length || 0;
    const benefitIds =
      this.props.results.data?.reduce((acc, curr) => {
        acc[curr.id] = true;
        return acc;
      }, {}) || {};

    this.setState(
      {
        resultsCount,
        benefitIds,
        benefits: this.props.results.data,
      },
      () => {
        this.setState({ filterText: this.createFilterText() });
      },
    );
  }

  filterAndSort() {
    this.filterBenefits(this.sortBenefits);
    focusElement('#filter-text');
  }

  titleParagraph = () => {
    return (
      <>
        {window.history.length > 2 ? (
          <>
            <p>
              Based on your answers, we've suggested some benefits for you to
              explore. If you need to, you can&nbsp;
              <va-link
                data-testid="back-link"
                href="#"
                onClick={this.handleBackClick}
                text="go back and review your entries"
              />
              . Remember to check your eligibility before you apply.
            </p>
          </>
        ) : (
          <>
            <p>
              Based on your answers, we've suggested some benefits for you to
              explore. Remember to check your eligibility before you apply.
            </p>
          </>
        )}
      </>
    );
  };

  render() {
    return (
      <div>
        <article>
          <div>
            {this.props.location.query.allBenefits ? (
              <>
                <p>
                  Below are all of the benefits that this tool can recommend.
                  Remember to check your eligibility before you apply.
                </p>
                <p>
                  These aren’t your personalized benefit recommendations, but
                  you can go back to your recommendations if you’d like.
                </p>
                <p>
                  We're also planning to add more benefits and resources to this
                  tool. Check back soon to find more benefits you may want to
                  apply for.
                </p>
              </>
            ) : (
              this.titleParagraph()
            )}
          </div>
        </article>
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

        <div id="results-container" className="vads-l-grid-container">
          <div className="vads-l-row vads-u-margin-y--2 vads-u-margin-x--neg2p5">
            <div id="filters-section-desktop">
              <VaSearchFilter
                filterOptions={this.state.filterOptions}
                header="Filters"
                onVaFilterApply={this.handleFilterApply}
                onVaFilterClearAll={this.handleFilterClearAll}
              />
              {!this.props.location.query.allBenefits && (
                <div className="all-benefits">
                  <span>
                    If you'd like to explore all of the benefits that this tool
                    can recommend, select the link below.&nbsp;
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
                {this.props.location.query.allBenefits
                  ? 'All benefits'
                  : 'Recommended benefits for you'}
              </h2>
              <VaSelect
                enableAnalytics
                aria-label="Sort Benefits"
                label="Sort"
                name="sort-benefits"
                value={this.state.sortValue}
                onVaSelect={this.handleSortSelect}
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
              <br />
              {this.state.filterText && (
                <div id="filter-text">{this.state.filterText}</div>
              )}
              <Benefits
                results={this.props.results}
                benefits={this.getPaginatedBenefits()}
                benefitsList={this.state.benefitsList}
                handleBackClick={this.handleBackClick}
                benefitIds={this.state.benefitIds}
                queryString={this.props.location.query}
              />

              <VaPagination
                onPageSelect={this.handlePageChange}
                page={this.state.currentPage}
                pages={Math.ceil(
                  this.state.benefits.length / this.state.pageSize,
                )}
              />
            </div>
          </div>
        </div>
        <div className="row vads-u-margin-bottom--2">
          <div className="usa-width-one-whole medium-8 columns">
            <va-need-help>
              <div slot="content">
                <GetFormHelp formConfig={this.props.formConfig} />
              </div>
            </va-need-help>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = {
  setSubmission: setSubmissionAction,
  displayResults: displayResultsAction,
};

function mapStateToProps(state) {
  return {
    form: state.form,
    results: state.results,
  };
}

ConfirmationPage.propTypes = {
  benefitIds: PropTypes.object,
  displayResults: PropTypes.func,
  formConfig: PropTypes.object,
  location: PropTypes.shape({
    basename: PropTypes.string,
    pathname: PropTypes.string,
    query: PropTypes.object,
  }),
  results: PropTypes.shape({
    isLoading: PropTypes.bool,
    isError: PropTypes.bool,
    data: PropTypes.array,
    error: PropTypes.object,
  }),
  route: PropTypes.shape({
    pageList: PropTypes.array,
    formConfig: PropTypes.shape({
      prefillEnabled: PropTypes.bool,
      downtime: PropTypes.object,
    }),
  }),
  router: PropTypes.object,
  setSubmission: PropTypes.func,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConfirmationPage);
