// Node modules.
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
// Relative imports.
import SearchForm from '../../containers/SearchForm';
import SearchResults from '../../containers/SearchResults';
import { toggleShowMobileFormAction } from '../../actions';
import { getYellowRibbonAppState } from '../../helpers/selectors';
import { CURRENT_SCHOOL_YEAR } from '../../constants';

export const SearchResultsPage = ({
  hasFetchedOnce,
  showMobileForm,
  toggleShowMobileForm,
  totalResults,
}) => (
  <>
    {/* Title */}
    <h1 className="vads-u-margin-bottom--0">
      Yellow Ribbon school search results
      {/* Screen reader total results */}
      {hasFetchedOnce && (
        <span className="vads-u-visibility--screen-reader">
          search returned {totalResults} schools
        </span>
      )}
    </h1>

    <div className="vads-l-row">
      {/* Search Form */}
      <div className="vads-l-col--12">
        {/* Pre-form content */}
        <p className="vads-l-col--12 medium-screen:vads-l-col--9">
          Information for participating schools is for the current academic
          year, {CURRENT_SCHOOL_YEAR}.
        </p>
      </div>

      {/* Search Form */}
      <div className="vads-l-col--12 medium-screen:vads-l-col--3">
        {/* Toggle Mobile Form */}
        <button
          className="usa-button-secondary usa-button-big medium-screen:vads-u-display--none vads-u-font-size--md"
          onClick={toggleShowMobileForm}
          type="button"
        >
          Change search criteria{' '}
          <i
            className={classNames('fa', 'vads-u-padding-left--0p5', {
              'fa-chevron-down': !showMobileForm,
              'fa-chevron-up': showMobileForm,
            })}
          />
        </button>

        {/* Search Form Fields */}
        <SearchForm />
      </div>

      {/* Search Results */}
      <div className="vads-l-col--12 vads-u-padding-left--0 medium-screen:vads-l-col--9 medium-screen:vads-u-padding-left--5">
        <SearchResults />
      </div>
    </div>
  </>
);

SearchResultsPage.propTypes = {
  // From mapStateToProps.
  hasFetchedOnce: PropTypes.bool.isRequired,
  showMobileForm: PropTypes.bool.isRequired,
  totalResults: PropTypes.number,
  // From mapDispatchToProps.
  toggleShowMobileForm: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  hasFetchedOnce: getYellowRibbonAppState(state).hasFetchedOnce,
  showMobileForm: getYellowRibbonAppState(state).showMobileForm,
  totalResults: getYellowRibbonAppState(state).totalResults,
});

const mapDispatchToProps = dispatch => ({
  toggleShowMobileForm: () => dispatch(toggleShowMobileFormAction()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchResultsPage);
