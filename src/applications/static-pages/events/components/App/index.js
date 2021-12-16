// Node modules.
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { sample } from 'lodash';
import { connect } from 'react-redux';
// Relative imports.
import {
  filterByOptions,
  filterEvents,
  hideLegacyEvents,
  showLegacyEvents,
} from '../../helpers';

const defaultSelectedOption = filterByOptions?.find(
  option => option.value === 'upcoming',
);

export const App = ({ rawEvents, showEventsV2 }) => {
  // Derive state.
  const [events, setEvents] = useState(
    filterEvents(rawEvents, defaultSelectedOption?.value),
  );
  const [selectedOption, setSelectedOption] = useState(defaultSelectedOption);

  // If the feature toggle is disabled, do not render.
  if (!showEventsV2) {
    showLegacyEvents();
    return null;
  }

  const onSearch = event => {
    event.preventDefault();

    // Derive selected option.
    const newSelectedOption = filterByOptions.find(
      option => option?.value === event?.target?.filterBy?.value,
    );

    // Set selected option.
    setSelectedOption(newSelectedOption);

    // Filter events.
    const filteredEvents = filterEvents(rawEvents, newSelectedOption?.value);

    // Set events.
    setEvents(filteredEvents);
  };

  hideLegacyEvents();
  return (
    <div className="vads-u-display--flex vads-u-flex-direction--column vads-u-padding-x--1p5">
      {/* Title */}
      <h1 className="vads-u-margin--0 vads-">Outreach events</h1>

      {/* Description */}
      <p className="va-introtext">
        VA benefits can help Veterans and their families buy homes, earn
        degrees, start careers, stay healthy, and more. Join an event for
        conversation and information.
      </p>

      {/* Search */}
      <form
        className="vads-u-display--flex vads-u-flex-direction--column vads-u-background-color--gray-lightest vads-u-padding-x--1 vads-u-padding-y--1p5"
        onSubmit={onSearch}
      >
        {/* Filter by */}
        <div className="vads-u-display--flex vads-u-flex-direction--row vads-u-align-items--center vads-u-margin-y--1">
          <label
            className="vads-u-margin--0 vads-u-margin-right--1"
            htmlFor="filterBy"
            style={{ flexShrink: 0 }}
          >
            Filter by
          </label>
          <select name="filterBy" id="filterBy">
            {filterByOptions?.map(option => (
              <option key={option?.value} value={option?.value}>
                {option?.label}
              </option>
            ))}
          </select>
        </div>

        {/* Submit */}
        <button className="usa-button-primary" type="submit">
          Filter events
        </button>
      </form>

      {/* Showing 10 results for All upcoming */}
      {events && (
        <p className="vads-u-margin--0 vads-u-margin-top--2 vads-u-margin-bottom--1">
          Showing {events?.length} results for{' '}
          <strong>{selectedOption?.label}</strong>
        </p>
      )}

      {/* Results */}
      <div className="vads-u-display--flex vads-u-flex-direction--column">
        {events?.map(event => {
          // Derive event properties.
          const entityUrl = event?.entityUrl;
          const fieldDatetimeRangeTimezone = event?.fieldDatetimeRangeTimezone;
          const fieldDescription = event?.fieldDescription;
          const title = event?.title;

          // Derive starts at and ends at.
          const formattedStartsAt = moment(
            fieldDatetimeRangeTimezone?.value * 1000,
          ).format('ddd MMM D, YYYY, h:mm a');
          const formattedEndsAt = moment(
            fieldDatetimeRangeTimezone?.endValue * 1000,
          ).format('h:mm a');

          return (
            <div
              className="vads-u-display--flex vads-u-flex-direction--column vads-u-border-top--1px vads-u-border-color--gray-light vads-u-padding-y--4"
              key={`${title}-${entityUrl?.path}`}
            >
              {/* Title */}
              <h2 className="vads-u-margin--0 vads-u-font-size--h4">
                <a href={entityUrl.path}>{title}</a>
              </h2>

              {/* Description */}
              <p className="vads-u-margin--0 vads-u-margin-y--1">
                {fieldDescription}
              </p>

              {/* When */}
              <div className="vads-u-display--flex vads-u-flex-direction--row">
                <p className="vads-u-margin--0 vads-u-margin-right--0p5">
                  <strong>When:</strong>
                </p>
                <p className="vads-u-margin--0">
                  {formattedStartsAt} - {formattedEndsAt}
                </p>
              </div>

              {/* Where */}
              <div className="vads-u-display--flex vads-u-flex-direction--row">
                <p className="vads-u-margin--0 vads-u-margin-right--0p5">
                  <strong>Where:</strong>
                </p>
                <p className="vads-u-margin--0">
                  {sample([
                    'West Bend, Wisconsin',
                    'Austin, Texas',
                    'This is an online event.',
                  ])}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
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
