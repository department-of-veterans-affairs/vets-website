import React from 'react';

import EligibilityForm from './EligibilityForm';
import InstitutionFilterForm from './InstitutionFilterForm';
import KeywordSearch from './KeywordSearch';
import OnlineClassesFilter from './OnlineClassesFilter';
import environment from 'platform/utilities/environment';

class InstitutionSearchForm extends React.Component {
  render() {
    return (
      <div className="row">
        <div className={this.props.filtersClass}>
          {/* prod flag for bah-7186 */}
          <div
            className={
              environment.isProduction()
                ? 'filters-sidebar-inner-old'
                : 'filters-sidebar-inner'
            }
          >
            {this.props.search.filterOpened && <h1>Filter your search</h1>}
            <h2>Keywords</h2>
            <KeywordSearch
              autocomplete={this.props.autocomplete}
              label="City, school, or employer"
              location={this.props.location}
              onClearAutocompleteSuggestions={
                this.props.clearAutocompleteSuggestions
              }
              onFetchAutocompleteSuggestions={
                this.props.fetchAutocompleteSuggestions
              }
              onFilterChange={this.props.handleFilterChange}
              onUpdateAutocompleteSearchTerm={
                this.props.updateAutocompleteSearchTerm
              }
            />
            <InstitutionFilterForm
              search={this.props.search}
              filters={this.props.filters}
              handleFilterChange={this.props.handleFilterChange}
              showModal={this.props.showModal}
            />
            <EligibilityForm eligibilityChange={this.props.eligibilityChange} />
            <OnlineClassesFilter
              onlineClasses={this.props.eligibility.onlineClasses}
              onChange={this.props.eligibilityChange}
              showModal={this.props.showModal}
            />
          </div>
          <div className="results-button">
            <button className="usa-button" onClick={this.props.toggleFilter}>
              See Results
            </button>
          </div>
        </div>
        {this.props.searchResults}
      </div>
    );
  }
}

export default InstitutionSearchForm;
