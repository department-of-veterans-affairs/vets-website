// Node modules.
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// Relative imports.
import { hideLegacyEvents, showLegacyEvents } from '../../helpers';

export const App = ({ showEventsV2 }) => {
  // If the feature toggle is disabled, do not render.
  if (!showEventsV2) {
    showLegacyEvents();
    return null;
  }

  hideLegacyEvents();
  return <h1>Events v2</h1>;
};

App.propTypes = {
  // From mapStateToProps.
  showEventsV2: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  showEventsV2: state?.featureToggles?.showEventsV2,
});

export default connect(
  mapStateToProps,
  null,
)(App);
