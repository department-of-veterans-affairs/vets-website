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
    // change state.learningFormat
    const { name: field, checked: value } = e.target;

    const learningFormat = { ...this.state.learningFormat };
    learningFormat[field] = value;

    // update component's state
    this.setState({ ...this.state, learningFormat });

    const { inPerson, online } = learningFormat;
    let onlineClasses = this.props.onlineClasses;

    if (inPerson && !online) {
      onlineClasses = 'no';
    }
    if (!inPerson && online) {
      onlineClasses = 'yes';
    }
    if (inPerson && online) {
      onlineClasses = 'both';
    }
    this.props.eligibilityChange({
      target: {
        name: 'onlineClasses',
        value: onlineClasses,
      },
    });
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
          name="inPerson"
          label={inPersonLabel}
          onChange={this.handleOnlineClassesChange}
        />
        <Checkbox
          checked={this.state.learningFormat.online}
          name="online"
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
