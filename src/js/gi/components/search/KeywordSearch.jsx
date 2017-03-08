import React from 'react';
import { connect } from 'react-redux';
import Autosuggest from 'react-autosuggest';

import {
  fetchAutocompleteSuggestions,
  clearAutocompleteSuggestions,
  updateAutocompleteSearchTerm
} from '../../actions';

export class KeywordSearch extends React.Component {

  constructor(props) {
    super(props);
    this.clickedSuggestionValue = this.clickedSuggestionValue.bind(this);
    this.renderSuggestion = this.renderSuggestion.bind(this);
    this.shouldRenderSuggestions = this.shouldRenderSuggestions.bind(this);
  }

  clickedSuggestionValue(suggestion) {
    return suggestion.label;
  }

  shouldRenderSuggestions(searchTerm) {
    const checkLength = searchTerm.trim().length > 2;
    const finished = true; //! this.props.autocomplete.inProgress;
    return checkLength && finished;
  }

  renderSuggestion(suggestion) {
    return <div>{suggestion.label}</div>;
  }

  render() {
    const { suggestions, searchTerm } = this.props.autocomplete;
    const suggestionsList = [
      {
        id: null,
        value: searchTerm,
        label: searchTerm
      },
      ...suggestions
    ];

    return (
      <div className="keyword-search">
        <label
            className="institution-search-label"
            htmlFor="institution-search">
          {this.props.label}
        </label>
        <Autosuggest
            suggestions={suggestionsList}
            onSuggestionsFetchRequested={this.props.onSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.props.onSuggestionsClearRequested}
            getSuggestionValue={this.clickedSuggestionValue}
            renderSuggestion={this.renderSuggestion}
            shouldRenderSuggestions={this.shouldRenderSuggestions}
            inputProps={{
              value: searchTerm,
              onChange: this.props.handleChange
            }}/>
      </div>
    );
  }

}

KeywordSearch.defaultProps = {
  label: 'Enter a city, school or employer name',
};

const mapStateToProps = (state) => state;
const mapDispatchToProps = (dispatch) => {
  return {
    onSuggestionsFetchRequested: ({ value }) => {
      dispatch(fetchAutocompleteSuggestions(value));
    },
    onSuggestionsClearRequested: () => {
      dispatch(clearAutocompleteSuggestions());
    },
    handleChange: (event, { newValue }) => {
      dispatch(updateAutocompleteSearchTerm(newValue));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(KeywordSearch);
