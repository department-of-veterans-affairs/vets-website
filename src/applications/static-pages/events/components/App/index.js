import React from 'react';
import PropTypes from 'prop-types';
import Events from '../Events';
import { fleshOutRecurringEvents, removeDuplicateEvents } from '../../helpers';

export const App = ({ rawEvents }) => {
  return (
    <Events
      rawEvents={fleshOutRecurringEvents(removeDuplicateEvents(rawEvents))}
    />
  );
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
