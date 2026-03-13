import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import InquiryCard from './InquiryCard';
import { paginateInquiries } from '../../utils/inbox';
import SearchDescription from './SearchDescription';

/**
 * @typedef {import('./InquiryCard').Inquiry} Inquiry
 */

/**
 * @typedef {Object} InquiriesListProps
 * @property {Inquiry[]} inquiries
 * @property {string} categoryFilter
 * @property {string} statusFilter
 * @property {string} query
 * @property {string} [tabName]
 */

/**
 * @param {InquiriesListProps} props
 */
export default function InquiriesList({
  inquiries,
  categoryFilter,
  statusFilter,
  query,
  tabName,
}) {
  // TODO delete after new inbox goes live
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const isNewInbox = useToggleValue(TOGGLE_NAMES.askVaEnhancedInbox);

  const [currentPageNum, setCurrentPageNum] = useState(1);
  const itemsPerPage = 6;

  const pages = paginateInquiries(inquiries, itemsPerPage);

  const currentPageContents = pages[currentPageNum - 1] || pages[0];
  const totalPages = pages.length;

  return (
    <>
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
        <div className={isNewInbox ? 'inquiries-list' : 'inquiries-list-old'}>
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
    </>
  );
}

InquiriesList.propTypes = {
  categoryFilter: PropTypes.string.isRequired,
  inquiries: PropTypes.arrayOf(InquiryCard.propTypes.inquiry).isRequired,
  query: PropTypes.string.isRequired,
  statusFilter: PropTypes.string.isRequired,
  tabName: SearchDescription.propTypes.tabName,
};
