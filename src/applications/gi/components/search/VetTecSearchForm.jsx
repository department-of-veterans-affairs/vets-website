import React from 'react';

import KeywordSearch from './KeywordSearch';
import Checkbox from '../Checkbox';

class InstitutionSearchForm extends React.Component {
  constructor(props) {
    super(props);
    const { onlineClasses } = props.eligibility;
    this.state = {
      learningFormat: {
        inPerson: onlineClasses === 'no' || onlineClasses === 'both',
        online: onlineClasses === 'yes' || onlineClasses === 'both',
      },
    };
  }

  handleOnlineClassesChange = e => {
    this.handleLearningFormatChange(e);
    let onlineClasses = this.props.onlineClasses;
    const { inPerson, online } = this.props.learningFormat;

    if (inPerson) {
      onlineClasses = 'no';
    }
    if (online) {
      onlineClasses = 'yes';
    }
    if (inPerson && online) {
      onlineClasses = 'both';
    }
    this.props.onFilterChange('onlineClasses', onlineClasses);
  };

  handleLearningFormatChange = e => {
    const { name: field, checked: value } = e.target;

    const learningFormat = { ...this.state.learningFormat };
    learningFormat[field] = value;
    this.setState({ ...this.state, learningFormat });
  };

  renderLearningFormat = () => {
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
          checked={this.state.learningFormat.inPerson}
          name="inPersonLearningFormat"
          label={inPersonLabel}
          onChange={this.handleOnlineClassesChange}
        />
        <Checkbox
          checked={this.state.learningFormat.online}
          name="onlineLearningFormat"
          label={onlineLabel}
          onChange={this.handleOnlineClassesChange}
        />
      </div>
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
              onFilterChange={this.handleFilterChange}
              onUpdateAutocompleteSearchTerm={
                this.props.updateAutocompleteSearchTerm
              }
            />

            {this.renderLearningFormat()}
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
