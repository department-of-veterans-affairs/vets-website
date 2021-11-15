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
  events: PropTypes.arrayOf(
    PropTypes.shape({
      entityUrl: PropTypes.shape({
        path: PropTypes.string,
      }),
      fieldDatetimeRangeTimezone: PropTypes.shape({
        value: PropTypes.number,
        endValue: PropTypes.number,
        timezone: PropTypes.string,
      }),
      fieldDescription: PropTypes.string,
      fieldFacilityLocation: PropTypes.object,
      fieldFeatured: PropTypes.bool,
      fieldLocationHumanreadable: PropTypes.string,
      title: PropTypes.string,
    }),
  ).isRequired,
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
