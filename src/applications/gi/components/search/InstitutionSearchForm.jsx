import React from 'react';

import InstitutionFilterForm from './InstitutionFilterForm';
import KeywordSearch from './KeywordSearch';
import OnlineClassesFilter from './OnlineClassesFilter';
import BenefitsForm from '../profile/BenefitsForm';
import {
  handleInputFocusWithPotentialOverLap,
  isMobileView,
} from '../../utils/helpers';
import environment from 'platform/utilities/environment';

function InstitutionSearchForm({
  autocomplete,
  clearAutocompleteSuggestions,
  eligibility,
  eligibilityChange,
  fetchAutocompleteSuggestions,
  filters,
  filtersClass,
  handleFilterChange,
  hideModal,
  location,
  search,
  searchResults,
  showModal,
  toggleFilter,
  updateAutocompleteSearchTerm,
}) {
  function handleInstitutionSearchInputFocus(fieldId) {
    // prod flag for bah-8821
    if (environment.isProduction() && isMobileView()) {
      const field = document.getElementById(fieldId);
      if (field) {
        field.scrollIntoView();
      }
    } else {
      const seeResultsButtonFieldId = 'see-results-button';
      const scrollableFieldId = 'institution-search';
      handleInputFocusWithPotentialOverLap(
        fieldId,
        seeResultsButtonFieldId,
        scrollableFieldId,
      );
    }
  }

  return (
    <div className="row">
      <div id="institution-search" className={filtersClass}>
        <div className="filters-sidebar-inner vads-u-margin-left--1p5">
          {search.filterOpened && <h1>Filter your search</h1>}
          <h2>''Refine search''</h2>
          <KeywordSearch
            autocomplete={autocomplete}
            label={'Enter a school, location, or employer name'}
            location={location}
            onClearAutocompleteSuggestions={clearAutocompleteSuggestions}
            onFetchAutocompleteSuggestions={fetchAutocompleteSuggestions}
            onFilterChange={handleFilterChange}
            onUpdateAutocompleteSearchTerm={updateAutocompleteSearchTerm}
          />
          <InstitutionFilterForm
            search={search}
            filters={filters}
            handleFilterChange={handleFilterChange}
            showModal={showModal}
            handleInputFocus={handleInstitutionSearchInputFocus}
          />
          <BenefitsForm
            eligibilityChange={eligibilityChange}
            {...eligibility}
            hideModal={hideModal}
            showModal={showModal}
            showHeader
            handleInputFocus={handleInstitutionSearchInputFocus}
          />
          <OnlineClassesFilter
            onlineClasses={eligibility.onlineClasses}
            onChange={eligibilityChange}
            showModal={showModal}
            handleInputFocus={handleInstitutionSearchInputFocus}
          />
        </div>
        <div id="see-results-button" className="results-button">
          <button
            className="usa-button"
            data-cy="see-results"
            onClick={toggleFilter}
          >
            See Results
          </button>
        </div>
      </div>
      {searchResults}
    </div>
  );
}

export default InstitutionSearchForm;
