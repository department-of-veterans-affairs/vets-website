import PropTypes from 'prop-types';
import React from 'react';

const getOldestDocuentDate = item => {
  const arrDocumentDates = item.documents.map(document => document.uploadDate);
  return arrDocumentDates.sort()[0]; // Tried to do Math.min() here and it was erroring out
};

const getTrackedItemDateFromStatus = item => {
  switch (item.status) {
    case 'NEEDED_FROM_YOU' || 'NEEDED_FROM_OTHERS':
      return item.requestedDate;
    case 'NO_LONGER_NEEDED':
      return item.closedDate;
    case 'SUBMITTED_AWAITING_REVIEW':
      return getOldestDocuentDate(item);
    case 'INITIAL_REVIEW_COMPLETE' || item.status === 'ACCEPTED':
      return item.receivedDate;
    default:
      return '1/1/2022';
  }
};

const generateTrackedItems = claim => {
  const { trackedItems } = claim.attributes;

  return trackedItems.map(item => ({
    ...item,
    date: getTrackedItemDateFromStatus(item),
    type: 'tracked_item',
  }));
};

function RecentActivity({ claim }) {
  const trackedItems = generateTrackedItems(claim);
  return (
    <div className="recent-activity-container">
      <h3 className="vads-u-margin-top--0 vads-u-margin-bottom--3">
        Recent activity
      </h3>
      {trackedItems.map(item => (
        <div key={item.id}>
          <p>{item.date}</p>
          <p>{item.displayName}</p>
          <br />
        </div>
      ))}
    </div>
  );
}

RecentActivity.propTypes = {
  claim: PropTypes.object,
};

export default RecentActivity;
