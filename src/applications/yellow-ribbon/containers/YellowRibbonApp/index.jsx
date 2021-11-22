// Node modules.
import React from 'react';
import Breadcrumbs from '@department-of-veterans-affairs/component-library/Breadcrumbs';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// Relative imports.
import FindYellowRibbonPage from '../../components/FindYellowRibbonPage';
import SearchResultsPage from '../../components/SearchResultsPage';
import manifest from '../../manifest.json';
import { getYellowRibbonAppState } from '../../helpers/selectors';

export const YellowRibbonApp = ({ hasFetchedOnce }) => (
  <div
    className="vads-l-grid-container vads-u-padding-x--1p5 vads-u-padding-bottom--4"
    data-e2e-id="yellow-ribbon-app"
  >
    {/* Breadcrumbs */}
    <Breadcrumbs className="vads-u-padding-x--0 vads-u-padding-y--1p5 medium-screen:vads-u-padding-y--0">
      <a href="/">Home</a>
      <a href="/education/">Education and training</a>
      <a href={manifest.rootUrl}>Find a Yellow Ribbon school</a>
      {hasFetchedOnce && <a href={window.location.href}>Search results</a>}
    </Breadcrumbs>

    {/* Derive the Page */}
    {hasFetchedOnce ? <SearchResultsPage /> : <FindYellowRibbonPage />}
  </div>
);

YellowRibbonApp.propTypes = {
  // From mapStateToProps.
  hasFetchedOnce: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  hasFetchedOnce: getYellowRibbonAppState(state).hasFetchedOnce,
});

export default connect(
  mapStateToProps,
  null,
)(YellowRibbonApp);
