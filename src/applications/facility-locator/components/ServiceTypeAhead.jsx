/* eslint-disable no-use-before-declare */
/* eslint-disable react/sort-comp */
import React, { Component } from 'react';
import { func } from 'prop-types';
import { connect } from 'react-redux';
import Autosuggest from 'react-autosuggest-ie11-compatible';
import { getProviderSvcs } from '../actions';

class ServiceTypeAhead extends Component {

  constructor(props) {
    super(props);
    this.state = {
      input: '',
      suggestions: [],
      services: []
    };
  }

  componentDidMount() {
    this.getServices();
  }

  getServices = async () => {
    const services = await this.props.getProviderSvcs();
    this.setState({ services });
  }

  onChange = (event, { newValue }) => {
    this.setState({ input: newValue });
  };

  /**
   * Handles the filtering of the services list based on what
   * the user has typed into the input field.
   * 
   * @param {string} value Text as entered by the user
   */
  updateSuggestions = ({ value }) => {
    const normalVal = value.trim().toLowerCase();
    const { services } = this.state;

    const suggestions = (normalVal.length === 0)
      ? []
      : services.filter(s => {
        return s.Name.trim().toLowerCase().includes(normalVal);
      });

    this.setState({ suggestions });
  }

  /**
   * Handles any custom rendering of the service suggestion in
   * the typeahead's dropdown view
   * 
   * @param {Object} suggestion A single service object
   */
  renderSuggestion = (suggestion) => {
    return (
      <ul className="dropdown" role="listbox">{suggestion.Name.trim()}</ul>
    );
  }

  clearSuggestions = () => {
    this.setState({ suggestions: [] });
  };

  render() {
    const inputElemProps = {
      placeholder: 'Like primary care, cardiology',
      value: this.state.input,
      onChange: this.onChange
    };

    return (
      <div className="columns medium-3">
        <label htmlFor="service-type-dropdown">
          Service type (optional)
        </label>
        <Autosuggest
          suggestions={this.state.suggestions}
          onSuggestionsFetchRequested={this.updateSuggestions}
          onSuggestionsClearRequested={this.clearSuggestions}
          getSuggestionValue={ (suggestion) => suggestion.Name.trim() }
          shouldRenderSuggestions={ (value) => value.trim().length >= 2 }
          onSuggestionSelected={this.props.onSelect}
          renderSuggestion={this.renderSuggestion}
          inputProps={inputElemProps}/>
      </div>
    );
  }
}

ServiceTypeAhead.propTypes = {
  onSelect: func.isRequired,
};

const mapDispatch = { getProviderSvcs };

export default connect(null, mapDispatch)(ServiceTypeAhead);
