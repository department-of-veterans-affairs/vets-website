// Node modules.
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// Relative imports.

class SearchResults extends Component {
  static propTypes = {
    // From mapStateToProps.
    // From mapDispatchToProps.
  };

  render() {
    return (
      <div className="vads-l-col--12 medium-screen:vads-l-col--8 vads-u-margin-bottom--4">
        <h1 className="vads-u-margin-top--2">Yellow Ribbon School Finder</h1>

        <p>
          Yellow Ribbon funding is an additional benefit you can receive if you
          qualify for the Post-9/11 GI Bill Education funding benefit.
        </p>

        <p>
          Participation varies by school, degree, and the program or division
          you apply to. Start your search here.
        </p>

        <form
          className="vads-l-grid-container vads-u-padding--0"
          name="yellow-ribbon-search"
          onSubmit={onSubmitHandler}
        >
          <label htmlFor="va-form-query" className="vads-u-margin--0">
            Keyword, form name, or number
          </label>
          <div className="vads-l-row">
            <div className="vads-u-margin-right--2 vads-u-flex--1">
              <input
                className="usa-input vads-u-max-width--100 vads-u-width--full"
                name="va-form-query"
                onChange={onQueryChange}
                type="text"
                value={query}
              />
            </div>
            <div>
              <button
                className="usa-button vads-u-margin--0 vads-u-margin-y--1"
                type="submit"
              >
                Search
              </button>
            </div>
          </div>
        </form>

        <label>Enter a school name, city, or state (required)</label>
        <input />

        <label>Select a degree level (required)</label>
        <input />

        <button>Search</button>

        <h2>Learn more about the Yellow Ribbon Program</h2>

        <p>Links back to YR content page</p>
      </div>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchResults);
