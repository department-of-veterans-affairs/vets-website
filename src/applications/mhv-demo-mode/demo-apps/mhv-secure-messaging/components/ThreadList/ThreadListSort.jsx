import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import { datadogRum } from '@datadog/browser-rum';
import { Paths, threadSortingOptions } from '../../util/constants';

const ThreadListSort = props => {
  const { sortOrder, sortCallback } = props;
  const location = useLocation();
  const [sortOrderValue, setSortOrderValue] = useState(sortOrder);

  const isDraftsPage = location.pathname === Paths.DRAFTS;
  const isDraftsOrSent =
    location.pathname === Paths.SENT || location.pathname === Paths.DRAFTS;

  const SORT_MESSAGES_LABEL = isDraftsPage
    ? 'Show drafts in this order'
    : 'Show conversations in this order';

  const handleSortButtonClick = async () => {
    sortCallback(sortOrderValue);
    recordEvent({
      event: 'cta-button-click',
      'button-type': 'primary',
      'button-click-label': 'Sort messages',
    });
  };

  const handleSelectChange = e => {
    const { value } = e.detail;
    setSortOrderValue(value);
    if (e.target?.children) {
      const selectedOption = Array.from(e.target.children).find(
        item => item.value === value,
      );
      datadogRum.addAction(`Sort option - ${selectedOption?.label}`);
    }
  };

  const sortOptions = [
    {
      value: isDraftsPage
        ? threadSortingOptions.DRAFT_DATE_DESCENDING.value
        : threadSortingOptions.SENT_DATE_DESCENDING.value,
      label: isDraftsPage
        ? threadSortingOptions.DRAFT_DATE_DESCENDING.label
        : threadSortingOptions.SENT_DATE_DESCENDING.label,
    },
    {
      value: isDraftsPage
        ? threadSortingOptions.DRAFT_DATE_ASCENDING.value
        : threadSortingOptions.SENT_DATE_ASCENDING.value,
      label: isDraftsPage
        ? threadSortingOptions.DRAFT_DATE_ASCENDING.label
        : threadSortingOptions.SENT_DATE_ASCENDING.label,
    },
    {
      value: isDraftsOrSent
        ? threadSortingOptions.RECEPIENT_ALPHA_ASCENDING.value
        : threadSortingOptions.SENDER_ALPHA_ASCENDING.value,
      label: isDraftsOrSent
        ? threadSortingOptions.RECEPIENT_ALPHA_ASCENDING.label
        : threadSortingOptions.SENDER_ALPHA_ASCENDING.label,
    },
    {
      value: isDraftsOrSent
        ? threadSortingOptions.RECEPIENT_ALPHA_DESCENDING.value
        : threadSortingOptions.SENDER_ALPHA_DESCENDING.value,
      label: isDraftsOrSent
        ? threadSortingOptions.RECEPIENT_ALPHA_DESCENDING.label
        : threadSortingOptions.SENDER_ALPHA_DESCENDING.label,
    },
  ];

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
        onVaSelect={handleSelectChange}
        data-dd-action-name="Sort - Show conversations in this order"
      >
        {sortOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
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
