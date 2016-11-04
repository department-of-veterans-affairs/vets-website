import React from 'react';
import Autosuggest from 'react-autosuggest';

import If from './If';

const api_base_url = 'http://localhost:3000/v0/gibct'

const getSuggestionValue = suggestion => suggestion.value;

// Use your imagination to render suggestions.
const renderSuggestion = suggestion => (
  <div>
    {suggestion.label}
  </div>
);

class InstitutionNameInput extends React.Component {

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);

    this.state = {
      value: props.defaultValue,
      suggestions: []
    };
  }

  handleChange(event, { newValue }) {
    this.setState((prevState, props) => {
      prevState.value = newValue;
      return prevState;
    });
  };

  autocomplete_url(value) {
    // not URL safe
    return api_base_url + '/institutions/autocomplete?term=' + value;
  }

  getSuggestions = value => {
    let result = [];
    $.getJSON(this.autocomplete_url(value), function(data) {
      result = data;
      console.log('fetched',result)
      return result;
    });
  }

  onSuggestionsFetchRequested = ({ value }) => {
    if (this.state.suggestions) {
      this.setState({
        value,
        suggestions: this.getSuggestions(value)
      });
    }
  };

  onSuggestionsClearRequested() {
    this.setState({
      suggestions: []
    });
  };

  shouldRenderSuggestions = value => {
    return value.trim().length > 2;
  }


  render() {
    const { value, suggestions } = this.state;

    const inputProps = {
      placeholder: 'City, school or employer name',
      title: 'Enter school/employer name',
      type: 'search',
      name: this.props.name,
      id: this.identifier(this.props.name),
      value,
      onChange: this.handleChange
    };

    return (
      <span>
        <If condition={this.props.showLabel}>
          <label
            className="institution-search-label"
            htmlFor={this.identifier(this.props.name)}>
            Enter a city, school or employer name:
          </label>
        </If>

        <div className="row">
          <div className="small-12 columns search-button-div" role="search">
            <Autosuggest
              suggestions={suggestions}
              onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
              onSuggestionsClearRequested={this.onSuggestionsClearRequested}
              getSuggestionValue={getSuggestionValue}
              renderSuggestion={renderSuggestion}
              shouldRenderSuggestions={this.shouldRenderSuggestions}
              inputProps={inputProps} />
          </div>
        </div>
      </span>
    );
  }

  identifier(name) {
    return name.replace(/\_/g, '-');
  }
}

InstitutionNameInput.propTypes = {
  showLabel: React.PropTypes.bool.isRequired,
  name: React.PropTypes.string.isRequired,
  defaultOption: React.PropTypes.string
};

InstitutionNameInput.defaultProps = {
  showLabel: true,
  name: 'institution_search',
  defaultValue: ''
}

export default InstitutionNameInput;
