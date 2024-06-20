import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { parseDate, getStatusExtractPhase } from '../../util/helpers';
import { refreshPhases } from '../../util/constants';

const NewRecordsIndicator = ({
  refreshState,
  extractType,
  newRecordsFound,
}) => {
  const [refreshedOnThisPage, setRefreshedOnThisPage] = useState(false);

  const refreshPhase = useMemo(
    () => {
      getStatusExtractPhase(
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
          return parseDate(extract.lastSuccessfulCompleted);
      }
      return null;
    },
    [refreshState.status, extractType],
  );

  const content = () => {
    console.log('refreshedOnThisPage', refreshedOnThisPage);
    if (refreshedOnThisPage) {
      if (!refreshPhase || refreshPhase === refreshPhases.IN_PROGRESS) {
        return (
          <va-loading-indicator
            message="We're checking our system for new records."
            data-testid="new-records-loading-indicator"
          />
        );
      }
      if (refreshPhase === refreshPhases.FAILED) {
        return (
          <va-alert
            status="warning"
            visible
            data-testid="new-records-refreshed-failed"
          >
            <h2>We couldn't update your records</h2>
            <p>Check back later for updates.</p>
            <p>If it still doesn't work, email us at vamhvfeedback@va.gov.</p>
            <p>Last updated at {lastSuccessfulUpdate} </p>
          </va-alert>
        );
      }
      if (newRecordsFound) {
        return (
          <va-alert visible data-testid="new-records-refreshed-stale">
            <h2>Reload to get updates</h2>
            <p>
              We found updates to your records. Reload this page to update your
              list.
            </p>
            <va-button text="Reload page" onClick={() => {}} />
          </va-alert>
        );
      }
      return (
        <va-alert
          status="success"
          visible
          data-testid="new-records-refreshed-current"
        >
          Your list is up to date
        </va-alert>
      );
    }
    return (
      <p>
        Last updated at {lastSuccessfulUpdate} [1:47 p.m. ET on June 23, 2024]
      </p>
    );
  };
  return <div id="new-records-indicator">{content()}</div>;
};

export default NewRecordsIndicator;

NewRecordsIndicator.propTypes = {
  extractType: PropTypes.string,
  newRecordsFound: PropTypes.bool,
  refreshState: PropTypes.object,
};
