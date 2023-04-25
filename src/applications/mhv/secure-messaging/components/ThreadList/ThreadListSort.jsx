import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import recordEvent from 'platform/monitoring/record-event';
import { threadSortingOptions } from '../../util/constants';

const SENDER_ALPHA_ASCENDING = 'sender-alpha-asc';
const SENDER_ALPHA_DESCENDING = 'sender-alpha-desc';
const RECEPIENT_ALPHA_ASCENDING = 'recepient-alpha-asc';
const RECEPIENT_ALPHA_DESCENDING = 'recepient-alpha-desc';

const ThreadListSort = props => {
  const { defaultSortOrder, setSortOrder, setSortBy, sortCallback } = props;
  const location = useLocation();
  const [sortOrderValue, setSortOrderValue] = useState(defaultSortOrder);

  useEffect(
    () => {
      switch (sortOrderValue) {
        case threadSortingOptions.ASCENDING:
          setSortOrder(threadSortingOptions.ASCENDING);
          if (location.pathname === '/drafts') {
            setSortBy(threadSortingOptions.SORT_BY_DRAFT_DATE);
            break;
          }
          setSortBy(threadSortingOptions.SORT_BY_SENT_DATE);
          break;
        case threadSortingOptions.DESCENDING:
          setSortOrder(threadSortingOptions.DESCENDING);
          if (location.pathname === '/drafts') {
            setSortBy(threadSortingOptions.SORT_BY_DRAFT_DATE);
            break;
          }
          setSortBy(threadSortingOptions.SORT_BY_SENT_DATE);
          break;
        case SENDER_ALPHA_ASCENDING:
          setSortOrder(threadSortingOptions.ASCENDING);
          setSortBy(threadSortingOptions.SORT_BY_SENDER);
          break;
        case SENDER_ALPHA_DESCENDING:
          setSortOrder(threadSortingOptions.DESCENDING);
          setSortBy(threadSortingOptions.SORT_BY_SENDER);
          break;
        case RECEPIENT_ALPHA_ASCENDING:
          setSortOrder(threadSortingOptions.ASCENDING);
          setSortBy(threadSortingOptions.SORT_BY_RECEPIENT);
          break;
        case RECEPIENT_ALPHA_DESCENDING:
          setSortOrder(threadSortingOptions.DESCENDING);
          setSortBy(threadSortingOptions.SORT_BY_RECEPIENT);
          break;
        default:
          setSortOrder(threadSortingOptions.ASCENDING);
          setSortBy(threadSortingOptions.SORT_BY_SENT_DATE);
      }
    },
    [sortOrderValue, setSortBy, setSortOrder, location],
  );

  return (
    <div className="thread-list-sort">
      <VaSelect
        id="sort-order-dropdown"
        label="Sort by"
        name="sort-order"
        value={defaultSortOrder}
        onVaSelect={e => {
          setSortOrderValue(e.detail.value);
        }}
      >
        <option value={threadSortingOptions.DESCENDING}>
          Newest to oldest
        </option>
        <option value={threadSortingOptions.ASCENDING}>Oldest to newest</option>
        {location.pathname !== '/sent' && location.pathname !== '/drafts' ? (
          <>
            <option value={SENDER_ALPHA_ASCENDING}>
              A to Z - Sender’s name
            </option>
            <option value={SENDER_ALPHA_DESCENDING}>
              Z to A - Sender’s name
            </option>
          </>
        ) : (
          <>
            <option value={RECEPIENT_ALPHA_ASCENDING}>
              A to Z - Recipient’s name
            </option>
            <option value={RECEPIENT_ALPHA_DESCENDING}>
              Z to A - Recipient’s name
            </option>
          </>
        )}
      </VaSelect>

      <va-button
        type="button"
        text="Sort"
        label="Sort"
        data-testid="sort-button"
        onClick={() => {
          sortCallback();
          recordEvent({
            event: 'cta-button-click',
            'button-type': 'primary',
            'button-click-label': 'Sort messages',
          });
        }}
      />
    </div>
  );
};

ThreadListSort.propTypes = {
  defaultSortOrder: PropTypes.string.isRequired,
  setSortBy: PropTypes.func.isRequired,
  setSortOrder: PropTypes.func.isRequired,
  sortCallback: PropTypes.func.isRequired,
};

export default ThreadListSort;
