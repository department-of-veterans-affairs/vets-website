import React from 'react';
import { connect } from 'react-redux';

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

export class ConfirmationPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasResults: false,
      resultsCount: 0,
      resultsText: 'results',
      benefitIds: [],
      sortValue: 'alphabetical',
      filterValue: 'All',
      benefits: [],
      benefitsList: BENEFITS_LIST,
      showMobileFilters: false,
    };

    this.applyInitialSort = this.applyInitialSort.bind(this);
  }

  componentDidMount() {
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

  sortBenefits = e => {
    const key = e.target.value;
    const sortKey = key === 'alphabetical' ? 'name' : key;

    this.setState({ sortValue: key }, () => {
      this.setState(prevState => {
        if (!prevState.benefits || !Array.isArray(prevState.benefits)) {
          return { benefits: [], benefitsList: [] };
        }

        const sortedBenefits = this.sortBenefitObj(prevState.benefits, sortKey);
        const sortedBenefitsList = this.sortBenefitObj(
          prevState.benefitsList,
          sortKey,
        );

        return { benefits: sortedBenefits, benefitsList: sortedBenefitsList };
      });
    });
  };

  filterBenefits = e => {
    const key = e.target.value;
    const filterString = key === 'Careers' ? 'Careers & Employment' : key;

    this.setState(() => ({ filterValue: filterString }));

    if (key === 'All') {
      this.setState(() => ({
        benefits: this.props.results.data,
        benefitsList: BENEFITS_LIST,
        resultsCount: this.props.results.data.length,
      }));
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
    });
  };

  handleClick = e => {
    e.preventDefault();

    this.props.router.goBack();
  };

  sortBenefitObj(sortBenefitObj, sortKey) {
    return [...sortBenefitObj].sort((a, b) => {
      let aValue = a[sortKey] || '';
      let bValue = b[sortKey] || '';

      if (sortKey === 'goal') {
        aValue = a.mappings?.goals?.[0] || '';
        bValue = b.mappings?.goals?.[0] || '';
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue);
      }

      if (aValue < bValue) return -1;
      if (aValue > bValue) return 1;

      return 0;
    });
  }

  applyInitialSort() {
    const hasResults = !!this.props.results.data;
    const resultsCount = hasResults ? this.props.results.data.length : 0;
    const resultsText = resultsCount === 1 ? 'result' : 'results';
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

    this.setState({
      hasResults,
      resultsCount,
      resultsText,
      benefitIds,
      benefits: benefitsState,
    });
  }

  toggleMobileFiltersClass() {
    const currentState = this.state.showMobileFilters;
    this.setState({ showMobileFilters: !currentState });
  }

  handleClick = e => {
    e.preventDefault();

    this.props.router.goBack();
  };

  render() {
    return (
      <div>
        <p>
          <b>
            Note: This tool is not an application for VA benefits and it doesn't
            determine your eligibility for benefits.
          </b>{' '}
          After you use this tool, you can learn more about eligibility and how
          to apply.
        </p>
        <p>
          To find VA benefits that may be relevant for you, answer a few
          questions about your goals and experiences.
        </p>
        <p>
          This is our first version. Right now, this tool focuses on education
          and career benefits. We'll add more types of benefits soon.
        </p>

        <SaveResultsModal />

        <h2 className="vads-u-font-size--h3">Benefits to explore</h2>

        <div
          id="results-container"
          className="vads-l-grid-container large-screen:vads-u-padding-x–0"
        >
          <div className="vads-l-row vads-u-margin-y--2 vads-u-margin-x--neg2p5">
            <div
              className="vads-l-col--12 medium-screen:vads-l-col--4 large-screen:vads-l-col--3"
              id="filters-section-mobile-toggle"
            >
              <va-link-action
                message-aria-describedby="Filter and sort"
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
                onVaSelect={this.filterBenefits}
                className="filter-benefits"
              >
                <option key="All" value="All">
                  All
                </option>
                <option key="Education" value="Education">
                  Education
                </option>
                <option key="Careers" value="Careers">
                  Careers & Employment
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
                onVaSelect={this.sortBenefits}
              >
                <option key="alphabetical" value="alphabetical">
                  Alphabetical
                </option>
                <option key="goal" value="goal">
                  Goal
                </option>
                <option key="type" value="category">
                  Type
                </option>
              </VaSelect>
            </div>
            <div
              id="results-section"
              className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--8 large-screen:vads-l-col--9"
            >
              {this.state.hasResults && (
                <>
                  Showing {this.state.resultsCount} {this.state.resultsText},
                  filtered to show <b>{this.state.filterValue} results</b>,
                  sorted{' '}
                  {this.state.sortValue === 'alphabetical'
                    ? 'alphabetically'
                    : `by ${this.state.sortValue}`}
                </>
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
