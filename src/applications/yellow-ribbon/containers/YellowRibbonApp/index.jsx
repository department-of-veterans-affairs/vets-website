// Node modules.
import React from 'react';
import Breadcrumbs from '@department-of-veterans-affairs/formation-react/Breadcrumbs';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// Relative imports.
import FindYellowRibbonPage from '../../components/FindYellowRibbonPage';
import SearchResultsPage from '../../components/SearchResultsPage';
import manifest from '../../manifest.json';

export const YellowRibbonApp = ({ hasFetchedOnce }) => (
  <>
    {/* Breadcrumbs */}
    <Breadcrumbs className="vads-u-padding--1p5 medium-screen:vads-u-pading--0">
      <a href="/">Home</a>
      <a href="/education/">Education and training</a>
      <a href={manifest.rootUrl}>Find a Yellow Ribbon school</a>
      {hasFetchedOnce && <a href={window.location.href}>Search results</a>}
    </Breadcrumbs>

    {/* Derive the Page */}
    {hasFetchedOnce ? <SearchResultsPage /> : <FindYellowRibbonPage />}
  </>
);

YellowRibbonApp.propTypes = {
  // From mapStateToProps.
  hasFetchedOnce: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  hasFetchedOnce: state.yellowRibbonReducer.hasFetchedOnce,
});

export default connect(
  mapStateToProps,
  null,
)(YellowRibbonApp);
