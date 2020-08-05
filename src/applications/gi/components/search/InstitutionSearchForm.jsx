import React from 'react';

import EligibilityForm from './EligibilityForm';
import InstitutionFilterForm from './InstitutionFilterForm';
import KeywordSearch from './KeywordSearch';
import OnlineClassesFilter from './OnlineClassesFilter';
import BenefitsForm from '../profile/BenefitsForm';
import {
  handleInputFocusWithPotentialOverLap,
  isMobileView,
} from '../../utils/helpers';
import environment from 'platform/utilities/environment';

function InstitutionSearchForm(props) {
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

  const header = props.gibctFilterEnhancement ? 'Refine Search' : 'Keywords';
  const keywordSearchLabel = props.gibctFilterEnhancement
    ? 'Enter a school, location, or employer name'
    : 'City, school, or employer';

  return (
    <div className="row">
      <div id="institution-search" className={props.filtersClass}>
        <div className="filters-sidebar-inner vads-u-margin-left--1p5">
          {props.search.filterOpened && <h1>Filter your search</h1>}
          <h2>{header}</h2>
          <KeywordSearch
            autocomplete={props.autocomplete}
            label={keywordSearchLabel}
            location={props.location}
            onClearAutocompleteSuggestions={props.clearAutocompleteSuggestions}
            onFetchAutocompleteSuggestions={props.fetchAutocompleteSuggestions}
            onFilterChange={props.handleFilterChange}
            onUpdateAutocompleteSearchTerm={props.updateAutocompleteSearchTerm}
          />
          <InstitutionFilterForm
            search={props.search}
            filters={props.filters}
            handleFilterChange={props.handleFilterChange}
            showModal={props.showModal}
            handleInputFocus={handleInstitutionSearchInputFocus}
            gibctFilterEnhancement={props.gibctFilterEnhancement}
          />
          {props.gibctEstimateYourBenefits ? (
            <BenefitsForm
              eligibilityChange={props.eligibilityChange}
              {...props.eligibility}
              hideModal={props.hideModal}
              showModal={props.showModal}
              showHeader
              handleInputFocus={handleInstitutionSearchInputFocus}
              gibctFilterEnhancement={props.gibctFilterEnhancement}
              gibctCh33BenefitRateUpdate={props.gibctCh33BenefitRateUpdate}
            />
          ) : (
            <EligibilityForm
              eligibilityChange={props.eligibilityChange}
              handleInputFocus={props.handleInputFocus}
            />
          )}
          <OnlineClassesFilter
            onlineClasses={props.eligibility.onlineClasses}
            onChange={props.eligibilityChange}
            showModal={props.showModal}
            handleInputFocus={handleInstitutionSearchInputFocus}
            gibctFilterEnhancement={props.gibctFilterEnhancement}
          />
        </div>
        <div id="see-results-button" className="results-button">
          <button className="usa-button" onClick={props.toggleFilter}>
            See Results
          </button>
        </div>
      </div>
      {props.searchResults}
    </div>
  );
}

export default InstitutionSearchForm;
