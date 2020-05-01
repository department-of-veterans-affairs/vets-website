// Dependencies.
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import URLSearchParams from 'url-search-params';
import classNames from 'classnames';
import map from 'lodash/map';
import { connect } from 'react-redux';
// Relative imports.
import ErrorableCheckbox from '@department-of-veterans-affairs/formation-react/ErrorableCheckbox';
import { states as STATES } from 'vets-json-schema/dist/constants.json';
import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { fetchResultsThunk } from '../../actions';

export class SearchForm extends Component {
  static propTypes = {
    // From mapStateToProps.
    fetching: PropTypes.bool.isRequired,
    showMobileForm: PropTypes.bool.isRequired,
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
      trackSearch: true,
    });

    // Scroll to top.
    scrollToTop();
  };

  render() {
    const { onCheckboxChange, onReactStateChange, onSubmitHandler } = this;
    const { fetching, showMobileForm } = this.props;
    const {
      city,
      contributionAmount,
      name,
      numberOfStudents,
      state,
    } = this.state;

    return (
      <form
        className={classNames(
          'medium-screen:vads-u-display--flex',
          'vads-l-grid-container',
          'vads-u-flex-direction--column',
          'vads-u-padding--0',
          {
            'vads-u-display--none': !showMobileForm,
          },
        )}
        data-e2e-id="search-form"
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
            aria-label="Name of institution"
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
            aria-label="State of institution"
            name="yr-search-state"
            onChange={onReactStateChange('state')}
            value={state}
          >
            <option value="">- Select -</option>
            {map(STATES.USA, provincialState => (
              <option
                key={provincialState?.value}
                value={provincialState?.value}
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
            aria-label="City of institution"
            className="usa-input"
            name="yr-search-city"
            onChange={onReactStateChange('city')}
            type="text"
            value={city}
          />
        </div>

        <div>
          {/* Unlimited Contribution Amount */}
          <ErrorableCheckbox
            checked={contributionAmount === 'unlimited'}
            label="Only show schools that provide maximum funding (tuition that's left after your Post-9/11 GI Bill)"
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
        </div>

        {/* Submit Button */}
        <button
          className="usa-button-primary va-button-primary vads-u-width--auto vads-u-padding-y--1p5 vads-u-margin-top--2"
          disabled={fetching}
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
  showMobileForm: state.yellowRibbonReducer.showMobileForm,
});

const mapDispatchToProps = {
  fetchResultsThunk,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchForm);
