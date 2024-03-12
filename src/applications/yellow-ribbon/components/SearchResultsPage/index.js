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
import { getCurrentAcademicYear } from '../../helpers';

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
          year, {getCurrentAcademicYear()}.
        </p>
      </div>

      {/* Search Form */}
      <div className="vads-l-col--12 medium-screen:vads-l-col--3">
        {/* Toggle Mobile Form */}
        {/* eslint-disable-next-line @department-of-veterans-affairs/prefer-button-component */}
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

      <div className="vads-l-col--12 vads-u-padding-left--0 medium-screen:vads-l-col--9 medium-screen:vads-u-padding-left--5">
        {/* Search Results */}
        <SearchResults />

        {/* Helpful Links */}
        <div
          className="vads-u-display--none medium-screen:vads-u-display--flex vads-u-flex-direction--column vads-u-padding-x--2 vads-u-padding-y--2 vads-u-background-color--gray-light-alt vads-u-margin-top--2p5"
          data-e2e-id="yellow-ribbon--helpful-links"
        >
          <h2 className="vads-u-margin--0 vads-u-padding-bottom--1p5 vads-u-border-bottom--1px vads-u-border-color--gray-light">
            Helpful links
          </h2>
          <p className="vads-u-margin-bottom--1 vads-u-font-weight--bold">
            <a href="/education/eligibility/">
              Find out if you’re eligible for the Post-9/11 GI Bill
            </a>
          </p>
          <p className="vads-u-margin-bottom--1 vads-u-margin-top--1 vads-u-font-weight--bold">
            <a href="/education/about-gi-bill-benefits/post-9-11/yellow-ribbon-program/">
              Find out if you qualify for the Yellow Ribbon Program
            </a>
          </p>
          <p className="vads-u-margin-top--1 vads-u-font-weight--bold">
            <a href="/education/how-to-apply/">
              Apply for Post-9/11 GI Bill benefits
            </a>
          </p>
        </div>
      </div>
    </div>
  </>
);

SearchResultsPage.propTypes = {
  hasFetchedOnce: PropTypes.bool.isRequired,
  showMobileForm: PropTypes.bool.isRequired,
  toggleShowMobileForm: PropTypes.func.isRequired,
  totalResults: PropTypes.number,
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
