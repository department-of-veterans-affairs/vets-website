import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import { Paths, threadSortingOptions } from '../../util/constants';

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
    <div
      className="thread-list-sort vads-u-display--flex"
      data-testid="thread-list-sort"
    >
      <h2 className="sr-only">Sort conversations</h2>
      <VaSelect
        id="sort-order-dropdown"
        data-dd-action-name="Sort Order Dropdown"
        className="small-screen:vads-u-margin-right--1 vads-u-width--full small-screen:vads-u-flex--1"
        label={SORT_CONVERSATIONS_LABEL}
        name="sort-order"
        value={sortOrder}
        onVaSelect={e => {
          setSortOrderValue(e.detail.value);
        }}
      >
        <option
          value={
            location.pathname === Paths.DRAFTS
              ? threadSortingOptions.DRAFT_DATE_DESCENDING.value
              : threadSortingOptions.SENT_DATE_DESCENDING.value
          }
        >
          {location.pathname === Paths.DRAFTS
            ? threadSortingOptions.DRAFT_DATE_DESCENDING.label
            : threadSortingOptions.SENT_DATE_DESCENDING.label}
        </option>

        <option
          value={
            location.pathname === Paths.DRAFTS
              ? threadSortingOptions.DRAFT_DATE_ASCENDING.value
              : threadSortingOptions.SENT_DATE_ASCENDING.value
          }
        >
          {location.pathname === Paths.DRAFTS
            ? threadSortingOptions.DRAFT_DATE_ASCENDING.label
            : threadSortingOptions.SENT_DATE_ASCENDING.label}
        </option>

        {location.pathname === Paths.SENT ||
        location.pathname === Paths.DRAFTS ? (
          <>
            <option
              value={threadSortingOptions.RECEPIENT_ALPHA_ASCENDING.value}
            >
              {threadSortingOptions.RECEPIENT_ALPHA_ASCENDING.label}
            </option>
            <option
              value={threadSortingOptions.RECEPIENT_ALPHA_DESCENDING.value}
            >
              {threadSortingOptions.RECEPIENT_ALPHA_DESCENDING.label}
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
        data-dd-action-name="Sort Button"
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
