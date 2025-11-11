import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { scrollToTop } from 'platform/utilities/scroll';
import { focusElement } from '~/platform/utilities/ui';
import Results from '../Results';
import Search from '../Search';
import {
  deriveDefaultSelectedOption,
  deriveFilteredEvents,
  deriveResults,
  filterByOptions,
  updateQueryParams,
} from '../../helpers';
import { perPage } from './constants';

export const Events = ({ rawEvents }) => {
  const queryParams = new URLSearchParams(window.location.search);

  const defaultSelectedOption = deriveDefaultSelectedOption();
  const defaultEvents = deriveFilteredEvents({
    endDateDay: queryParams.get('endDateDay') || undefined,
    endDateMonth: queryParams.get('endDateMonth') || undefined,
    endDateYear: queryParams.get('endDateYear') || undefined,
    rawEvents,
    selectedOption: defaultSelectedOption,
    startDateDay: queryParams.get('startDateDay') || undefined,
    startDateMonth: queryParams.get('startDateMonth') || undefined,
    startDateYear: queryParams.get('startDateYear') || undefined,
  });

  const [events, setEvents] = useState(defaultEvents);
  const [page, setPage] = useState(1);
  const [results, setResults] = useState(deriveResults(events, page, perPage));
  const [selectedOption, setSelectedOption] = useState(defaultSelectedOption);
  const [shouldFocusResults, setShouldFocusResults] = useState(false);

  const updateDisplayedResults = filteredEvents => {
    const newPage = 1;
    setPage(newPage);

    setResults(deriveResults(filteredEvents, newPage, perPage));
  };

  const onSearch = (event, filterList, dropdownValue) => {
    const incomingValue = event?.target?.filterBy?.value || dropdownValue;

    const newSelectedOption = filterByOptions.find(
      option => option?.value === incomingValue,
    );

    setSelectedOption(newSelectedOption);

    const startDateMonth = filterList?.startDateMonth;
    const startDateDay = filterList?.startDateDay;
    const startDateYear = filterList?.startDateYear;
    const endDateMonth = filterList?.endDateMonth;
    const endDateDay = filterList?.endDateDay;
    const endDateYear = filterList?.endDateYear;

    const filteredEvents = deriveFilteredEvents({
      endDateDay,
      endDateMonth,
      endDateYear,
      rawEvents,
      selectedOption: newSelectedOption,
      startDateDay,
      startDateMonth,
      startDateYear,
    });

    setEvents(filteredEvents);

    updateDisplayedResults(filteredEvents);

    updateQueryParams({
      endDateDay,
      endDateMonth,
      endDateYear,
      selectedOption: newSelectedOption?.value,
      startDateDay,
      startDateMonth,
      startDateYear,
    });

    // Set focus flag to true when apply filter button is clicked
    setShouldFocusResults(true);
  };

  const onPageSelect = newPage => {
    focusElement('[data-events-focus]');
    setPage(newPage);
    setResults(deriveResults(events, newPage, perPage));
    scrollToTop();
  };

  return (
    <div className="events usa-width-three-fourths vads-u-display--flex vads-u-flex-direction--column vads-u-padding-x--1p5 medium-screen:vads-u-padding-x--0 vads-u-padding-bottom--2">
      <Search onSearch={onSearch} />
      <Results
        onPageSelect={onPageSelect}
        page={page}
        perPage={perPage}
        query={selectedOption?.label}
        queryId={selectedOption?.value}
        results={results}
        totalResults={events?.length || 0}
        shouldFocus={shouldFocusResults}
        onFocusComplete={() => setShouldFocusResults(false)}
      />
    </div>
  );
};

Events.propTypes = {
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

export default Events;
