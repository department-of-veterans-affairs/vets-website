import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';

import {
  clearAutocompleteSuggestions,
  fetchInstitutionAutocompleteSuggestions,
  setPageTitle,
  updateAutocompleteSearchTerm,
  institutionFilterChange,
  eligibilityChange,
  showModal,
  hideModal,
} from '../actions';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

import VideoSidebar from '../components/content/VideoSidebar';
import KeywordSearch from '../components/search/KeywordSearch';
import EligibilityForm from '../components/search/EligibilityForm';
import BenefitNotification from '../components/content/BenefitNotification';
import LandingPageTypeOfInstitutionFilter from '../components/search/LandingPageTypeOfInstitutionFilter';
import OnlineClassesFilter from '../components/search/OnlineClassesFilter';
import { calculateFilters } from '../selectors/search';
import { isVetTecSelected } from '../utils/helpers';
import recordEvent from 'platform/monitoring/record-event';
import BenefitsForm from '../components/profile/BenefitsForm';

export class LandingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchError: false,
    };
  }
  componentDidMount() {
    this.props.setPageTitle(`GI Bill® Comparison Tool: VA.gov`);
  }

  handleSubmit = event => {
    event.preventDefault();
    this.handleFilterChange(this.props.autocomplete.searchTerm);
  };

  handleFilterChange = value => {
    // Only search upon blur, keyUp, suggestion selection
    // if the search term is not empty.
    this.setState({
      searchError: !(isVetTecSelected(this.props.filters) || value),
    });
    if (isVetTecSelected(this.props.filters) || value) {
      this.search(value);
    }
  };

  search = value => {
    const { location } = this.props;
    const { category } = this.props.filters;

    const query = {
      name: value,
      version: location.query.version,
      category,
    };

    _.forEach(query, (val, key) => {
      if (typeof val !== 'boolean' && (!val || val === 'ALL')) {
        delete query[key];
      }
    });

    if (isVetTecSelected(this.props.filters)) {
      delete query.category;
      this.props.router.push({ pathname: 'program-search', query });
    } else {
      this.props.router.push({ pathname: 'search', query });
    }
  };

  handleTypeOfInstitutionFilterChange = e => {
    const field = e.target.name;
    const value = e.target.value;
    const { filters } = this.props;

    recordEvent({
      event: 'gibct-form-change',
      'gibct-form-field': 'typeOfInstitution',
      'gibct-form-value': value,
    });

    if (field === 'category' && value === 'vettec') {
      this.props.updateAutocompleteSearchTerm('');
    }
    filters[field] = value;

    this.props.institutionFilterChange(filters);
  };

  shouldDisplayTypeOfInstitution = (eligibility = this.props.eligibility) =>
    eligibility.militaryStatus === 'veteran' &&
    eligibility.giBillChapter === '33';

  handleEligibilityChange = e => {
    const field = e.target.name;
    const value = e.target.value;

    const eligibility = { ...this.props.eligibility };
    eligibility[field] = value;

    this.props.eligibilityChange(e);
  };

  autocomplete = (value, version) => {
    this.props.fetchInstitutionAutocompleteSuggestions(
      value,
      {
        category: this.props.filters.category,
      },
      version,
    );
  };

  validateSearchQuery = searchQuery => {
    this.setState({
      searchError: searchQuery === '',
    });
  };

  render() {
    const buttonLabel = this.props.gibctSearchEnhancements
      ? 'Search'
      : 'Search Schools';

    const searchLabel = this.props.gibctSearchEnhancements
      ? 'Enter a school, location, or employer name'
      : 'Enter a city, school or employer name';

    return (
      <span className="landing-page">
        <div className="row vads-u-margin--0">
          <div className="small-12 usa-width-two-thirds medium-8 columns">
            <h1>GI Bill® Comparison Tool</h1>
            <p className="vads-u-font-family--sans vads-u-font-size--h3 vads-u-color--gray-dark">
              Learn about education programs and compare benefits by school.
            </p>

            <form onSubmit={this.handleSubmit}>
              {this.props.gibctEstimateYourBenefits ? (
                <BenefitsForm
                  eligibilityChange={this.handleEligibilityChange}
                  {...this.props.eligibility}
                  hideModal={this.props.hideModal}
                  showModal={this.props.showModal}
                />
              ) : (
                <EligibilityForm
                  eligibilityChange={this.handleEligibilityChange}
                />
              )}
              <LandingPageTypeOfInstitutionFilter
                category={this.props.filters.category}
                showModal={this.props.showModal}
                onChange={this.handleTypeOfInstitutionFilterChange}
                eligibility={this.props.eligibility}
                displayVetTecOption={this.shouldDisplayTypeOfInstitution()}
              />
              {!isVetTecSelected(this.props.filters) && (
                <OnlineClassesFilter
                  onlineClasses={this.props.eligibility.onlineClasses}
                  onChange={this.props.eligibilityChange}
                  showModal={this.props.showModal}
                />
              )}
              {!isVetTecSelected(this.props.filters) && (
                <KeywordSearch
                  label={searchLabel}
                  autocomplete={this.props.autocomplete}
                  location={this.props.location}
                  onClearAutocompleteSuggestions={
                    this.props.clearAutocompleteSuggestions
                  }
                  onFetchAutocompleteSuggestions={this.autocomplete}
                  onFilterChange={this.handleFilterChange}
                  onUpdateAutocompleteSearchTerm={
                    this.props.updateAutocompleteSearchTerm
                  }
                  searchError={this.state.searchError}
                  validateSearchQuery={this.validateSearchQuery}
                />
              )}
              <button
                className="usa-button-big"
                type="submit"
                id="search-button"
              >
                <span>{buttonLabel}</span>
              </button>
            </form>
          </div>

          <div className="small-12 usa-width-one-third medium-4 columns">
            <VideoSidebar />
            <BenefitNotification />
          </div>
        </div>
      </span>
    );
  }
}

const mapStateToProps = state => ({
  autocomplete: state.autocomplete,
  filters: calculateFilters(state.filters),
  eligibility: state.eligibility,
  gibctEstimateYourBenefits: toggleValues(state)[
    FEATURE_FLAG_NAMES.gibctEstimateYourBenefits
  ],
  gibctSearchEnhancements: toggleValues(state)[
    FEATURE_FLAG_NAMES.gibctSearchEnhancements
  ],
});

const mapDispatchToProps = {
  clearAutocompleteSuggestions,
  fetchInstitutionAutocompleteSuggestions,
  setPageTitle,
  updateAutocompleteSearchTerm,
  institutionFilterChange,
  eligibilityChange,
  showModal,
  hideModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LandingPage);
