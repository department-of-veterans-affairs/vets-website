// Dependencies.
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import URLSearchParams from 'url-search-params';
import map from 'lodash/map';
// Relative imports.
import ErrorableCheckbox from '@department-of-veterans-affairs/formation-react/ErrorableCheckbox';
import STATES from 'platform/static-data/STATES.json';
import scrollToTop from 'platform/utilities/ui/scrollToTop';
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
    const contributionAmount = queryParams.get('contributionAmount') || '';
    const name = queryParams.get('name') || '';
    const numberOfStudents = queryParams.get('numberOfStudents') || '';
    const state = queryParams.get('state') || '';

    this.state = {
      city,
      contributionAmount,
      name,
      numberOfStudents,
      state,
    };
  }

  componentDidMount() {
    const {
      city,
      contributionAmount,
      name,
      numberOfStudents,
      state,
    } = this.state;

    // Fetch the results with their name if it's on the URL.
    if (city || contributionAmount || name || numberOfStudents || state) {
      this.props.fetchResultsThunk({
        city,
        contributionAmount,
        name,
        numberOfStudents,
        state,
      });
    }
  }

  onCheckboxChange = key => () => {
    // Uncheck the checkbox.
    if (this.state[key]) {
      this.setState({ [key]: '' });
      return;
    }

    // Check the checkbox.
    this.setState({ [key]: 'unlimited' });
  };

  onReactStateChange = key => event => {
    this.setState({ [key]: event.target.value });
  };

  onSubmitHandler = event => {
    const {
      city,
      contributionAmount,
      name,
      numberOfStudents,
      state,
    } = this.state;

    // Prevent default browser behavior.
    event.preventDefault();

    // Attempt to fetch results.
    this.props.fetchResultsThunk({
      city,
      contributionAmount,
      name,
      numberOfStudents,
      page: 1,
      state,
    });

    // Scroll to top.
    scrollToTop();
  };

  render() {
    const { onCheckboxChange, onReactStateChange, onSubmitHandler } = this;
    const {
      city,
      contributionAmount,
      name,
      numberOfStudents,
      state,
    } = this.state;

    return (
      <form
        className="vads-l-grid-container vads-u-padding--0"
        name="yellow-ribbon-form"
        onSubmit={onSubmitHandler}
      >
        {/* Name Field */}
        <label
          htmlFor="yr-search-name"
          className="vads-u-margin-top--1 vads-u-margin--0"
        >
          School name
        </label>
        <div className="vads-u-flex--1">
          <input
            className="usa-input"
            name="yr-search-name"
            onChange={onReactStateChange('name')}
            type="text"
            value={name}
          />
        </div>

        {/* State Field */}
        <label htmlFor="yr-search-state" className="vads-u-margin-top--3">
          State or territory
        </label>
        <div className="vads-u-flex--1">
          <select
            name="yr-search-state"
            onChange={onReactStateChange('state')}
            value={state}
          >
            <option value="">- Select -</option>
            {map(STATES, provincialState => (
              <option key={provincialState?.code} value={provincialState?.code}>
                {provincialState?.label}
              </option>
            ))}
          </select>
        </div>

        {/* City Field */}
        <label
          htmlFor="yr-search-city"
          className="vads-u-margin-top--3 vads-u-margin--0"
        >
          City
        </label>
        <div className="vads-u-flex--1">
          <input
            className="usa-input"
            name="yr-search-city"
            onChange={onReactStateChange('city')}
            type="text"
            value={city}
          />
        </div>

        {/* Unlimited Contribution Amount */}
        <ErrorableCheckbox
          checked={contributionAmount === 'unlimited'}
          label="Only show schools that fund all tuition and fees not covered by Post-9/11 GI Bill benefits"
          onValueChange={onCheckboxChange('contributionAmount')}
          required={false}
        />

        {/* Unlimited Number of Students */}
        <ErrorableCheckbox
          checked={numberOfStudents === 'unlimited'}
          label="Only show schools that provide funding to all eligible students"
          onValueChange={onCheckboxChange('numberOfStudents')}
          required={false}
        />

        {/* Submit Button */}
        <button
          className="usa-button-primary va-button-primary vads-u-width--auto vads-u-padding-y--1p5 vads-u-margin-top--2"
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
