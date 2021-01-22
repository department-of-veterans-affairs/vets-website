import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';

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

import VideoSidebar from '../components/content/VideoSidebar';
import KeywordSearch from '../components/search/KeywordSearch';
import BenefitNotification from '../components/content/BenefitNotification';
import LandingPageTypeOfInstitutionFilter from '../components/search/LandingPageTypeOfInstitutionFilter';
import OnlineClassesFilter from '../components/search/OnlineClassesFilter';
import { calculateFilters } from '../selectors/search';
import { isVetTecSelected, useQueryParams } from '../utils/helpers';
import recordEvent from 'platform/monitoring/record-event';
import BenefitsForm from '../components/profile/BenefitsForm';

export function LandingPage({
  autocomplete,
  dispatchClearAutocompleteSuggestions,
  dispatchEligibilityChange,
  dispatchFetchInstitutionAutocompleteSuggestions,
  dispatchInstitutionFilterChange,
  dispatchHideModal,
  dispatchSetPageTitle,
  dispatchShowModal,
  dispatchUpdateAutocompleteSearchTerm,
  eligibility,
  filters,
}) {
  useEffect(() => {
    dispatchSetPageTitle(`GI Bill® Comparison Tool: VA.gov`);
  }, []);

  const location = useLocation();
  const history = useHistory();
  const queryParams = useQueryParams();
  const [searchError, setSearchError] = useState(false);

  const selectedEligibility = { ...eligibility };

  const search = value => {
    for (const key of queryParams.keys()) {
      const val = queryParams.get(key);
      if (typeof val !== 'boolean' && (!val || val === 'ALL')) {
        queryParams.delete(key);
      }
    }
    queryParams.set('category', filters.category);
    queryParams.set('name', value);

    if (isVetTecSelected(filters)) {
      queryParams.delete('category');
      history.push({
        pathname: 'program-search',
        search: queryParams.toString(),
      });
    } else {
      history.push({ pathname: 'search', search: queryParams.toString() });
    }
  };

  const doSearch = value => {
    // Only search upon blur, keyUp, suggestion selection
    // if the search term is not empty.
    setSearchError(!(isVetTecSelected(filters) || value));

    if (isVetTecSelected(filters) || value) {
      search(value);
    }
  };

  const handleSubmit = event => {
    event.preventDefault();
    doSearch(autocomplete.searchTerm);
  };

  const handleTypeOfInstitutionFilterChange = e => {
    const field = e.target.name;
    const value = e.target.value;

    recordEvent({
      event: 'gibct-form-change',
      'gibct-form-field': 'typeOfInstitution',
      'gibct-form-value': value,
    });

    if (field === 'category' && value === 'vettec') {
      dispatchUpdateAutocompleteSearchTerm('');
    }

    dispatchInstitutionFilterChange({
      ...filters,
      [field]: value,
    });
  };

  const shouldDisplayTypeOfInstitution = (
    eligiblityValue = selectedEligibility,
  ) =>
    eligiblityValue.militaryStatus === 'veteran' &&
    eligiblityValue.giBillChapter === '33';

  const handleEligibilityChange = e => {
    const field = e.target.name;
    const value = e.target.value;

    selectedEligibility[field] = value;

    dispatchEligibilityChange(e);
  };

  const updateAutoCompleteSuggestions = (value, version) => {
    dispatchFetchInstitutionAutocompleteSuggestions(
      value,
      {
        category: filters.category,
      },
      version,
    );
  };

  const validateSearchQuery = searchQuery => {
    setSearchError(searchQuery === '');
  };

  return (
    <span className="landing-page">
      <div className="row vads-u-margin--0">
        <div className="small-12 usa-width-two-thirds medium-8 columns">
          <h1>GI Bill® Comparison Tool</h1>
          <p className="vads-u-font-family--sans vads-u-font-size--h3 vads-u-color--gray-dark">
            Learn about education programs and compare benefits by school.
          </p>

          <form id="landing-page-form" onSubmit={handleSubmit}>
            <BenefitsForm
              eligibilityChange={handleEligibilityChange}
              {...eligibility}
              hideModal={dispatchHideModal}
              showModal={dispatchShowModal}
            />
            <LandingPageTypeOfInstitutionFilter
              category={filters.category}
              showModal={dispatchShowModal}
              onChange={handleTypeOfInstitutionFilterChange}
              eligibility={eligibility}
              displayVetTecOption={shouldDisplayTypeOfInstitution()}
            />
            {!isVetTecSelected(filters) && (
              <OnlineClassesFilter
                onlineClasses={eligibility.onlineClasses}
                onChange={dispatchEligibilityChange}
                showModal={dispatchShowModal}
              />
            )}
            {!isVetTecSelected(filters) && (
              <KeywordSearch
                version={queryParams.get('version')}
                label="Enter a school, employer name, city, or zip code"
                searchOnAutcompleteSelection
                autocomplete={autocomplete}
                location={location}
                onClearAutocompleteSuggestions={
                  dispatchClearAutocompleteSuggestions
                }
                onFetchAutocompleteSuggestions={updateAutoCompleteSuggestions}
                onFilterChange={(field, value) => {
                  doSearch(value);
                }}
                onUpdateAutocompleteSearchTerm={
                  dispatchUpdateAutocompleteSearchTerm
                }
                searchError={searchError}
                validateSearchQuery={validateSearchQuery}
              />
            )}
            <button className="usa-button-big" type="submit" id="search-button">
              <span>Search</span>
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

const mapStateToProps = state => ({
  autocomplete: state.autocomplete,
  filters: calculateFilters(state.filters),
  eligibility: state.eligibility,
});

const mapDispatchToProps = {
  dispatchClearAutocompleteSuggestions: clearAutocompleteSuggestions,
  dispatchFetchInstitutionAutocompleteSuggestions: fetchInstitutionAutocompleteSuggestions,
  dispatchSetPageTitle: setPageTitle,
  dispatchUpdateAutocompleteSearchTerm: updateAutocompleteSearchTerm,
  dispatchInstitutionFilterChange: institutionFilterChange,
  dispatchEligibilityChange: eligibilityChange,
  dispatchShowModal: showModal,
  dispatchHideModal: hideModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LandingPage);
