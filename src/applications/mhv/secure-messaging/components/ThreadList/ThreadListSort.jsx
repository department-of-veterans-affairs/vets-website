import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import { threadSortingOptions } from '../../util/constants';

const SORT_CONVERSATIONS_LABEL = 'Show conversations in this order';

const ThreadListSort = props => {
  const { sortOrder, sortCallback } = props;
  const location = useLocation();
  const [sortOrderValue, setSortOrderValue] = useState(sortOrder);

  const handleSortButtonClick = async () => {
    sortCallback(sortOrderValue);
    recordEvent({
      event: 'cta-button-click',
      'button-type': 'primary',
      'button-click-label': 'Sort messages',
    });
  };

  return (
    <div className="thread-list-sort">
      <VaSelect
        id="sort-order-dropdown"
        label={SORT_CONVERSATIONS_LABEL}
        name="sort-order"
        value={sortOrder}
        onVaSelect={e => {
          setSortOrderValue(e.detail.value);
        }}
      >
        <option
          value={
            location.pathname === '/drafts'
              ? threadSortingOptions.DRAFT_DATE_DESCENDING.value
              : threadSortingOptions.SENT_DATE_DESCENDING.value
          }
        >
          Newest to oldest
        </option>

        <option
          value={
            location.pathname === '/drafts'
              ? threadSortingOptions.DRAFT_DATE_ASCENDING.value
              : threadSortingOptions.SENT_DATE_ASCENDING.value
          }
        >
          Oldest to newest
        </option>

        {location.pathname === '/sent' || location.pathname === '/drafts' ? (
          <>
            <option
              value={threadSortingOptions.RECEPIENT_ALPHA_ASCENDING.value}
            >
              A to Z - Recipient’s name
            </option>
            <option
              value={threadSortingOptions.RECEPIENT_ALPHA_DESCENDING.value}
            >
              Z to A - Recipient’s name
            </option>
          </>
        ) : (
          <>
            <option value={threadSortingOptions.SENDER_ALPHA_ASCENDING.value}>
              A to Z - Sender’s name
            </option>
            <option value={threadSortingOptions.SENDER_ALPHA_DESCENDING.value}>
              Z to A - Sender’s name
            </option>
          </>
        )}
      </VaSelect>

      <va-button
        type="button"
        text="Sort"
        label="Sort"
        data-testid="sort-button"
        onClick={handleSortButtonClick}
      />
    </div>
  );
};

ThreadListSort.propTypes = {
  sortCallback: PropTypes.func.isRequired,
  sortOrder: PropTypes.string.isRequired,
};

export default ThreadListSort;
