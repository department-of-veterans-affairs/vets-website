import React from 'react';

import KeywordSearch from '../search/KeywordSearch';
import Checkbox from '../Checkbox';
import { addAllOption } from '../../utils/helpers';
import PropTypes from 'prop-types';
import Dropdown from '../Dropdown';

class VetTecSearchForm extends React.Component {
  static propTypes = {
    eligibilityChange: PropTypes.func.isRequired,
    showModal: PropTypes.func.isRequired,
    search: PropTypes.object.isRequired,
    filters: PropTypes.object.isRequired,
    filtersClass: PropTypes.string.isRequired,
    autocomplete: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    clearAutocompleteSuggestions: PropTypes.func.isRequired,
    fetchAutocompleteSuggestions: PropTypes.func.isRequired,
    handleFilterChange: PropTypes.func.isRequired,
    updateAutocompleteSearchTerm: PropTypes.func.isRequired,
    toggleFilter: PropTypes.func.isRequired,
    searchResults: PropTypes.object.isRequired,
    eligibility: PropTypes.object.isRequired,
  };

  handleDropdownChange = e => {
    const { name: field, value } = e.target;
    this.props.handleFilterChange(field, value);
  };

  handleOnlineClassesChange = e => {
    const { name: field, checked: value } = e.target;
    const { learningFormat } = this.props.eligibility;
    learningFormat[field] = value;

    this.props.eligibilityChange({
      target: {
        name: 'learningFormat',
        value: learningFormat,
      },
    });
  };

  renderLearningFormat = () => {
    const { inPerson, online } = this.props.eligibility.learningFormat;

    const inPersonLabel = (
      <div>
        In Person &nbsp; <i className="fas fa-user" />
      </div>
    );
    const onlineLabel = (
      <div>
        Online &nbsp; <i className="fas fa-laptop" />
      </div>
    );
    return (
      <div>
        <p>Learning Format</p>
        <Checkbox
          checked={inPerson}
          name="inPerson"
          label={inPersonLabel}
          onChange={this.handleOnlineClassesChange}
        />
        <Checkbox
          checked={online}
          name="online"
          label={onlineLabel}
          onChange={this.handleOnlineClassesChange}
        />
      </div>
    );
  };

  renderCountryFilter = () => {
    const options = this.props.search.facets.country.map(country => ({
      value: country.name,
      label: country.name,
    }));
    return (
      <Dropdown
        label="Country"
        name="country"
        alt="Filter results by country"
        options={addAllOption(options)}
        value={this.props.filters.country}
        onChange={this.handleDropdownChange}
        visible
      />
    );
  };

  renderStateFilter = () => {
    const options = Object.keys(this.props.search.facets.state).map(state => ({
      value: state,
      label: state,
    }));
    return (
      <Dropdown
        label="State"
        name="state"
        alt="Filter results by state"
        options={addAllOption(options)}
        value={this.props.filters.state}
        onChange={this.handleDropdownChange}
        visible
      />
    );
  };

  render() {
    return (
      <div className="row">
        <div className={this.props.filtersClass}>
          <div className="filters-sidebar-inner">
            {this.props.search.filterOpened && <h1>Filter your search</h1>}
            <h2>Refine search</h2>
            <KeywordSearch
              autocomplete={this.props.autocomplete}
              label="City, school, or training provider"
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

            {this.renderLearningFormat()}
            {this.renderCountryFilter()}
            {this.renderStateFilter()}
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

export default VetTecSearchForm;
