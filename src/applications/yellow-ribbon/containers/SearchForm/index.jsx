// Dependencies.
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import URLSearchParams from 'url-search-params';
import { map } from 'lodash';
// Relative imports.
import STATES from '../../constants/STATES.json';
import { fetchResultsThunk } from '../../actions';

export class SearchForm extends Component {
  static propTypes = {
    // From mapStateToProps.
    fetching: PropTypes.bool.isRequired,
    // From mapDispatchToProps.
    fetchResultsThunk: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    // Derive the current name params.
    const queryParams = new URLSearchParams(window.location.search);

    // Derive the state values from our query params.
    const city = queryParams.get('city') || '';
    const name = queryParams.get('name') || '';
    const state = queryParams.get('state') || '';

    this.state = {
      city,
      name,
      state,
    };
  }

  componentDidMount() {
    const { city, name, state } = this.state;

    // Fetch the results with their name if it's on the URL.
    if (city || name || state) {
      this.props.fetchResultsThunk({ city, name, state });
    }
  }

  onStateChange = key => event => {
    this.setState({ [key]: event.target.value });
  };

  onSubmitHandler = event => {
    const { city, name, state } = this.state;
    event.preventDefault();
    this.props.fetchResultsThunk({ city, name, state });
  };

  render() {
    const { onStateChange, onSubmitHandler } = this;
    const { city, name, state } = this.state;

    return (
      <form
        className="vads-l-grid-container vads-u-padding--0"
        name="yellow-ribbon-form"
        onSubmit={onSubmitHandler}
      >
        {/* Name Field */}
        <label htmlFor="yr-search-name" className="vads-u-margin--0">
          School name
        </label>
        <div className="vads-u-margin-right--2 vads-u-flex--1">
          <input
            className="usa-input vads-u-max-width--100 vads-u-width--full"
            name="yr-search-name"
            onChange={onStateChange('name')}
            type="text"
            value={name}
          />
        </div>

        {/* City Field */}
        <label htmlFor="yr-search-name" className="vads-u-margin--0">
          City
        </label>
        <div className="vads-u-margin-right--2 vads-u-flex--1">
          <input
            className="usa-input vads-u-max-width--100 vads-u-width--full"
            name="yr-search-name"
            onChange={onStateChange('city')}
            type="text"
            value={city}
          />
        </div>

        {/* State Field */}
        <label htmlFor="yr-search-name" className="vads-u-margin--0">
          State
        </label>
        <div className="vads-u-margin-right--2 vads-u-flex--1">
          <select
            name="yr-search-name"
            onChange={onStateChange('state')}
            value={state}
          >
            <option value="" />
            {map(STATES, provincialState => (
              <option key={provincialState?.code} value={provincialState?.code}>
                {provincialState?.label}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <button
          className="usa-button vads-u-margin--0 vads-u-margin-y--1"
          type="submit"
        >
          Search
        </button>
      </form>
    );
  }
}

const mapStateToProps = state => ({
  fetching: state.yellowRibbonReducer.fetching,
});

const mapDispatchToProps = {
  fetchResultsThunk,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchForm);
