// Node modules.
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// Relative imports.
import FindYellowRibbonPage from '../../components/FindYellowRibbonPage';
import SearchResultsPage from '../../components/SearchResultsPage';

export const YellowRibbonApp = ({ hasFetchedOnce }) => {
  // "Yellow Ribbon school search results" page.
  if (hasFetchedOnce) {
    return <SearchResultsPage />;
  }

  // "Find a Yellow Ribbon school" page.
  return <FindYellowRibbonPage />;
};

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
