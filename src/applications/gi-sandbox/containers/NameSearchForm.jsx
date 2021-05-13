import React, { useState } from 'react';
import { connect } from 'react-redux';
import Downshift from 'downshift';
import classNames from 'classnames';
import recordEvent from 'platform/monitoring/record-event';
import {
  fetchNameAutocompleteSuggestions,
  fetchSearchByNameResults,
} from '../actions';
import { debounce } from 'lodash';
import { KEY_CODES, WAIT_INTERVAL } from '../constants';
import { handleScrollOnInputFocus } from '../utils/helpers';

export function NameSearchForm({
  autocomplete,
  fetchNameAutocomplete,
  fetchSearchByName,
}) {
  const [searchName, setSearchName] = useState(autocomplete.searchTerm);
  const { suggestions } = autocomplete;

  const doSearch = event => {
    event.preventDefault();
    fetchSearchByName(searchName);
  };

  const handleFetchSuggestion = debounce(
    () => handleFetchSuggestion(),
    WAIT_INTERVAL,
    { trailing: true },
  );

  const onFilterChange = () => {};

  const handleKeyUp = e => {
    if ((e.which || e.keyCode) === KEY_CODES.enterKey) {
      e.target.blur();
      onFilterChange('name', autocomplete.searchTerm);
    }
  };

  const handleFocus = () => {
    handleScrollOnInputFocus('name-search');
  };

  const handleNameChange = e => {
    const value = e.target.value;
    setSearchName(value);
    if (value) {
      fetchNameAutocomplete(value, {});
    }
  };

  const handleSuggestionSelected = searchQuery => {
    recordEvent({
      event: 'gibct-autosuggest',
      'gibct-autosuggest-value': searchQuery,
    });
    fetchSearchByName(searchQuery);
  };

  return (
    <div>
      <form onSubmit={doSearch}>
        <div className="vads-l-row">
          <div className="medium-screen:vads-l-col--10">
            <Downshift
              inputValue={searchName}
              onSelect={item => handleSuggestionSelected(item)}
              itemToString={item => {
                return typeof item === 'string' || !item ? item : item.label;
              }}
            >
              {({ getItemProps, isOpen, highlightedIndex, selectedItem }) => (
                <div>
                  <input
                    id={'name-search'}
                    type="text"
                    name="nameSearch"
                    className="name-search"
                    placeholder="school, employer, or training provider"
                    value={searchName}
                    onChange={handleNameChange}
                    onKeyUp={handleKeyUp}
                    onFocus={handleFocus}
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
                            'suggestion-highlighted':
                              highlightedIndex === index,
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
          <div className="medium-screen:vads-l-col--2 vads-u-text-align--right">
            <button type="submit" className="usa-button">
              Search
              <i aria-hidden="true" className="fa fa-search" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

const mapStateToProps = state => ({
  autocomplete: state.autocomplete,
});

const mapDispatchToProps = {
  fetchNameAutocomplete: fetchNameAutocompleteSuggestions,
  fetchSearchByName: fetchSearchByNameResults,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NameSearchForm);
