// Node modules.
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import URLSearchParams from 'url-search-params';
import map from 'lodash/map';
import { connect } from 'react-redux';
// Relative imports.
import CATEGORIES from '../../constants/CATEGORIES';
import PLATFORMS from '../../constants/PLATFORMS';
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
    const category = queryParams.get('category') || '';
    const platform = queryParams.get('platform') || '';

    this.state = {
      category,
      platform,
    };
  }

  componentDidMount() {
    const { category, platform } = this.state;

    // Fetch the results with their name if it's on the URL.
    if (category || platform) {
      this.props.fetchResultsThunk({ category, platform });
    }
  }

  onStateChange = key => event => {
    this.setState({ [key]: event.target.value });
  };

  onSubmitHandler = event => {
    const { category, platform } = this.state;

    // Prevent default browser behavior.
    event.preventDefault();

    // Attempt to fetch results.
    this.props.fetchResultsThunk({
      category,
      platform,
      page: 1,
      trackSearch: true,
    });

    // Scroll to top.
    scrollToTop();
  };

  render() {
    const { onStateChange, onSubmitHandler } = this;
    const { fetching } = this.props;
    const { category, platform } = this.state;

    return (
      <form
        className="vads-u-display--flex vads-u-align-items--flex-end vads-u-justify-content--space-between vads-u-padding--2 medium-screen:vads-u-padding--4 vads-u-background-color--gray-lightest vads-u-margin-bottom--4"
        data-e2e-id="search-form"
        name="form"
        onSubmit={onSubmitHandler}
      >
        {/* Platform Field */}
        <label
          htmlFor="platform-field"
          className="vads-u-width--full vads-u-margin-top--0"
        >
          Choose a device or platform
          <select
            aria-label="Device or Platform"
            id="platform-field"
            name="platform-field"
            onChange={onStateChange('platform')}
            value={platform}
          >
            <option value="">All devices</option>
            {map(PLATFORMS, platformOption => (
              <option key={platformOption?.value} value={platformOption?.value}>
                {platformOption?.label}
              </option>
            ))}
          </select>
        </label>

        {/* Category Field */}
        <label
          htmlFor="category-field"
          className="vads-u-width--full vads-u-margin-left--2 vads-u-margin-top--0"
        >
          Choose a service category
          <select
            aria-label="Service Category"
            id="category-field"
            name="category-field"
            onChange={onStateChange('category')}
            value={category}
          >
            <option value="">All categories</option>
            {map(CATEGORIES, categoryOption => (
              <option key={categoryOption?.value} value={categoryOption?.value}>
                {categoryOption?.label}
              </option>
            ))}
          </select>
        </label>

        {/* Submit Button */}
        <button
          className="usa-button vads-u-margin--0 vads-u-margin-left--2 vads-u-margin-bottom--0p5 vads-u-width--auto vads-u-padding-y--1p5"
          disabled={fetching}
          type="submit"
        >
          Filter
        </button>
      </form>
    );
  }
}

const mapStateToProps = state => ({
  fetching: state.thirdPartyAppsReducer.fetching,
});

const mapDispatchToProps = {
  fetchResultsThunk,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchForm);
