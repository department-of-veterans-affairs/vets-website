import PropTypes from 'prop-types';
import React from 'react';
import { debounce } from 'lodash';
import recordEvent from 'platform/monitoring/record-event';
import Downshift from 'downshift';
import classNames from 'classnames';
import { WAIT_INTERVAL, KEY_CODES } from '../../constants';
import { handleInputFocus } from '../../utils/helpers';

export class KeywordSearch extends React.Component {
  constructor(props) {
    super(props);
    this.handleFetchSuggestion = debounce(
      this.handleFetchSuggestion.bind(this),
      WAIT_INTERVAL,
      { trailing: true },
    );
  }

  handleKeyUp = e => {
    const { onFilterChange, autocomplete } = this.props;
    if ((e.which || e.keyCode) === KEY_CODES.enterKey) {
      e.target.blur();
      onFilterChange(autocomplete.searchTerm);
    }
  };

  handleChange = (e, searchQuery) => {
    if (e) {
      let value;
      if (typeof e === 'string') {
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
    this.props.validateSearchQuery(searchQuery);
  };

  handleFetchSuggestion({ value }) {
    const { version } = this.props.location.query;
    this.props.onFetchAutocompleteSuggestions(value, version);
  }

  handleSuggestionSelected = searchQuery => {
    recordEvent({
      event: 'gibct-autosuggest',
      'gibct-autosuggest-value': searchQuery,
    });
    this.props.onFilterChange(searchQuery);
  };

  render() {
    const { suggestions, searchTerm } = this.props.autocomplete;
    let errorSpan = '';
    let searchClassName = 'keyword-search';
    if (this.props.searchError) {
      searchClassName = 'usa-input-error';
      errorSpan = (
        <span
          className="usa-input-error-message"
          role="alert"
          id="search-error-message"
        >
          <span className="sr-only">Error</span>
          Please enter a city, school, or employer name.
        </span>
      );
    }
    return (
      <div className={searchClassName} id="keyword-search">
        <label
          id="institution-search-label"
          className="institution-search-label"
          htmlFor="institution-search"
        >
          {this.props.label}
        </label>
        {errorSpan}
        <Downshift
          inputValue={searchTerm}
          onSelect={item => this.handleSuggestionSelected(item)}
          itemToString={item => {
            if (typeof item === 'string' || !item) {
              return item;
            }
            return item.label;
          }}
        >
          {({
            getInputProps,
            getItemProps,
            isOpen,
            highlightedIndex,
            selectedItem,
          }) => (
            <div>
              <input
                {...getInputProps({
                  type: 'text',
                  onChange: this.handleChange,
                  onKeyUp: this.handleKeyUp,
                  onFocus: handleInputFocus.bind(this, 'keyword-search'),
                  'aria-labelledby': 'institution-search-label',
                })}
              />
              {isOpen && (
                <div className="suggestions-list" role="listbox">
                  {suggestions.map((item, index) => (
                    <div
                      key={index}
                      role="option"
                      aria-selected={
                        selectedItem === item.label ? 'true' : 'false'
                      }
                      className={classNames('suggestion', {
                        'suggestion-highlighted': highlightedIndex === index,
                      })}
                      {...getItemProps({ item: item.label })}
                    >
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
  validateSearchQuery: () => {},
};

KeywordSearch.propTypes = {
  label: PropTypes.string,
  onClearAutocompleteSuggestions: PropTypes.func,
  onFetchAutocompleteSuggestions: PropTypes.func,
  onFilterChange: PropTypes.func,
  onUpdateAutocompleteSearchTerm: PropTypes.func,
  searchError: PropTypes.bool,
  validateSearchQuery: PropTypes.func,
};

export default KeywordSearch;
