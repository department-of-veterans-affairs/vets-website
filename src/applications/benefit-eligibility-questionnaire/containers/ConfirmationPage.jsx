import React from 'react';
import { connect } from 'react-redux';

import scrollToTop from 'platform/utilities/ui/scrollToTop';
import PropTypes from 'prop-types';
import { setSubmission as setSubmissionAction } from 'platform/forms-system/src/js/actions';
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
      benefits: [], // Initial state for benefits
    };

    this.applyInitialSort = this.applyInitialSort.bind(this);
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

  componentDidMount() {
    scrollToTop('topScrollElement');
    // Update query string based on results.
    if (this.props.results.data && this.props.results.data.length > 0) {
      const benefits = this.props.results.data.map(r => r.id).join(',');
      const queryParams = { benefits };
      const queryStringObj = appendQuery(
        `${this.props.location.basename}${this.props.location.pathname}`,
        queryParams,
      );
      browserHistory.replace(queryStringObj);

      this.applyInitialSort();
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
      this.applyInitialSort();
    }
  }

  sortBenefits = e => {
    const key = e.target.value || 'alphabetical';

    this.setState(() => ({ sortValue: key }));

    this.setState(prevState => {
      const sortedBenefits = prevState.benefits.sort((a, b) => {
        if (a[key] < b[key]) return -1;
        if (a[key] > b[key]) return 1;
        return 0;
      });
      return { benefits: sortedBenefits };
    });
  };

  filterBenefits = e => {
    const key = e.target.value;

    this.setState(() => ({ filterValue: key }));

    if (key === 'All') {
      this.setState(() => ({
        benefits: this.props.results.data,
      }));
      return;
    }

    this.setState(() => {
      const filteredBenefits = this.props.results.data.filter(benefit => {
        return benefit.category.includes(key);
      });
      return { benefits: filteredBenefits };
    });
  };

  handleClick = e => {
    e.preventDefault();

    this.props.router.goBack();
  };

  render() {
    return (
      <div>
        <p>
          Based on your goals and experiences, we recommend exploring the
          benefits listed below. You may be eligible for these benefits, but
          please double-check the eligibility requirements before applying.
        </p>
        <p>
          You can filter and sort the recommended benefits. If you want to copy
          the link to your personalized results or email the results to
          yourself, select the "Save your results" button.
        </p>
        <p>
          Please note that this is a recommendation tool, not an eligibility
          determination tool. VA determines your eligibility once you apply for
          a benefit. You'll need to review the eligibility requirements before
          applying for VA benefits.
        </p>

        <SaveResultsModal />

        <h2 className="vads-u-font-size--h3">Benefits to explore</h2>

        <div id="results-container">
          <div id="filters-section-desktop">
            <b>Filters</b>
            <p>Filter benefits by</p>
            <select aria-label="Filter Benefits" onChange={this.filterBenefits}>
              <option value="All">All</option>
              <option value="Education">Education</option>
              <option value="Employment">Employment</option>
              <option value="Careers">Careers & Employment</option>
              <option value="Support">More Support</option>
            </select>
            <b>Sort</b>
            <p>Sort results by</p>
            <select aria-label="Sort Benefits" onChange={this.sortBenefits}>
              <option value="alphabetical">Alphabetical</option>
              <option value="goal">Goal</option>
              <option value="type">Type</option>
            </select>
          </div>

          <div id="filters-section-mobile">
            <va-link-action
              href="#"
              message-aria-describedby="Filter and sort"
              text="Filter and sort"
              type="secondary"
            />
          </div>

          <div id="results-section">
            <b>
              {this.state.hasResults &&
                `Showing ${this.state.resultsCount} ${
                  this.state.resultsText
                }, filtered to show ${this.state.filterValue} results, sorted ${
                  this.state.sortValue === 'alphabetical'
                    ? this.state.sortValue
                    : `by ${this.state.sortValue}`
                }`}
            </b>

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
                header="Show benefits that I may not qualify for"
                id="show"
              >
                <ul className="benefit-list">
                  {BENEFITS_LIST.map(
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
