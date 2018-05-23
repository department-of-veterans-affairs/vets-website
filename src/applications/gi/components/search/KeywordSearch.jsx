import PropTypes from 'prop-types';
import React from 'react';
import { debounce } from 'lodash';
import recordEvent from '../../../../platform/monitoring/record-event';
import Downshift from 'downshift';

export class KeywordSearch extends React.Component {
  constructor(props) {
    super(props);
    this.handleFetchSuggestion = debounce(
      this.handleFetchSuggestion.bind(this),
      150, { trailing: true }
    );
  }

  handleKeyUp = (e) => {
    const { onFilterChange, autocomplete } = this.props;
    if ((e.which || e.keyCode) === 13) {
      e.target.blur();
      onFilterChange('name', autocomplete.searchTerm);
    }
  }

  handleChange = (e, searchQuery) => {
    if (e) {
      let value;
      if (typeof (e) === 'string') {
        value = e;
      } else {
        value = e.target.value;
      }
      this.props.onUpdateAutocompleteSearchTerm(value);
      this.handleFetchSuggestion({ value });
    }
    if (searchQuery) {
      this.props.onUpdateAutocompleteSearchTerm(searchQuery);
      this.handleFetchSuggestion({ searchQuery });
    }
  }

  handleFetchSuggestion({ value }) {
    const { version } = this.props.location.query;
    this.props.onFetchAutocompleteSuggestions(value, version);
  }

  handleSuggestionSelected = (searchQuery) => {
    recordEvent({
      event: 'gibct-autosuggest',
      'gibct-autosuggest-value': searchQuery,
    });
    this.props.onFilterChange('name', searchQuery);
  }

  handleInputBlur = () => {
    this.props.onFilterChange('name', this.props.autocomplete.searchTerm);
  }

  render() {
    const { suggestions, searchTerm } = this.props.autocomplete;
    return (
      <div className="keyword-search">
        <label
          id="institution-search-label"
          className="institution-search-label"
          htmlFor="institution-search">
          {this.props.label}
        </label>
        <Downshift onChange={this.handleChange} onSelect={(item) => this.handleSuggestionSelected(item)}>
          {({
            getInputProps,
            getItemProps,
            isOpen,
            inputValue,
            highlightedIndex
          }) => (
            <div>
              <input {...getInputProps({
                value: searchTerm || inputValue,
                onChange: this.handleChange,
                onKeyUp: this.handleKeyUp,
                'aria-labelledby': 'institution-search-label',
                onBlur: this.handleInputBlur
              })}/>
              {isOpen && (<div className="suggestions-list">
                {suggestions.map((item, index) => (
                  <div
                    key={index}
                    className="suggestion"
                    {...getItemProps({
                      item: item.label,
                      style: {
                        backgroundColor:
                        highlightedIndex === index ? '#9bdaf1' : 'white',
                      },
                    })}>
                    {item.label}
                  </div>
                ))}
              </div>
              )}
            </div>
          )}
        </Downshift>
      </div>
    );
  }
}

KeywordSearch.defaultProps = {
  label: 'Enter a city, school or employer name',
  onFilterChange: () => {},
};

KeywordSearch.propTypes = {
  label: PropTypes.string,
  onClearAutocompleteSuggestions: PropTypes.func,
  onFetchAutocompleteSuggestions: PropTypes.func,
  onFilterChange: PropTypes.func,
  onUpdateAutocompleteSearchTerm: PropTypes.func
};

export default KeywordSearch;
