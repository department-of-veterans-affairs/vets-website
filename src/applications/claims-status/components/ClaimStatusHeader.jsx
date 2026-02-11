import React from 'react';
import PropTypes from 'prop-types';
import { DemoNotation } from '../demo';

import {
  buildDateFormatter,
  getTrackedItemDateFromStatus,
  isClaimOpen,
} from '../utils/helpers';

export default function ClaimStatusHeader({ claim }) {
  const { closeDate, status, trackedItems, claimPhaseDates } = claim.attributes;
  const getTrackedItemDates = () => {
    return trackedItems
      ? trackedItems.map(item => getTrackedItemDateFromStatus(item))
      : [];
  };
  const getLastUpdatedDate = () => {
    const phaseChangeDate = claimPhaseDates
      ? claimPhaseDates.phaseChangeDate
      : null;
    const dates = [...getTrackedItemDates(), phaseChangeDate];
    const lastUpdatedDate = dates.reduce((a, b) => (a > b ? a : b));

    return `Last updated: ${buildDateFormatter()(lastUpdatedDate)}`;
  };
  const isOpen = isClaimOpen(status, closeDate);

  return (
    <div className="claim-status-header-container">
      <h2 className="tab-header vads-u-margin-y--0">Claim status</h2>
      <DemoNotation
        theme="change"
        title="Update Status Tab intro text"
        before={'"Here\'s the latest information on your claim."'}
        after={'"Review the latest status of your claim."'}
      />
      <p className="vads-u-margin-top--1 vads-u-margin-bottom--3 va-introtext">
        Review the latest status of your claim.
      </p>
      {isOpen && (
        <div className="vads-u-margin-bottom--4">
          <span className="usa-label">In Progress</span>
          <p className="vads-u-margin-top--1 vads-u-margin-bottom--0">
            {getLastUpdatedDate()}
          </p>
        </div>
      )}
    </div>
  );
}

ClaimStatusHeader.propTypes = {
  claim: PropTypes.object,
};
