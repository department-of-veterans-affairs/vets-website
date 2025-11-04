import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { format, utcToZonedTime } from 'date-fns-tz';
import ResultsWhereContent from './ResultsWhereContent';
import {
  deriveMostRecentDate,
  deriveResultsEndNumber,
  deriveResultsStartNumber,
} from '../../helpers';

const getUserTimeZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;
const isUserInUS = () => {
  const userTimeZone = getUserTimeZone();
  return userTimeZone.startsWith('America/');
};

/**
 * Formats an event's date and time with the appropriate timezone
 * Follows VA.gov date formatting standards:
 * - Weekday abbreviated with period (e.g., "Wed.")
 * - Month abbreviated (e.g., "Mar")
 * - Day as number
 * - Full year
 * - 12-hour time with lowercase am/pm
 * - Timezone abbreviation (e.g., "CT" for Central)
 *
 * @see https://design.va.gov/content-style-guide/dates-and-numbers
 * @returns {Object} Formatted date strings
 * @returns {string} .formattedStartsAt - Start date/time (e.g., "Wed. Mar 20, 2024, 9:00 a.m.")
 * @returns {string} .formattedEndsAt - End time (e.g., "11:00 a.m.")
 * @returns {string} .endsAtTimezone - Timezone abbreviation (e.g., "CT")
 */
export const formatEventDateTime = dateTimeRange => {
  const {
    value: startUnix,
    endValue: endUnix,
    timezone: eventTimeZone,
  } = dateTimeRange;
  const userTimeZone = getUserTimeZone();
  const useUserTimeZone = isUserInUS();
  const displayTimeZone = useUserTimeZone
    ? userTimeZone
    : eventTimeZone || 'America/New_York';
  const zonedStartTime = utcToZonedTime(
    new Date(startUnix * 1000),
    displayTimeZone,
  );
  const zonedEndTime = utcToZonedTime(
    new Date(endUnix * 1000),
    displayTimeZone,
  );
  const formattedStartsAt = format(
    zonedStartTime,
    'EEE. MMM d, yyyy, h:mm aaaa',
  );
  const formattedEndsAt = format(zonedEndTime, 'h:mm aaaa');
  const endsAtTimezone = format(zonedEndTime, 'zzz', {
    timeZone: displayTimeZone,
  }).replace(/S|D/i, '');

  return {
    formattedStartsAt,
    formattedEndsAt,
    endsAtTimezone,
  };
};

export const Results = ({
  onPageSelect,
  page,
  perPage,
  query,
  queryId,
  results,
  totalResults,
  shouldFocus = false,
  onFocusComplete,
}) => {
  const noResultsRef = useRef(null);
  const resultsHeaderRef = useRef(null);

  // Focus the appropriate element when filters are applied (not on page load)
  useEffect(
    () => {
      if (shouldFocus) {
        if (results?.length > 0) {
          resultsHeaderRef.current?.focus();
        } else {
          noResultsRef.current?.focus();
        }
        onFocusComplete();
      }
    },
    [shouldFocus, results?.length, onFocusComplete],
  );

  if (!results?.length) {
    return (
      <p
        className="vads-u-margin--0 vads-u-margin-top--2 vads-u-margin-bottom--1"
        data-testid="events-results-none-found"
        tabIndex="-1"
        ref={noResultsRef}
      >
        {queryId === 'custom-date-range' ? (
          <span>No results found for Custom date range</span>
        ) : (
          <span>
            No results found for <strong>{query}</strong>
          </span>
        )}
      </p>
    );
  }

  // Derive values for "Displayed x-x out of x results."
  const resultsStartNumber = deriveResultsStartNumber(page, perPage);
  const resultsEndNumber = deriveResultsEndNumber(page, perPage, totalResults);

  return (
    <>
      {/* Showing 10 results for All upcoming */}
      {results && (
        <h2
          className="vads-u-margin--0 vads-u-margin-top--2 vads-u-margin-bottom--1 vads-u-font-size--base vads-u-font-weight--normal"
          data-events-focus="true"
          tabIndex="-1"
          ref={resultsHeaderRef}
        >
          <span>Displaying {resultsStartNumber}</span>
          <span className="vads-u-visibility--screen-reader">through</span>
          <span aria-hidden="true">&ndash;</span>
          <span>
            {resultsEndNumber} of {totalResults} results for{' '}
            <strong>{query}</strong>
          </span>
        </h2>
      )}
      {/* Events */}
      {results && (
        <div className="vads-u-display--flex vads-u-flex-direction--column">
          {results?.map((event, index) => {
            const entityUrl = event?.entityUrl;
            const fieldDescription = event?.fieldDescription;
            const title = event?.title;

            const mostRecentDate = deriveMostRecentDate(
              event?.fieldDatetimeRangeTimezone[0],
            );

            const {
              formattedStartsAt,
              formattedEndsAt,
              endsAtTimezone,
            } = formatEventDateTime(mostRecentDate);

            return (
              <div
                className="vads-u-display--flex vads-u-flex-direction--column vads-u-border-top--1px vads-u-border-color--gray-light vads-u-padding-y--4"
                key={`${title}-${entityUrl?.path}-${index}`}
              >
                <h3 className="vads-u-margin--0 vads-u-font-size--h4">
                  <va-link href={entityUrl.path} text={title} />
                </h3>
                <p className="vads-u-margin--0 vads-u-margin-y--1">
                  {fieldDescription}
                </p>
                <div className="vads-u-display--flex vads-u-flex-direction--row">
                  <p className="vads-u-margin--0 vads-u-margin-right--0p5">
                    <strong>When:</strong>
                  </p>
                  <div className="vads-u-display--flex vads-u-flex-direction--column">
                    <p className="vads-u-margin--0">
                      {formattedStartsAt} – {formattedEndsAt} {endsAtTimezone}
                    </p>
                    {event?.fieldDatetimeRangeTimezone?.length > 1 && (
                      <p className="vads-u-margin--0">
                        <va-icon
                          icon="autorenew"
                          size="3"
                          class="vads-u-margin-right--0p5"
                        />
                        Repeats
                      </p>
                    )}
                  </div>
                </div>
                <ResultsWhereContent event={event} />
              </div>
            );
          })}
        </div>
      )}
      <VaPagination
        className="vads-u-border-top--0"
        onPageSelect={e => onPageSelect(e.detail.page)}
        page={page}
        pages={Math.ceil(totalResults / perPage)}
        maxPageListLength={perPage}
        showLastPage
        uswds
      />
    </>
  );
};

Results.propTypes = {
  page: PropTypes.number.isRequired,
  perPage: PropTypes.number.isRequired,
  query: PropTypes.string.isRequired,
  results: PropTypes.arrayOf(
    PropTypes.shape({
      entityUrl: PropTypes.object.isRequired,
      fieldDatetimeRangeTimezone: PropTypes.arrayOf(
        PropTypes.shape({
          endValue: PropTypes.number.isRequired,
          timezone: PropTypes.string,
          value: PropTypes.number.isRequired,
        }),
      ).isRequired,
      fieldDescription: PropTypes.string,
      title: PropTypes.string.isRequired,
    }),
  ).isRequired,
  totalResults: PropTypes.number.isRequired,
  onPageSelect: PropTypes.func.isRequired,
  queryId: PropTypes.string,
  shouldFocus: PropTypes.bool,
  onFocusComplete: PropTypes.func,
};

export default Results;
