import React from 'react';

import EligibilityForm from './EligibilityForm';
import InstitutionFilterForm from './InstitutionFilterForm';
import KeywordSearch from './KeywordSearch';
import OnlineClassesFilter from './OnlineClassesFilter';
import BenefitsForm from '../profile/BenefitsForm';

function InstitutionSearchForm(props) {
  return (
    <div className="row">
      <div className={props.filtersClass}>
        <div className={'filters-sidebar-inner'}>
          {props.search.filterOpened && <h1>Filter your search</h1>}
          <h2>Keywords</h2>
          <KeywordSearch
            autocomplete={props.autocomplete}
            label="City, school, or employer"
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
          />
          {props.gibctEstimateYourBenefits ? (
            <BenefitsForm
              eligibilityChange={props.eligibilityChange}
              {...props.eligibility}
              hideModal={props.hideModal}
              showModal={props.showModal}
              showHeader
            />
          ) : (
            <EligibilityForm eligibilityChange={props.eligibilityChange} />
          )}
          <OnlineClassesFilter
            onlineClasses={props.eligibility.onlineClasses}
            onChange={props.eligibilityChange}
            showModal={props.showModal}
          />
        </div>
        <div className="results-button">
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
