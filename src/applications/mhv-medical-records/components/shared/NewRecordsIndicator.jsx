import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { formatDateAndTime, getStatusExtractPhase } from '../../util/helpers';
import { refreshPhases } from '../../util/constants';
import FeedbackEmail from './FeedbackEmail';

const NewRecordsIndicator = ({
  refreshState,
  extractType,
  newRecordsFound,
  reloadFunction,
}) => {
  const [refreshedOnThisPage, setRefreshedOnThisPage] = useState(false);

  const refreshPhase = useMemo(
    () => {
      return getStatusExtractPhase(
        refreshState.statusDate,
        refreshState.status,
        extractType,
      );
    },
    [extractType, refreshState.status, refreshState.statusDate],
  );

  useEffect(
    /**
     * If the PHR refresh was running while the user was viewing this page,
     * update refreshedOnThisPage to TRUE.
     */
    () => {
      const phase = getStatusExtractPhase(
        refreshState.statusDate,
        refreshState.status,
        extractType,
      );
      if (
        !phase ||
        phase === refreshPhases.IN_PROGRESS ||
        phase === refreshPhases.STALE
      ) {
        setRefreshedOnThisPage(true);
      }
    },
    [extractType, refreshState.status, refreshState.statusDate],
  );

  const lastSuccessfulUpdate = useMemo(
    () => {
      if (refreshState.status) {
        const extract = refreshState.status.find(
          status => status.extract === extractType,
        );
        if (extract?.lastSuccessfulCompleted)
          return formatDateAndTime(extract.lastSuccessfulCompleted);
      }
      return null;
    },
    [refreshState.status, extractType],
  );

  const failedMsg = () => {
    return (
      <va-alert
        status="warning"
        visible
        aria-live="polite"
        data-testid="new-records-refreshed-failed"
      >
        <h2>We couldn’t update your records</h2>
        <p>Check back later for updates.</p>
        <p>
          If it still doesn’t work, email us at <FeedbackEmail />.
        </p>
        {lastSuccessfulUpdate && (
          <p>
            Last updated at {lastSuccessfulUpdate.time} on{' '}
            {lastSuccessfulUpdate.date}
          </p>
        )}
      </va-alert>
    );
  };

  const content = () => {
    if (refreshedOnThisPage) {
      if (refreshPhase === refreshPhases.FAILED) {
        return failedMsg();
      }
      if (refreshPhase === refreshPhases.CURRENT) {
        if (newRecordsFound) {
          return (
            <va-alert
              visible
              aria-live="polite"
              data-testid="new-records-refreshed-stale"
            >
              <h2>Reload to get updates</h2>
              <p>
                We found updates to your records. Reload this page to update
                your list.
              </p>
              <va-button
                text="Reload page"
                onClick={() => {
                  reloadFunction();
                }}
                data-testid="new-records-reload-button"
              />
            </va-alert>
          );
        }
        return (
          <va-alert
            status="success"
            visible
            aria-live="polite"
            data-testid="new-records-refreshed-current"
          >
            Your list is up to date
          </va-alert>
        );
      }
      if (!refreshState.isTimedOut) {
        return (
          <va-loading-indicator
            message="We're checking our system for new records."
            data-testid="new-records-loading-indicator"
          />
        );
      }
      return failedMsg();
    }
    if (lastSuccessfulUpdate) {
      return (
        <va-card
          background
          aria-live="polite"
          data-testid="new-records-last-updated"
        >
          Last updated at {lastSuccessfulUpdate.time} on{' '}
          {lastSuccessfulUpdate.date}
        </va-card>
      );
    }
    return <></>;
  };

  return (
    <div className="vads-u-margin-y--2  no-print" id="new-records-indicator">
      {content()}
    </div>
  );
};

export default NewRecordsIndicator;

NewRecordsIndicator.propTypes = {
  extractType: PropTypes.string,
  newRecordsFound: PropTypes.bool,
  refreshState: PropTypes.object,
  reloadFunction: PropTypes.func,
};
