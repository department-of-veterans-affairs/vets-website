import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import {
  clearAutocompleteSuggestions,
  fetchAutocompleteSuggestions,
  setPageTitle,
  updateAutocompleteSearchTerm,
  institutionFilterChange,
  eligibilityChange,
  showModal,
} from '../actions';

import VideoSidebar from '../components/content/VideoSidebar';
import KeywordSearch from '../components/search/KeywordSearch';
import EligibilityForm from '../components/search/EligibilityForm';
import BenefitNotification from '../components/content/BenefitNotification';
import LandingPageTypeOfInstitutionFilter from '../components/search/LandingPageTypeOfInstitutionFilter';
import OnlineClassesFilter from '../components/search/OnlineClassesFilter';
import { calculateFilters } from '../selectors/search';
import { isVetTecSelected } from '../utils/helpers';
import recordEvent from 'platform/monitoring/record-event';

export class LandingPage extends React.Component {
  componentDidMount() {
    this.props.setPageTitle(`GI Bill® Comparison Tool: VA.gov`);
  }

  handleSubmit = event => {
    event.preventDefault();
    this.handleFilterChange('name', this.props.autocomplete.searchTerm);
  };

  handleFilterChange = (field, value) => {
    // Only search upon blur, keyUp, suggestion selection
    // if the search term is not empty.
    if (isVetTecSelected(this.props.filters)) {
      this.search(value);
    } else if (value) {
      this.search(value);
    }
  };

  search = value => {
    const { location } = this.props;
    const { category, vetTecProvider } = this.props.filters;

    const query = {
      name: value,
      version: location.query.version,
      category: vetTecProvider ? null : category,
      vetTecProvider,
    };

    _.forEach(query, (val, key) => {
      if (typeof val !== 'boolean' && (!val || val === 'ALL')) {
        delete query[key];
      }
    });

    this.props.router.push({ pathname: 'search', query });
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

    if (field === 'category') {
      filters.vetTecProvider = value === 'vettec';

      if (filters.vetTecProvider) {
        this.props.updateAutocompleteSearchTerm('');
      }
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

    if (
      this.props.filters.category === 'vettec' &&
      !this.shouldDisplayTypeOfInstitution(eligibility)
    ) {
      this.props.institutionFilterChange({
        ...this.props.filters,
        category: 'school',
        vetTecProvider: false,
      });
    }

    this.props.eligibilityChange(e);
  };

  render() {
    return (
      <span className="landing-page">
        <div className="row">
          <div className="small-12 usa-width-two-thirds medium-8 columns">
            <h1>GI Bill® Comparison Tool</h1>
            <p className="subheading">
              Learn about education programs and compare benefits by school.
            </p>

            <form onSubmit={this.handleSubmit}>
              <EligibilityForm
                eligibilityChange={this.handleEligibilityChange}
              />
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
                  autocomplete={this.props.autocomplete}
                  location={this.props.location}
                  onClearAutocompleteSuggestions={
                    this.props.clearAutocompleteSuggestions
                  }
                  onFetchAutocompleteSuggestions={
                    this.props.fetchAutocompleteSuggestions
                  }
                  onFilterChange={this.handleFilterChange}
                  onUpdateAutocompleteSearchTerm={
                    this.props.updateAutocompleteSearchTerm
                  }
                />
              )}
              <button
                className="usa-button-big"
                type="submit"
                id="search-button"
              >
                <span>Search Schools</span>
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
});

const mapDispatchToProps = {
  clearAutocompleteSuggestions,
  fetchAutocompleteSuggestions,
  setPageTitle,
  updateAutocompleteSearchTerm,
  institutionFilterChange,
  eligibilityChange,
  showModal,
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(LandingPage),
);
