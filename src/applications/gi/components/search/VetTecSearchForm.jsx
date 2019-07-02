import PropTypes from 'prop-types';
import React from 'react';

import EligibilityForm from './EligibilityForm';
import InstitutionFilterForm from './InstitutionFilterForm';
import KeywordSearch from './KeywordSearch';

class InstitutionSearchForm extends React.Component {
  static propTypes = {
    searchResults: PropTypes.element.isRequired,
    filtersClass: PropTypes.string.isRequired,
    search: PropTypes.object.isRequired,
    filters: PropTypes.object.isRequired,
  };

  render() {
    return (
      <div className="row">
        <div className={this.props.filtersClass}>
          <div className="filters-sidebar-inner">
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
              onFilterChange={this.handleFilterChange}
              onUpdateAutocompleteSearchTerm={
                this.props.updateAutocompleteSearchTerm
              }
            />
            <InstitutionFilterForm
              search={this.props.search}
              filters={this.props.filters}
              onFilterChange={this.props.handleFilterChange}
            />
            <EligibilityForm />
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
