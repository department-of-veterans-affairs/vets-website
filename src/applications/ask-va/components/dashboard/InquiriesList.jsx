import PropTypes from 'prop-types';
import React, { useState } from 'react';
import classNames from 'classnames';
import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import InquiryCard from './InquiryCard';
import { paginateArray } from '../../utils/dashboard';
import FilterSummary from './FilterSummary';

export default function InquiriesList({
  inquiries,
  hasTabs,
  categoryFilter,
  statusFilter,
  currentTab,
}) {
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const itemsPerPage = 4;

  if (!inquiries.length)
    return (
      <va-alert
        close-btn-aria-label="Close notification"
        slim
        status="info"
        visible
      >
        <p className="vads-u-margin-y--0">No questions match your filter</p>
      </va-alert>
    );

  const pages = paginateArray(inquiries, itemsPerPage);

  const displayPage = pages[currentPageNum - 1] || pages[0];
  const { pageStart, pageEnd } = displayPage;
  const totalPages = pages.length;

  return (
    <div>
      <FilterSummary
        total={inquiries.length}
        pageEnd={Math.min(pageEnd, inquiries.length)}
        {...{
          pageStart,
          categoryFilter,
          statusFilter,
          hasTabs,
          currentTab,
        }}
      />
      <ul
        className={classNames('dashboard-grid', {
          'grid-tabs': hasTabs,
        })}
      >
        {displayPage.items.map(inquiry => (
          <InquiryCard key={inquiry.id} {...{ inquiry }} />
        ))}
      </ul>

      {totalPages > 1 && (
        <VaPagination
          page={currentPageNum}
          pages={totalPages}
          maxPageListLength={5}
          showLastPage
          onPageSelect={({ detail }) => {
            setCurrentPageNum(detail.page);
            focusElement('#filter-summary');
          }}
          className="vads-u-border-top--0 vads-u-padding-top--0 vads-u-padding-bottom--0"
        />
      )}
    </div>
  );
}

InquiriesList.propTypes = {
  categoryFilter: PropTypes.string.isRequired,
  inquiries: PropTypes.arrayOf(InquiryCard.propTypes.inquiry).isRequired,
  statusFilter: PropTypes.string.isRequired,
  currentTab: FilterSummary.propTypes.currentTab,
  hasTabs: PropTypes.bool,
};
