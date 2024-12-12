import React from 'react';
import { connect } from 'react-redux';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import scrollToTop from 'platform/utilities/ui/scrollToTop';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { setSubmission as setSubmissionAction } from 'platform/forms-system/src/js/actions';
import { VaSelect } from '@department-of-veterans-affairs/web-components/react-bindings';
import appendQuery from 'append-query';
import { browserHistory } from 'react-router';
import { displayResults as displayResultsAction } from '../reducers/actions';
import GetFormHelp from '../components/GetFormHelp';
import SaveResultsModal from '../components/SaveResultsModal';
import { BENEFITS_LIST } from '../constants/benefits';
import Benfits from './components/Benefits';

export class ConfirmationPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasResults: false,
      resultsCount: 0,
      benefitIds: {},
      sortValue: 'alphabetical',
      filterValue: 'All',
      filterText: '',
      benefits: [],
      benefitsList: BENEFITS_LIST,
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
    };
    this.setState({ sortValue: sortStrings[key] });
  };

  sortBenefitObj = (benefitObj, sortKey) => {
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
      () => this.setState(() => ({ filterText: this.createFilterText() })),
    );
  };

  handleFilterSelect = e => {
    const key = e.target.value;

    this.setState(() => ({ filterValue: key }));
  };

  filterBenefits = sortingCallback => {
    const key = this.state.filterValue;
    if (key === 'All') {
      this.setState(
        () => ({
          benefits: this.props.results.data,
          benefitsList: BENEFITS_LIST,
          resultsCount: this.props.results.data.length,
        }),
        sortingCallback,
      );
      return;
    }

    this.setState(() => {
      const filteredBenefits = this.props.results.data.filter(benefit => {
        return benefit.category.includes(key);
      });
      const filteredBenefitsList = BENEFITS_LIST.filter(benefit => {
        return benefit.category.includes(key);
      });
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

  initializePage = () => {
    focusElement('h1');
    scrollToTop('topScrollElement');
  };

  createFilterText() {
    const resultsText = this.state.resultsCount === 1 ? 'result' : 'results';
    return (
      <>
        Showing {this.state.resultsCount} {resultsText}, filtered to show{' '}
        <b>{this.state.filterValue} results</b>, sorted{' '}
        {this.state.sortValue === 'alphabetical'
          ? 'alphabetically by benefit name'
          : `alphabetically by benefit ${this.state.sortValue}`}
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
    const hasResults = !!this.props.results.data;
    const resultsCount = hasResults ? this.props.results.data.length : 0;
    const benefitIds = hasResults
      ? this.props.results.data.reduce((acc, curr) => {
          acc[curr.id] = true;
          return acc;
        }, {})
      : {};

    const benefitsState = this.props.results.data.sort((a, b) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });

    this.setState(
      {
        hasResults,
        resultsCount,
        benefitIds,
        benefits: benefitsState,
      },
      () => this.setState(() => ({ filterText: this.createFilterText() })),
    );
  }

  filterAndSort() {
    this.filterBenefits(this.sortBenefits);
    focusElement('#filter-text');
  }

  render() {
    return (
      <div>
        <article>
          <div role="heading" aria-level="2">
            {this.props.location.query.allBenefits ? (
              <>
                <p>
                  Based on your answers, we’ve suggested some benefits for you
                  to explore.
                  <br />
                  Remember to check your eligibility before you apply.
                </p>
                <p>
                  These aren't your personalized benefit recommendations, but
                  you can go back to your recommendations if you'd like.
                </p>
                <p>
                  We're also planning to add more benefits and resources to this
                  tool.
                  <br />
                  Check back soon to find more benefits you want to apply for.
                </p>
              </>
            ) : (
              <>
                <p>
                  Below are some benefits that this tool can recommend.
                  <br />
                  Remember to check your eligibility before you apply.
                </p>
              </>
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

        <h2 className="vads-u-font-size--h3">Benefits to explore</h2>

        <div id="results-container" className="vads-l-grid-container">
          <div className="vads-l-row vads-u-margin-y--2 vads-u-margin-x--neg2p5">
            {!this.props.location.query.allBenefits && (
              <div className="vads-l-col--12">
                <SaveResultsModal />
              </div>
            )}
            <div
              id="filters-section-desktop"
              className={classNames({
                'vads-l-col--12': true,
                'medium-screen:vads-l-col--4': true,
                'large-screen:vads-l-col--3': true,
              })}
            >
              <span>
                <b>Filters</b>
              </span>
              <VaSelect
                enableAnalytics
                aria-label="Filter Benefits"
                label="Filter by benefit type"
                name="filter-benefits"
                value={this.state.filterValue}
                onVaSelect={this.handleFilterSelect}
                className="filter-benefits"
              >
                <option key="All" value="All">
                  All
                </option>
                <option key="Burials" value="Burials">
                  Burials and memorials
                </option>
                <option key="Careers" value="Careers">
                  Careers and employment
                </option>
                <option key="Disability" value="Disability">
                  Disability
                </option>
                <option key="Education" value="Education">
                  Education
                </option>
                <option key="Health Care" value="Health Care">
                  Health care
                </option>
                <option key="Housing" value="Housing">
                  Housing assistance
                </option>
                <option key="Life Insurance" value="Life Insurance">
                  Life insurance
                </option>
                <option key="Support" value="Support">
                  More support
                </option>
                <option key="Pension" value="Pension">
                  Pension
                </option>
              </VaSelect>
              <br />
              <span>
                <b>Sort</b>
              </span>
              <VaSelect
                enableAnalytics
                aria-label="Sort Benefits"
                label="Sort results by"
                name="sort-benefits"
                value={this.state.sortValue}
                onVaSelect={this.handleSortSelect}
              >
                <option key="alphabetical" value="alphabetical">
                  Alphabetical
                </option>
                <option key="type" value="category">
                  Type
                </option>
              </VaSelect>
              <br />
              <va-button
                id="update-results"
                message-aria-describedby="Update Results"
                text="Update Results"
                onClick={this.filterAndSort}
              />
              {!this.props.location.query.allBenefits && (
                <div className="all-benefits">
                  <span>
                    If you'd like to explore all of the benefits that this tool
                    can recommend, select the link below.
                  </span>
                  <va-link
                    href="/discover-your-benefits/confirmation?allBenefits=true"
                    external
                    message-aria-describedby="Show every benefit in this tool"
                    text="Show every benefit&#10;in this tool"
                    data-testid="show-all-benefits"
                    type="secondary"
                    className=""
                  />
                </div>
              )}
            </div>
            <div
              id="results-section"
              className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--8 large-screen:vads-l-col--9"
            >
              {this.state.hasResults && (
                <div id="filter-text">{this.state.filterText}</div>
              )}
              {!this.props.location.query.allBenefits &&
                window.history.length > 2 && (
                  <p>
                    <va-link
                      data-testid="back-link"
                      href="#"
                      onClick={this.handleBackClick}
                      text="Go back and review your entries"
                    />
                  </p>
                )}

              <Benfits
                results={this.props.results}
                benefits={this.state.benefits}
                benefitsList={this.state.benefitsList}
                handleBackClick={this.handleBackClick}
                benefitIds={this.state.benefitIds}
                queryString={this.props.location.query}
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
