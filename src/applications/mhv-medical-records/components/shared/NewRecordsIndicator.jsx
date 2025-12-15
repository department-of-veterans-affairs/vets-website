import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import {
  getStatusExtractListPhase,
  getLastSuccessfulUpdate,
} from '../../util/helpers';
import { refreshPhases } from '../../util/constants';
import TrackedSpinner from './TrackedSpinner';

const NewRecordsIndicator = ({
  refreshState,
  extractType,
  newRecordsFound,
  reloadFunction,
}) => {
  const [refreshedOnThisPage, setRefreshedOnThisPage] = useState(false);

  /** Helper function to ensure `extractType` is treated as an array. */
  const normalizeExtractType = type => (Array.isArray(type) ? type : [type]);

  const refreshPhase = useMemo(
    () => {
      if (refreshState.phase === refreshPhases.CALL_FAILED) {
        return refreshPhases.CALL_FAILED;
      }
      return getStatusExtractListPhase(
        refreshState.statusDate,
        refreshState.status,
        normalizeExtractType(extractType),
        newRecordsFound,
      );
    },
    [
      extractType,
      refreshState.status,
      refreshState.statusDate,
      refreshState.phase,
      newRecordsFound,
    ],
  );

  useEffect(
    /**
     * If the PHR refresh was running while the user was viewing this page,
     * update refreshedOnThisPage to TRUE.
     */
    () => {
      const phase = getStatusExtractListPhase(
        refreshState.statusDate,
        refreshState.status,
        normalizeExtractType(extractType),
      );
      if (
        (!phase ||
          phase === refreshPhases.IN_PROGRESS ||
          phase === refreshPhases.STALE) &&
        !refreshState.isTimedOut
      ) {
        setRefreshedOnThisPage(true);
      }
    },
    [
      extractType,
      refreshState.isTimedOut,
      refreshState.status,
      refreshState.statusDate,
    ],
  );

  const lastSuccessfulUpdate = useMemo(
    () => {
      return getLastSuccessfulUpdate(
        refreshState.status,
        normalizeExtractType(extractType),
      );
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
        <h2 slot="headline">We couldn’t update your records</h2>
        <p>Check back later for updates.</p>
        <p>
          If it still doesn’t work, call us at{' '}
          <va-telephone contact={CONTACTS.MY_HEALTHEVET} /> (
          <va-telephone tty contact={CONTACTS['711']} />
          ). We’re here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.
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

  const newRecordsFoundMsg = () => {
    return (
      <va-alert
        visible
        aria-live="polite"
        data-testid="new-records-refreshed-stale"
      >
        <h2 slot="headline">Reload to get updates</h2>
        <p>
          We found updates to your records. Reload this page to update your
          list.
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
  };

  const notUpToDateMsg = () => {
    return (
      <va-alert
        status="warning"
        visible
        aria-live="polite"
        data-testid="new-records-refreshed-call_failed"
      >
        <h2 slot="headline">Your records may not be up to date.</h2>
        <p>
          There’s a problem with our system, and we can’t access the date your
          records were last updated. We’re sorry.
        </p>

        <p> Please check back later for updates.</p>

        <p>
          If it still doesn’t work, call us at{' '}
          <va-telephone contact={CONTACTS.MY_HEALTHEVET} /> (
          <va-telephone tty contact={CONTACTS['711']} />
          ). We’re here Monday through Friday, 8:00 a.m to 8:00 p. ET.
        </p>
      </va-alert>
    );
  };

  const lastUpdatedAtMsg = () => {
    return (
      <va-card
        background
        aria-live="polite"
        data-testid="new-records-last-updated"
      >
        {`Last updated at ${lastSuccessfulUpdate.time} ${
          lastSuccessfulUpdate.timeZone
        } on ${lastSuccessfulUpdate.date}`}
      </va-card>
    );
  };

  const upToDateMsg = () => {
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
  };

  const content = () => {
    if (refreshedOnThisPage) {
      if (refreshPhase === refreshPhases.FAILED) {
        return failedMsg();
      }
      if (refreshPhase === refreshPhases.CURRENT) {
        if (newRecordsFound) {
          return newRecordsFoundMsg();
        }
        return upToDateMsg();
      }
      if (!refreshState.isTimedOut) {
        return (
          <TrackedSpinner
            id="new-records-indicator-spinner"
            message="We're checking our system for new records."
            data-testid="new-records-loading-indicator"
          />
        );
      }
      return failedMsg();
    }
    if (lastSuccessfulUpdate) {
      return lastUpdatedAtMsg();
    }
    return notUpToDateMsg();
  };

  return (
    <>
      <div
        className="vads-u-margin-y--2 no-print"
        id="new-records-indicator"
        data-testid="new-records-indicator-wrapper"
      >
        {content()}
      </div>
      <div className="print-only">
        {!lastSuccessfulUpdate && (
          <>
            <p>
              <b>Your records may not be up to date.</b>
            </p>
            <p>
              There’s a problem with our system, and we can’t access the date
              your records were last updated. We’re sorry. Please check back
              later for updates. If it still doesn’t work, call us at
              877-327-0022 (TTY:711). We’re here Monday through Friday, 8:00 a.m
              to 8:00 p. ET.
            </p>
          </>
        )}
        {lastSuccessfulUpdate && (
          <p>
            Last updated at {lastSuccessfulUpdate.time} on{' '}
            {lastSuccessfulUpdate.date}
          </p>
        )}
      </div>
    </>
  );
};

export default NewRecordsIndicator;

NewRecordsIndicator.propTypes = {
  extractType: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  newRecordsFound: PropTypes.bool,
  refreshState: PropTypes.object,
  reloadFunction: PropTypes.func,
};
