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
import BenefitCard from '../components/BenefitCard';
import GetFormHelp from '../components/GetFormHelp';
import SaveResultsModal from '../components/SaveResultsModal';
import { BENEFITS_LIST } from '../constants/benefits';
import { Heading } from '../components/Heading';

export class ConfirmationPage extends React.Component {
  sortBenefitObj(benefitObj, sortKey) {
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
  }

  constructor(props) {
    super(props);

    this.state = {
      hasResults: false,
      resultsCount: 0,
      benefitIds: [],
      sortValue: 'alphabetical',
      filterValue: 'All',
      filterText: '',
      benefits: [],
      benefitsList: BENEFITS_LIST,
      showMobileFilters: false,
    };

    this.applyInitialSort = this.applyInitialSort.bind(this);
    this.createFilterText = this.createFilterText.bind(this);
    this.sortBenefits = this.sortBenefits.bind(this);
    this.filterBenefits = this.filterBenefits.bind(this);
    this.createFilterText = this.createFilterText.bind(this);
    this.handleResultsData = this.handleResultsData.bind(this);
    this.toggleMobileFiltersClass = this.toggleMobileFiltersClass.bind(this);
    this.filterAndSort = this.filterAndSort.bind(this);
  }

  componentDidMount() {
    focusElement('h1');
    scrollToTop('topScrollElement');
    // Update query string based on results.
    if (this.props.results.data && this.props.results.data.length > 0) {
      this.handleResultsData();
    } else if (
      this.props.location.query &&
      Object.keys(this.props.location.query).length > 0
    ) {
      // Display results based on query string.
      const { benefits } = this.props.location.query;
      const benefitIds = benefits.split(',');

      this.props.displayResults(benefitIds);
    }

    const now = new Date().getTime();

    this.props.setSubmission('status', false);
    this.props.setSubmission('hasAttemptedSubmit', false);
    this.props.setSubmission('timestamp', now);
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
      category: 'type',
    };
    this.setState({ sortValue: sortStrings[key] });
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

  handleClick = e => {
    e.preventDefault();

    this.props.router.goBack();
  };

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

  toggleMobileFiltersClass() {
    const currentState = this.state.showMobileFilters;
    this.setState({ showMobileFilters: !currentState });
  }

  filterAndSort() {
    this.filterBenefits(this.sortBenefits);
    focusElement('#filter-text');
  }

