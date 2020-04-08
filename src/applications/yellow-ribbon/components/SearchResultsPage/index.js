// Node modules.
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// Relative imports.
import SearchForm from '../../containers/SearchForm';
import SearchResults from '../../containers/SearchResults';
import { toggleShowMobileFormAction } from '../../actions';

export const SearchResultsPage = ({
  hasFetchedOnce,
  toggleShowMobileForm,
  totalResults,
}) => (
  <div className="vads-l-grid-container vads-u-padding-x--2p5 vads-u-padding-bottom--4">
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
          Participating school information on this page is valid for the current
          academic year, from August 2019 through July 2020. To view schools for
          the previous academic year,{' '}
          <a
            href="https://www.benefits.va.gov/GIBILL/yellow_ribbon/yrp_list_2018.asp"
            rel="noreferrer noopener"
          >
            view 2018 - 2019 rates
          </a>
          .
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
          <i className="fa fa-chevron-down vads-u-padding-left--0p5" />
        </button>

        {/* Search Form Header */}
        <h2 className="vads-u-display--none vads-u-font-size--h3 vads-u-margin-top--1p5 medium-screen:vads-u-display--flex">
          Search criteria
        </h2>

        {/* Search Form Fields */}
        <SearchForm />

        {/* Helpful Links */}
        <div className="vads-u-display--none medium-screen:vads-u-display--flex vads-u-flex-direction--column">
          <h3 className="vads-u-margin-top--2">Helpful links</h3>
          <p className="vads-u-margin-bottom--1">
            <a href="/education/eligibility/">
              Find out if you&apos;re eligible for the Post-9/11 GI Bill
            </a>
          </p>
          <p className="vads-u-margin-bottom--1 vads-u-margin-top--1">
            <a href="/education/about-gi-bill-benefits/post-9-11/yellow-ribbon-program/">
              Find out if you qualify for the Yellow Ribbon Program
            </a>
          </p>
          <p className="vads-u-margin-top--1">
            <a href="/education/how-to-apply/">
              Apply for Post-9/11 GI Bill benefits
            </a>
          </p>
        </div>
      </div>

      {/* Search Results */}
      <div className="vads-l-col--12 vads-u-padding-left--0 medium-screen:vads-l-col--9 medium-screen:vads-u-padding-left--5">
        <SearchResults />
      </div>
    </div>
  </div>
);

SearchResultsPage.propTypes = {
  // From mapStateToProps.
  hasFetchedOnce: PropTypes.bool.isRequired,
  totalResults: PropTypes.number,
  // From mapDispatchToProps.
  toggleShowMobileForm: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  hasFetchedOnce: state.yellowRibbonReducer.hasFetchedOnce,
  totalResults: state.yellowRibbonReducer.totalResults,
});

const mapDispatchToProps = dispatch => ({
  toggleShowMobileForm: () => dispatch(toggleShowMobileFormAction()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchResultsPage);
