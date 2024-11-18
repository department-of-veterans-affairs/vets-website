import React from 'react';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import scrollToTop from 'platform/utilities/ui/scrollToTop';
import classNames from 'classnames';
import { VaSelect } from '@department-of-veterans-affairs/web-components/react-bindings';
import BenefitCard from '../../benefit-eligibility-questionnaire/components/BenefitCard';
import GetFormHelp from '../../benefit-eligibility-questionnaire/components/GetFormHelp';
import { BENEFITS_LIST } from '../constants/benefits';

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

    const queryString = window.location.search;

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
      currentQueryString: queryString,
    };

    this.applyInitialSort = this.applyInitialSort.bind(this);
    this.sortBenefits = this.sortBenefits.bind(this);
    this.filterBenefits = this.filterBenefits.bind(this);
    this.createFilterText = this.createFilterText.bind(this);
    this.toggleMobileFiltersClass = this.toggleMobileFiltersClass.bind(this);
    this.filterAndSort = this.filterAndSort.bind(this);
  }

  componentDidMount() {
    focusElement('h1');
    scrollToTop('topScrollElement');
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
          benefitsList: BENEFITS_LIST,
        }),
        sortingCallback,
      );
      return;
    }

    this.setState(() => {
      const filteredBenefitsList = BENEFITS_LIST.filter(benefit => {
        return benefit.category.includes(key);
      });
      return {
        benefitsList: filteredBenefitsList,
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
    const breadcrumbs = [
      { href: 'https://www.VA.gov', label: 'VA.gov home' },
      {
        href: 'https://www.VA.gov/benefit-eligibility-questionnaire',
        label: 'Discover your benefits',
      },
    ];
    const bcString = JSON.stringify(breadcrumbs);

    return (
      <>
        <va-breadcrumbs
          breadcrumb-list={bcString}
          data-testid="breadcrumbs"
          home-veterans-affairs={false}
        />
        <h1 data-testid="form-title">Discover your benefits</h1>
        <article>
          <div role="heading" aria-level="2">
            <p>
              Based on your answers, we’ve suggested some benefits for you to
              explore.
              <br />
              Remember to check your eligibility before you apply.
            </p>
          </div>
        </article>
        <va-link
          href={`/benefit-eligibility-questionnaire/confirmation${
            this.state.currentQueryString
          }`}
          message-aria-describedby="Show every benefit in this tool"
          text="Get my recommended benefits"
          data-testid="get-my-benefits"
          external
        />
        <h2 className="vads-u-font-size--h3">Benefits to explore</h2>

        <div id="results-container" className="vads-l-grid-container">
          <div className="vads-l-row vads-u-margin-y--2 vads-u-margin-x--neg2p5">
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
            </div>
            <div
              id="results-section"
              className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--8 large-screen:vads-l-col--9"
            >
              {this.state.hasResults && (
                <div id="filter-text">{this.state.filterText}</div>
              )}
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
                  <div />
                )}
              </div>
              <div>
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
              </div>
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
            </div>
          </div>
        </div>
        <div className="row vads-u-margin-bottom--2">
          <div className="usa-width-one-whole medium-8 columns">
            <va-need-help>
              <div slot="content">
                <GetFormHelp />
              </div>
            </va-need-help>
          </div>
        </div>
      </>
    );
  }
}

ConfirmationPage.propTypes = {};