  render() {
    return (
      <div>
        <article>
          <Heading />
        </article>

        <h2 className="vads-u-font-size--h3">Benefits to explore</h2>

        <div id="results-container" className="vads-l-grid-container">
          <div className="vads-l-row vads-u-margin-y--2 vads-u-margin-x--neg2p5">
            <div className="vads-l-col--12">
              <SaveResultsModal />
            </div>
            <div
              className="vads-l-col--12 medium-screen:vads-l-col--4 large-screen:vads-l-col--3"
              id="filters-section-mobile-toggle"
            >
              <va-link-action
                text="Filter and sort"
                type="secondary"
                onClick={() => this.toggleMobileFiltersClass()}
                omKeyDown={() => this.toggleMobileFiltersClass()}
                role="button"
              />
            </div>
            <div
              id="filters-section-desktop"
              className={classNames({
                'vads-l-col--12': true,
                'medium-screen:vads-l-col--4': true,
                'large-screen:vads-l-col--3': true,
                'show-filters-section-mobile': this.state.showMobileFilters,
                'hide-filters-section-mobile': !this.state.showMobileFilters,
              })}
            >
              <span>
                <b>Filters</b>
              </span>
              <VaSelect
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
                  Careers & Employment
                </option>
                <option key="Disability" value="Disability">
                  Disability
                </option>
                <option key="Education" value="Education">
                  Education
                </option>
                <option key="Health Care" value="Health Care">
                  Health Care
                </option>
                <option key="Housing" value="Housing">
                  Housing Assistance
                </option>
                <option key="Life Insurance" value="Life Insurance">
                  Life Insurance
                </option>
                <option key="Loan Guaranty" value="Loan Guaranty">
                  Loan Guaranty
                </option>
                <option key="Pension" value="Pension">
                  Pension
                </option>
                <option key="Support" value="Support">
                  More Support
                </option>
              </VaSelect>
              <br />
              <span>
                <b>Sort</b>
              </span>
              <VaSelect
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
            </div>
            <div
              id="results-section"
              className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--8 large-screen:vads-l-col--9"
            >
              {this.state.hasResults && (
                <div id="filter-text">{this.state.filterText}</div>
              )}
              <p>
                <va-link
                  data-testid="back-link"
                  href="#"
                  onClick={this.handleClick}
                  text="Go back and review your entries"
                />
              </p>

              <div className="vads-u-margin-y--2">
                {this.state && this.state.benefits.length > 0 ? (
                  <va-alert-expandable
                    status="info"
                    trigger="Time-sensitive benefits"
                  >
                    <ul className="benefit-list">
                      {this.state &&
                        this.state.benefits
                          .filter(benefit => benefit.isTimeSensitive)
                          .map(b => (
                            <li key={b.id}>
                              <strong>{b.name}</strong>
                              <p>{b.description}</p>
                              {b.learnMoreURL ? (
                                <div>
                                  <a
                                    href={b.learnMoreURL}
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label={`Learn more about ${b.name}`}
                                  >
                                    Learn more
                                  </a>
                                </div>
                              ) : null}

                              {b.applyNowURL ? (
                                <div>
                                  <a
                                    href={b.applyNowURL}
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label={`Apply now for ${b.name}`}
                                  >
                                    Apply now
                                  </a>
                                </div>
                              ) : null}
                            </li>
                          ))}
                    </ul>
                  </va-alert-expandable>
                ) : (
                  <NoResultsBanner
                    data={this.props.results.data}
                    handleClick={this.handleClick}
                  />
                )}
              </div>

              <div>
                {this.props.results.isLoading ? (
                  <va-loading-indicator
                    label="Loading"
                    message="Loading results..."
                  />
                ) : (
                  <ul className="benefit-list">
                    {this.state &&
                      this.state.benefits
                        .filter(benefit => !benefit.isTimeSensitive)
                        .map(benefit => (
                          <li key={benefit.id}>
                            <BenefitCard
                              benefit={benefit}
                              className="vads-u-margin-bottom--2"
                            />
                          </li>
                        ))}
                  </ul>
                )}
              </div>
              {this.state.benefitsList.length > 0 ? (
                <va-accordion>
                  <va-accordion-item
                    header="Benefits that I may not qualify for"
                    id="show"
                  >
                    <ul className="benefit-list">
                      {this.state.benefitsList.map(
                        benefit =>
                          !this.state.benefitIds[benefit.id] && (
                            <li key={benefit.id}>
                              <BenefitCard
                                benefit={benefit}
                                className="vads-u-margin-bottom--2"
                              />
                            </li>
                          ),
                      )}
                    </ul>
                  </va-accordion-item>
                </va-accordion>
              ) : (
                <va-banner headline="No Results Found" type="warning" visible>
                  <p>
                    We're unable to recomend benefits based on your responses.
                    You can adjust your filters or{' '}
                    <va-link
                      data-testid="back-link-banner"
                      href="#"
                      onClick={this.handleClick}
                      text="Go back and review your entries"
                    />
                  </p>
                  <p>
                    We're adding more benefits, so we encourage you to try again
                    in the future.
                  </p>
                </va-banner>
              )}
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

const NoResultsBanner = ({ data, handleClick }) => (
  <va-banner
    className="response-no-results"
    headline="No Results Found"
    type="warning"
    visible
  >
    <p>
      <>
        {data && data.length > 0
          ? "We're unable to recomend benefits based on your responses. You can "
          : "We're unable to recomend benefits that match your filters. You can adjust your filters or "}
      </>
      <va-link
        data-testid="back-link-banner"
        href="#"
        onClick={handleClick}
        text="Go back review and update your entries"
      />
    </p>
    <p>
      We’re adding more benefits, so we encourage you to try again in the
      future.
    </p>
  </va-banner>
);

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
