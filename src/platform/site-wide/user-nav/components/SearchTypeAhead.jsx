import React, { Component } from 'react';
import Downshift from 'downshift';
import classNames from 'classnames';

import IconSearch from '@department-of-veterans-affairs/formation-react/IconSearch';

import { focusElement } from 'platform/utilities/ui';

import './typeahead.scss';

export default class SearchTypeAhead extends Component {
  constructor(props) {
    super(props);
    this.state = {
      suggestions: [],
      input: '',
    };
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isVisible && this.props.isVisible) {
      focusElement('#service-type-ahead-input');
    }
  }

  handleChange = selectedSuggestion => {
    this.refs.searchform.submit();
  };

  onInputValueChange = async inputValue => {
    this.setState({ input: inputValue || '' });

    const input = this.state.input;

    if (input?.length < 2) return;

    const secret = '________SECRET_KEY________';
    const response = await fetch(
      `https://search.usa.gov/sayt?api_key=${secret}=&name=va&q=${encodeURIComponent(
        input,
      )}`,
    );

    const suggestions = await response.json();

    this.setState({ suggestions });
  };

  optionClasses = selected => classNames('dropdown-option', { selected });

  render() {
    return (
      <form
        ref="searchform"
        acceptCharset="UTF-8"
        id="search"
        method="get"
        action="/search/"
      >
        <Downshift
          onChange={this.handleChange}
          onInputValueChange={this.onInputValueChange}
          inputValue={this.state.input}
          itemToString={suggestion => suggestion}
        >
          {({
            getInputProps,
            getItemProps,
            getLabelProps,
            isOpen,
            inputValue,
            highlightedIndex,
            selectedItem,
          }) => (
            <div>
              <label
                {...getLabelProps()}
                className="sr-only"
                htmlFor="service-type-ahead-input"
              >
                Search{' '}
              </label>
              <span id="service-typeahead">
                <div className="va-flex">
                  <input
                    {...getInputProps({
                      placeholder: 'search by keyword',
                    })}
                    id="service-type-ahead-input"
                    className="usagov-search-autocomplete"
                    name="query"
                    type="text"
                    ref="searchinput"
                    required
                  />
                  {isOpen && inputValue.length >= 2 ? (
                    <div className="dropdown" role="listbox">
                      {this.state.suggestions.map((suggestion, index) => {
                        return (
                          <div
                            key={suggestion}
                            {...getItemProps({
                              item: suggestion,
                              className: this.optionClasses(
                                index === highlightedIndex,
                              ),
                              role: 'option',
                              'aria-selected': index === highlightedIndex,
                            })}
                            style={{
                              fontWeight:
                                selectedItem === suggestion ? 'bold' : 'normal',
                            }}
                          >
                            {suggestion}
                          </div>
                        );
                      })}
                    </div>
                  ) : null}
                  <button type="submit" disabled={this.state.input.length <= 2}>
                    <IconSearch color="#fff" />
                    <span className="usa-sr-only">Search</span>
                  </button>
                </div>
              </span>
            </div>
          )}
        </Downshift>
      </form>
    );
  }
}
