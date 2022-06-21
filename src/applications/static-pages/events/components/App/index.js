// Node modules.
import React from 'react';
import PropTypes from 'prop-types';
// Relative imports.
import Events from '../Events';

export const App = ({ rawEvents }) => {
  return <Events rawEvents={rawEvents} />;
};

App.propTypes = {
  rawEvents: PropTypes.arrayOf(
    PropTypes.shape({
      entityUrl: PropTypes.shape({
        path: PropTypes.string,
      }),
      fieldDatetimeRangeTimezone: PropTypes.arrayOf(
        PropTypes.shape({
          value: PropTypes.number,
          endValue: PropTypes.number,
          timezone: PropTypes.string,
        }),
      ).isRequired,
      fieldDescription: PropTypes.string,
      fieldFacilityLocation: PropTypes.object,
      fieldFeatured: PropTypes.bool,
      fieldLocationHumanreadable: PropTypes.string,
      title: PropTypes.string,
    }),
  ).isRequired,
};

export default App;
