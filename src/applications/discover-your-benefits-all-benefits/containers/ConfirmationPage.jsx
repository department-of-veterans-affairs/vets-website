import React from 'react';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import scrollToTop from 'platform/utilities/ui/scrollToTop';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { VaSelect } from '@department-of-veterans-affairs/web-components/react-bindings';
import { BENEFITS_LIST } from '../constants/benefits';
import Benfits from './components/Benefits';
import GetFormHelp from '../components/GetFormHelp';

export class ConfirmationPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sortValue: 'alphabetical',
      filterValue: 'All',
      filterText: '',
      allBenefits: BENEFITS_LIST,
      displayedBenefits: [],
      benefitIds: {},
    };
  }

  componentDidMount() {
    focusElement('h1');
    scrollToTop('topScrollElement');

    const sorted = [...BENEFITS_LIST].sort((a, b) =>
      a.name.localeCompare(b.name),
    );

    this.setState({
      allBenefits: sorted,
      displayedBenefits: sorted,
      filterText: this.createFilterText({
        count: sorted.length,
        filterValue: 'All',
        sortValue: 'alphabetical',
      }),
    });
  }

  handleFilterSelect = event => {
    const filterValue = event.target.value;
    this.setState({ filterValue }, () => filterValue);
  };

  handleSortSelect = event => {
    const sortValue = event.target.value;
    this.setState({ sortValue }, () => sortValue);
  };

  filterAndSortBenefits = () => {
    const { sortValue, filterValue, allBenefits } = this.state;
    let filtered = [...allBenefits];

    if (filterValue !== 'All') {
      if (filterValue === 'isTimeSensitive') {
        filtered = filtered.filter(b => b.isTimeSensitive);
      } else {
        filtered = filtered.filter(b => b.category.includes(filterValue));
      }
    }

    if (sortValue === 'alphabetical') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortValue === 'category') {
      filtered.sort((a, b) => a.category.localeCompare(b.category));
    } else if (sortValue === 'isTimeSensitive') {
      filtered.sort((a, b) => {
        if (a.isTimeSensitive === b.isTimeSensitive) return 0;
        return a.isTimeSensitive ? -1 : 1;
      });
    }

    this.setState(
      {
        displayedBenefits: filtered,
        filterText: this.createFilterText({
          count: filtered.length,
          filterValue,
          sortValue,
        }),
      },
      () => {
        focusElement('#filter-text');
      },
    );
  };

  createFilterText({ count, filterValue, sortValue }) {
    const resultsText = count === 1 ? 'result' : 'results';
    const filter =
      filterValue === 'isTimeSensitive' ? 'time-sensitive' : filterValue;
    const filterLabel =
      filter === 'All' ? 'All benefits' : `${filter} benefits`;
    let sortLabel;
    if (sortValue === 'alphabetical') {
      sortLabel = 'alphabetically by benefit name';
    } else if (sortValue === 'isTimeSensitive') {
      sortLabel = 'by time-sensitive';
    } else {
      sortLabel = 'alphabetically by benefit category';
    }

    return `Showing ${count} ${resultsText}, filtered to show ${filterLabel}, sorted ${sortLabel}.`;
  }

  render() {
    return (
      <div>
        <h1 id="heading">Discover Your Benefits</h1>
        <article>
          <div>
            <>
              <p>
                Below are all of the benefits that this tool can recommend.
                Remember to check your eligibility before you apply.
              </p>
              <p>
                These aren’t your personalized benefit recommendations, but you
                can go back to your recommendations if you’d like.
              </p>
              <p>
                We're also planning to add more benefits and resources to this
                tool. Check back soon to find more benefits you may want to
                apply for.
              </p>
            </>
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

        <h2 className="vads-u-font-size--h3">All benefits</h2>

        <div id="results-container" className="vads-l-grid-container">
          <div className="vads-l-row vads-u-margin-y--2 vads-u-margin-x--neg2p5">
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
                <option value="All">All</option>
                <option value="Burials">Burials and memorials</option>
                <option value="Careers">Careers and employment</option>
                <option value="Disability">Disability</option>
                <option value="Education">Education</option>
                <option value="Health Care">Health care</option>
                <option value="Housing">Housing assistance</option>
                <option value="Life Insurance">Life insurance</option>
                <option value="Support">More support</option>
                <option value="Pension">Pension</option>
                <option value="isTimeSensitive">Time-sensitive</option>
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
                className="sort-benefits"
                value={this.state.sortValue}
                onVaSelect={this.handleSortSelect}
              >
                <option value="alphabetical">Alphabetical</option>
                <option value="category">Type</option>
                <option value="isTimeSensitive">Time-sensitive</option>
              </VaSelect>

              <br />
              <va-button
                id="update-results"
                message-aria-describedby="Update Results"
                text="Update Results"
                onClick={this.filterAndSortBenefits}
              />
            </div>

            <div
              id="results-section"
              className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--8 large-screen:vads-l-col--9"
            >
              {this.state.filterText && (
                <div id="filter-text" style={{ marginBottom: '1rem' }}>
                  {this.state.filterText}
                </div>
              )}

              <Benfits
                benefitsList={this.state.displayedBenefits}
                benefitIds={this.state.benefitIds}
              />
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
      </div>
    );
  }
}

ConfirmationPage.propTypes = {
  formConfig: PropTypes.object,
  benefitIds: PropTypes.object,
  location: PropTypes.shape({
    basename: PropTypes.string,
    pathname: PropTypes.string,
    query: PropTypes.object,
  }),
};

export default ConfirmationPage;
