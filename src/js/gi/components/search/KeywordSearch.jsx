import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions';

import Autosuggest from 'react-autosuggest';

export class KeywordSearch extends React.Component {

  clickedSuggestionValue(suggestion) {
    return suggestion.label;
  }

  shouldRenderSuggestions(search_term) {
    const check_length = search_term.trim().length > 2;
    const finished = true; //! this.props.autocomplete.inProgress;
    return check_length && finished;
  }

  renderSuggestion(suggestion) {
    return <div>{suggestion.label}</div>;
  }

  render() {
    return (
      <div className="keyword-search">
        <label
            className="institution-search-label"
            htmlFor="institution-search">
          {this.props.label}
        </label>
        <Autosuggest
            suggestions={this.props.autocomplete.suggestions}
            onSuggestionsFetchRequested={this.props.onSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.props.onSuggestionsClearRequested}
            getSuggestionValue={this.clickedSuggestionValue}
            renderSuggestion={this.renderSuggestion}
            shouldRenderSuggestions={this.shouldRenderSuggestions.bind(this)}
            inputProps={{
              value: this.props.autocomplete.search_term,
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
      dispatch(actions.fetchAutocompleteSuggestions(value));
    },
    onSuggestionsClearRequested: () => {
      dispatch(actions.clearAutocompleteSuggestions());
    },
    handleChange: (event, { newValue }) => {
      dispatch(actions.updateAutocompleteSearchTerm(newValue));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(KeywordSearch);
