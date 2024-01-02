import React from 'react';
import PropTypes from 'prop-types';
import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import moment from 'moment-timezone';
import ResultsWhereContent from './ResultsWhereContent';
import {
  deriveMostRecentDate,
  deriveResultsEndNumber,
  deriveResultsStartNumber,
} from '../../helpers';

export const Results = ({
  onPageSelect,
  page,
  perPage,
  query,
  queryId,
  results,
  totalResults,
}) => {
  if (!results?.length) {
    return (
      <p
        className="vads-u-margin--0 vads-u-margin-top--2 vads-u-margin-bottom--1"
        data-testid="events-results-none-found"
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
        <h2 className="vads-u-margin--0 vads-u-margin-top--2 vads-u-margin-bottom--1 vads-u-font-size--base vads-u-font-weight--normal">
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

            const startsAtUnix = mostRecentDate?.value;
            const endsAtUnix = mostRecentDate?.endValue;
            const timezone = mostRecentDate?.timezone;

            const formattedStartsAt = moment
              .tz(startsAtUnix * 1000, timezone)
              .format('ddd MMM D, YYYY, h:mm a');
            const formattedEndsAt = moment
              .tz(endsAtUnix * 1000, timezone)
              .format('h:mm a');
            const endsAtTimezone = moment
              .tz(endsAtUnix * 1000, timezone)
              .format('z')
              .replace(/S|D/i, '');

            return (
              <div
                className="vads-u-display--flex vads-u-flex-direction--column vads-u-border-top--1px vads-u-border-color--gray-light vads-u-padding-y--4"
                key={`${title}-${entityUrl?.path}-${index}`}
              >
                <h3 className="vads-u-margin--0 vads-u-font-size--h4">
                  <a href={entityUrl.path}>{title}</a>
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
                        <i
                          className="fa fa-sync vads-u-font-size--sm vads-u-margin-right--0p5"
                          aria-hidden="true"
                        />{' '}
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
};

export default Results;
