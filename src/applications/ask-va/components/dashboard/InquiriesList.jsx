import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import InquiryCard from './InquiryCard';
import { paginateInquiries } from '../../utils/dashboard';
import SearchDescription from './SearchDescription';

/**
 * @typedef {import('./InquiryCard').Inquiry} Inquiry
 */

/**
 * @typedef {Object} InquiriesListProps
 * @property {string} categoryFilter
 * @property {Inquiry[]} inquiries
 * @property {string} query
 * @property {string} statusFilter
 * @property {string} [tabName]
 */

/**
 * @param {InquiriesListProps} props
 */
export default function InquiriesList({
  inquiries,
  categoryFilter,
  statusFilter,
  tabName,
  query,
}) {
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const itemsPerPage = 4;

  const pages = paginateInquiries(inquiries, itemsPerPage);

  const currentPageContents = pages[currentPageNum - 1] || pages[0];
  const totalPages = pages.length;

  return (
    <div>
      <SearchDescription
        total={inquiries.length}
        pageEnd={currentPageContents.pageEnd}
        pageStart={currentPageContents.pageStart}
        {...{
          categoryFilter,
          statusFilter,
          tabName,
          query,
        }}
      />
      {inquiries.length ? (
        <div className="inquiries-list">
          {currentPageContents.items.map(inquiry => (
            <InquiryCard key={inquiry.id} {...{ inquiry }} />
          ))}
        </div>
      ) : (
        <div className="no-results-alert">
          <va-alert
            close-btn-aria-label="Close notification"
            slim
            status="info"
            visible
          >
            <p className="vads-u-margin-y--0">
              No questions match your search criteria
            </p>
          </va-alert>
        </div>
      )}

      {totalPages > 1 && (
        <VaPagination
          page={currentPageNum}
          pages={totalPages}
          maxPageListLength={5}
          showLastPage
          onPageSelect={({ detail }) => {
            setCurrentPageNum(detail.page);
            focusElement('#search-description');
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
  tabName: SearchDescription.propTypes.tabName,
};
