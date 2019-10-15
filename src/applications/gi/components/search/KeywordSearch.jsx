import PropTypes from 'prop-types';
import React from 'react';
import { debounce } from 'lodash';
import recordEvent from '../../../../platform/monitoring/record-event';
import Downshift from 'downshift';
import classNames from 'classnames';
import { WAIT_INTERVAL } from '../../constants';

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
    if ((e.which || e.keyCode) === 13) {
      e.target.blur();
      onFilterChange('name', autocomplete.searchTerm);
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
    this.props.onFilterChange('name', searchQuery);
  };

  render() {
    const { suggestions, searchTerm } = this.props.autocomplete;
    let errorSpan = '';
    let errorSpanId = undefined;
    const searchClassName = this.props.searchErrorMessage
      ? ' usa-input-error'
      : 'keyword-search';

    const searchLabelClassName = this.props.searchErrorMessage
      ? 'usa-input-error-label'
      : 'institution-search-label';

    if (this.props.searchErrorMessage && this.props.searchErrorMessage !== '') {
      errorSpanId = `${this.inputId}-error-message`;
      errorSpan = (
        <span className="usa-input-error-message" role="alert" id={errorSpanId}>
          <span className="sr-only">Error</span> {this.props.searchErrorMessage}
        </span>
      );
    }
    return (
      <div className={searchClassName}>
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
            <div className={searchLabelClassName}>
              <input
                {...getInputProps({
                  type: 'text',
                  onChange: this.handleChange,
                  onKeyUp: this.handleKeyUp,
                  'aria-labelledby': { searchLabelClassName },
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
};

KeywordSearch.propTypes = {
  label: PropTypes.string,
  onClearAutocompleteSuggestions: PropTypes.func,
  onFetchAutocompleteSuggestions: PropTypes.func,
  onFilterChange: PropTypes.func,
  onUpdateAutocompleteSearchTerm: PropTypes.func,
  searchErrorMessage: PropTypes.string,
};

export default KeywordSearch;
