import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
import { Link } from 'react-router';
import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import moment from 'moment';
import { buildDateFormatter, getTrackedItemId } from '../utils/helpers';
import { ITEMS_PER_PAGE } from '../constants';

const getOldestDocuentDate = item => {
  const arrDocumentDates = item.documents.map(document => document.uploadDate);
  return arrDocumentDates.sort()[0]; // Tried to do Math.min() here and it was erroring out
};

const formatDate = date => buildDateFormatter('MMMM d, yyyy')(date);

const getTrackedItemDateFromStatus = item => {
  switch (item.status) {
    case 'NEEDED_FROM_YOU':
    case 'NEEDED_FROM_OTHERS':
      return item.requestedDate;
    case 'NO_LONGER_REQUIRED':
      return item.closedDate;
    case 'SUBMITTED_AWAITING_REVIEW':
      return getOldestDocuentDate(item);
    case 'INITIAL_REVIEW_COMPLETE':
    case 'ACCEPTED':
      return item.receivedDate;
    default:
      return item.requestedDate;
  }
};

const getTrackedItemDescription = item => {
  switch (item.status) {
    case 'NEEDED_FROM_YOU':
    case 'NEEDED_FROM_OTHERS':
      return `We opened a request for "${item.displayName}"`;
    case 'NO_LONGER_REQUIRED':
      return `We closed a request for "${item.displayName}"`;
    case 'SUBMITTED_AWAITING_REVIEW':
      return `We received your document(s) for "${item.displayName}"`;
    case 'INITIAL_REVIEW_COMPLETE':
    case 'ACCEPTED':
      return `We completed a review for "${item.displayName}"`;
    default:
      return 'There was an update to this item';
  }
};

const generateTrackedItems = claim => {
  const { trackedItems } = claim.attributes;

  return trackedItems.map(item => ({
    id: item.id,
    date: getTrackedItemDateFromStatus(item),
    description: getTrackedItemDescription(item),
    status: item.status,
    type: 'tracked_item',
  }));
};

const getSortedItems = claim => {
  // Get items from trackedItems and claimPhaseDates
  const trackedItems = generateTrackedItems(claim);
  const phaseItems = [];
  const items = [...trackedItems, ...phaseItems];

  return items.sort((item1, item2) => {
    return moment(item2.date) - moment(item1.date);
  });
};

function RecentActivity({ claim }) {
  const [currentPage, setCurrentPage] = useState(1);
  const items = getSortedItems(claim);
  const pageLength = items.length;
  const numPages = Math.ceil(pageLength / ITEMS_PER_PAGE);
  const shouldPaginate = numPages > 1;
  const hasRequestType = itemStatus => {
    return (
      itemStatus === 'NEEDED_FROM_OTHERS' || itemStatus === 'NEEDED_FROM_YOU'
    );
  };
  const requestType = itemStatus => {
    if (itemStatus === 'NEEDED_FROM_OTHERS') {
      return 'Request for others';
    }
    return 'Request for you';
  };

  let currentPageItems = items;

  if (shouldPaginate) {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = Math.min(currentPage * ITEMS_PER_PAGE, pageLength);
    currentPageItems = items.slice(start, end);
  }

  const onPageSelect = useCallback(
    selectedPage => {
      setCurrentPage(selectedPage);
    },
    [setCurrentPage],
  );

  return (
    <div className="recent-activity-container">
      <h3 className="vads-u-margin-top--0 vads-u-margin-bottom--3">
        Recent activity
      </h3>
      {pageLength > 0 && (
        <ol className="va-list-horizontal">
          {currentPageItems.map(item => (
            <li
              key={item.id}
              className="vads-u-margin-bottom--2 vads-u-padding-bottom--1"
            >
              <h4 className="vads-u-margin-y--0">{formatDate(item.date)}</h4>
              {hasRequestType(item.status) ? (
                <>
                  <p className="vads-u-margin-top--0p5 vads-u-margin-bottom--0">
                    {requestType(item.status)}
                  </p>
                  <p className="vads-u-margin-top--0 vads-u-margin-bottom--1">
                    {item.description}
                  </p>
                </>
              ) : (
                <>
                  <p className="vads-u-margin-top--0p5 vads-u-margin-bottom--1">
                    {item.description}
                  </p>
                </>
              )}

              {item.status === 'NEEDED_FROM_OTHERS' && (
                <va-alert
                  class="optional-alert vads-u-padding-bottom--1"
                  status="info"
                  slim
                  uswds
                >
                  You don’t have to do anything, but if you have this
                  information you can{' '}
                  <Link
                    aria-label={`Add information for ${item.displayName}`}
                    className="add-your-claims-link"
                    to={`your-claims/${
                      item.id
                    }/document-request/${getTrackedItemId(item)}`}
                  >
                    add it here.
                  </Link>
                </va-alert>
              )}
            </li>
          ))}
        </ol>
      )}
      {shouldPaginate && (
        <VaPagination
          uswds
          className="vads-u-border--0"
          page={currentPage}
          pages={numPages}
          onPageSelect={e => onPageSelect(e.detail.page)}
        />
      )}
    </div>
  );
}

RecentActivity.propTypes = {
  claim: PropTypes.object,
};

export default RecentActivity;
