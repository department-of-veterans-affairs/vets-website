// Node modules.
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// Relative imports.
import Results from '../Results';
import Search from '../Search';
import scrollToTop from 'platform/utilities/ui/scrollToTop';
import {
  deriveDefaultSelectedOption,
  deriveFilteredEvents,
  deriveResults,
  filterByOptions,
  hideLegacyEvents,
  showLegacyEvents,
  updateQueryParams,
} from '../../helpers';

// Derive constants.
const perPage = 10;

export const App = ({ rawEvents, showEventsV2 }) => {
  // Derive the query params on the URL.
  const queryParams = new URLSearchParams(window.location.search);

  // Derive our default state values.
  const defaultSelectedOption = deriveDefaultSelectedOption();
  const defaultEvents = deriveFilteredEvents({
    endDateDay: queryParams.get('endDateDay') || undefined,
    endDateMonth: queryParams.get('endDateMonth') || undefined,
    rawEvents,
    selectedOption: defaultSelectedOption,
    startDateDay: queryParams.get('startDateDay') || undefined,
    startDateMonth: queryParams.get('startDateMonth') || undefined,
  });

  // Derive our state.
  const [events, setEvents] = useState(defaultEvents);
  const [page, setPage] = useState(1);
  const [results, setResults] = useState(deriveResults(events, page, perPage));
  const [selectedOption, setSelectedOption] = useState(defaultSelectedOption);

  // If the feature toggle is disabled, do not render.
  if (!showEventsV2) {
    showLegacyEvents();
    return null;
  }

  const updateDisplayedResults = filteredEvents => {
    // Reset pagination.
    const newPage = 1;
    setPage(newPage);

    // Derive and set the new results.
    setResults(deriveResults(filteredEvents, newPage, perPage));
  };

  // On search handler.
  const onSearch = event => {
    // Derive selected option.
    const newSelectedOption = filterByOptions.find(
      option => option?.value === event?.target?.filterBy?.value,
    );

    // Set selected option.
    setSelectedOption(newSelectedOption);

    // Derive startDateMonth, startDateDay, endDateMonth, and endDateDay values.
    const startDateMonth = event?.target?.startDateMonth?.value;
    const startDateDay = event?.target?.startDateDay?.value;
    const endDateMonth = event?.target?.endDateMonth?.value;
    const endDateDay = event?.target?.endDateDay?.value;

    // Derive filteredEvents.
    const filteredEvents = deriveFilteredEvents({
      endDateDay,
      endDateMonth,
      rawEvents,
      selectedOption: newSelectedOption,
      startDateDay,
      startDateMonth,
    });

    // Set events.
    setEvents(filteredEvents);

    // Update displayed results.
    updateDisplayedResults(filteredEvents);

    // Update query params.
    updateQueryParams({
      endDateDay,
      endDateMonth,
      selectedOption: newSelectedOption?.value,
      startDateDay,
      startDateMonth,
    });
  };

  // On pagination change handler.
  const onPageSelect = newPage => {
    // Update the page.
    setPage(newPage);

    // Derive and set the new results.
    setResults(deriveResults(events, newPage, perPage));

    // Scroll to top.
    scrollToTop();
  };

  hideLegacyEvents();
  return (
    <main className="usa-grid usa-grid-full">
      <div className="usa-width-three-fourths vads-u-display--flex vads-u-flex-direction--column vads-u-padding-x--1p5 vads-u-padding-bottom--2">
        {/* Title */}
        <h1 className="vads-u-margin--0 vads-">Outreach events</h1>

        {/* Description */}
        <p className="va-introtext">
          VA benefits can help Veterans and their families buy homes, earn
          degrees, start careers, stay healthy, and more. Join an event for
          conversation and information.
        </p>

        {/* Search */}
        <Search onSearch={onSearch} />

        {/* Results */}
        <Results
          onPageSelect={onPageSelect}
          page={page}
          perPage={perPage}
          query={selectedOption?.label}
          results={results}
          totalResults={events?.length || 0}
        />
      </div>
    </main>
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
