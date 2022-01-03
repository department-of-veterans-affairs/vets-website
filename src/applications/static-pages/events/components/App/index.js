// Node modules.
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// Relative imports.
import Events from '../Events';
import { hideLegacyEvents, showLegacyEvents } from '../../helpers';

export const App = ({ rawEvents, showEventsV2 }) => {
  // If the feature toggle is disabled, do not render.
  if (!showEventsV2) {
    // Ensure the legacy liquid page has display: flex.
    showLegacyEvents();

    // Escape early and do not render.
    return null;
  }

  // Ensure the legacy liquid page has display: none.
  hideLegacyEvents();

  // Show the events listing page v2.
  return <Events rawEvents={rawEvents} />;
};

App.propTypes = {
  rawEvents: PropTypes.arrayOf(
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
  showEventsV2: PropTypes.bool,
};

const mapStateToProps = state => ({
  showEventsV2: state?.featureToggles?.showEventsV2,
});

export default connect(
  mapStateToProps,
  null,
)(App);
