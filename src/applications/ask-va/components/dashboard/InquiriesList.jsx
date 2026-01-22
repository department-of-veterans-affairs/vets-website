import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import InquiryCard from './InquiryCard';
import { paginateArray } from '../../utils/dashboard';
import FilterSummary from './FilterSummary';

export default function InquiriesList({
  inquiries,
  categoryFilter,
  statusFilter,
  tabName,
  query,
}) {
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const itemsPerPage = 4;

  const pages = paginateArray(inquiries, itemsPerPage);

  const displayPage = pages[currentPageNum - 1] || pages[0];
  const totalPages = pages.length;

  return (
    <div>
      <FilterSummary
        total={inquiries.length}
        pageEnd={Math.min(displayPage?.pageEnd, inquiries.length)}
        pageStart={displayPage?.pageStart}
        {...{
          categoryFilter,
          statusFilter,
          tabName,
          query,
        }}
      />
      <div className="inquiries-list">
        {inquiries.length ? (
          displayPage.items.map(inquiry => (
            <InquiryCard key={inquiry.id} {...{ inquiry }} />
          ))
        ) : (
          <va-alert
            close-btn-aria-label="Close notification"
            slim
            status="info"
            visible
          >
            <p className="vads-u-margin-y--0">No questions match your filter</p>
          </va-alert>
        )}
      </div>

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
  query: PropTypes.string.isRequired,
  statusFilter: PropTypes.string.isRequired,
  tabName: FilterSummary.propTypes.tabName,
};
