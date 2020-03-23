// Dependencies.
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import URLSearchParams from 'url-search-params';
import classNames from 'classnames';
import map from 'lodash/map';
// Relative imports.
import ErrorableCheckbox from '@department-of-veterans-affairs/formation-react/ErrorableCheckbox';
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
    const contributionAmount = queryParams.get('contributionAmount') || '';
    const country = queryParams.get('country') || '';
    const name = queryParams.get('name') || '';
    const numberOfStudents = queryParams.get('numberOfStudents') || '';
    const state = queryParams.get('state') || '';

    this.state = {
      city,
      contributionAmount,
      country,
      name,
      numberOfStudents,
      state,
    };
  }

  componentDidMount() {
    const {
      city,
      contributionAmount,
      country,
      name,
      numberOfStudents,
      state,
    } = this.state;

    // Fetch the results with their name if it's on the URL.
    if (
      city ||
      contributionAmount ||
      country ||
      name ||
      numberOfStudents ||
      state
    ) {
      this.props.fetchResultsThunk({
        city,
        contributionAmount,
        country,
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

  onCountryChange = event => {
    // Clear `state` + `city` when `country` field is changed.
    this.setState({ country: event.target.value, city: '', state: '' });
  };

  onSubmitHandler = event => {
    const {
      city,
      contributionAmount,
      country,
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
      country,
      name,
      numberOfStudents,
      state,
    });
  };

  render() {
    const {
      onCountryChange,
      onCheckboxChange,
      onReactStateChange,
      onSubmitHandler,
    } = this;
    const {
      city,
      contributionAmount,
      country,
      name,
      numberOfStudents,
      state,
    } = this.state;

    return (
      <form
        className="vads-l-grid-container vads-u-padding--0 vads-u-margin-bottom--3"
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

        <div
          className={classNames('form-expanding-group', {
            'form-expanding-group-open': country,
          })}
        >
          {/* Country Field */}
          <label htmlFor="yr-search-country" className="vads-u-margin-top--3">
            Country
          </label>
          <div className="vads-u-flex--1">
            <select
              name="yr-search-country"
              onChange={onCountryChange}
              value={country}
            >
              <option value="">- Select -</option>
              {map(
                [{ label: 'United States', value: 'USA' }],
                countryOption => (
                  <option
                    key={countryOption?.value}
                    value={countryOption?.value}
                  >
                    {countryOption?.label}
                  </option>
                ),
              )}
            </select>
          </div>

          {country && (
            <>
              {/* State Field */}
              <label htmlFor="yr-search-state" className="vads-u-margin-top--3">
                State or Territory
              </label>
              <div className="vads-u-flex--1">
                <select
                  name="yr-search-state"
                  onChange={onReactStateChange('state')}
                  value={state}
                >
                  <option value="">- Select -</option>
                  {map(STATES, provincialState => (
                    <option
                      key={provincialState?.code}
                      value={provincialState?.code}
                    >
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
            </>
          )}
        </div>

        {/* Unlimited Contribution Amount */}
        <ErrorableCheckbox
          checked={contributionAmount === 'unlimited'}
          label="Only show schools that fund all tuition and fees not covered by Post-9/11 GI Bill Benefits"
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
          className="usa-button-primary va-button-primary vads-u-width--auto vads-u-padding-y--1p5"
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
