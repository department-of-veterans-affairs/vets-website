import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import { Paths, threadSortingOptions } from '../../util/constants';

const ThreadListSort = props => {
  const { sortOrder, sortCallback } = props;
  const location = useLocation();
  const [sortOrderValue, setSortOrderValue] = useState(sortOrder);

  const SORT_MESSAGES_LABEL =
    location.pathname === Paths.DRAFTS
      ? 'Show drafts in this order'
      : 'Show conversations in this order';

  const getDDTagLabel = sortingOrderValue =>
    threadSortingOptions[sortingOrderValue]?.label || SORT_MESSAGES_LABEL;

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
      className="mobile-lg:vads-u-display--flex vads-u-align-items--flex-end"
      data-testid="thread-list-sort"
    >
      <h2 className="sr-only">Sort conversations</h2>
      <VaSelect
        id="sort-order-dropdown"
        label={SORT_MESSAGES_LABEL}
        name="sort-order"
        value={sortOrder}
        onVaSelect={e => {
          setSortOrderValue(e.detail.value);
        }}
        data-dd-action-name={`${getDDTagLabel(sortOrderValue)} Dropdown`}
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
              {threadSortingOptions.SENDER_ALPHA_ASCENDING.label}
            </option>
            <option value={threadSortingOptions.SENDER_ALPHA_DESCENDING.value}>
              {threadSortingOptions.SENDER_ALPHA_DESCENDING.label}
            </option>
          </>
        )}
      </VaSelect>

      <va-button
        class="mobile-lg:vads-u-margin-left--1 vads-u-display--block vads-u-margin-top--1p5"
        text="Sort"
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
