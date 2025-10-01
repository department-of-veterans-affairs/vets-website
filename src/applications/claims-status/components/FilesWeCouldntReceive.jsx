import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  VaLink,
  VaCard,
  VaPagination,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import OtherWaysToSendYourDocuments from './claim-files-tab-v2/OtherWaysToSendYourDocuments';
import ClaimsBreadcrumbs from './ClaimsBreadcrumbs';
import useScrollToElement from '../hooks/useScrollToElement';
import { usePagination } from '../hooks/usePagination';
import { fetchFailedUploads } from '../actions';
import { buildDateFormatter } from '../utils/helpers';
import NeedHelp from './NeedHelp';

const FilesWeCouldntReceive = () => {
  const dispatch = useDispatch();
  const scrollToOtherWays = useScrollToElement('#other-ways-to-send-documents');
  const scrollToFilesSection = useScrollToElement(
    '#files-not-received-section',
  );

  const { data: failedFiles, loading, error } = useSelector(
    state => state.disability.status.failedUploads,
  );

  const formatDate = buildDateFormatter();

  // Sort failed files by date (most recent first)
  const sortedFailedFiles = useMemo(
    () => {
      if (!failedFiles) return [];
      return [...failedFiles].sort((a, b) => {
        return new Date(b.failedDate) - new Date(a.failedDate);
      });
    },
    [failedFiles],
  );

  const {
    currentPage,
    currentPageItems,
    numPages,
    shouldPaginate,
    onPageSelect,
  } = usePagination(sortedFailedFiles);

  // Custom page select handler that scrolls to files section
  const handlePageSelect = page => {
    onPageSelect(page);
    // Scroll to the files section
    scrollToFilesSection();
  };

  useEffect(
    () => {
      // Fetch failed uploads on component mount
      dispatch(fetchFailedUploads());
    },
    [dispatch],
  );

  const content = (
    <>
      <h1>Files we couldn’t receive</h1>
      <p>
        If we couldn’t receive files you submitted online, you’ll need to submit
        them by mail or in person.
      </p>
      <VaLink
        class="vads-u-display--block"
        href="#other-ways-to-send-documents"
        text="Learn about other ways to send your documents."
        onClick={e => {
          e.preventDefault();
          scrollToOtherWays();
        }}
      />
      <div
        id="files-not-received-section"
        className="files-not-received-section"
        data-testid="files-not-received-section"
      >
        <h2>Files not received</h2>
        <p>
          This is a list of files you submitted using this tool that we couldn’t
          receive. You’ll need to resubmit these documents by mail or in person.
          We’re sorry about this.
        </p>
        <p>
          <strong>Note:</strong> If you already resubmitted these files, you
          don’t need to do anything else. Files submitted by mail or in person,
          by you or by others, don’t appear in this tool.
        </p>

        {(() => {
          if (error) {
            return (
              <div className="error vads-u-margin-y--3">
                <p>
                  Sorry, we couldn’t load your failed uploads. Please try again
                  later.
                </p>
              </div>
            );
          }

          if (sortedFailedFiles && sortedFailedFiles.length > 0) {
            return (
              <>
                {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
                <ul
                  className="failed-files-list"
                  data-testid="failed-files-list"
                  role="list"
                >
                  {currentPageItems.map(file => (
                    <li key={file.id}>
                      <VaCard
                        class="vads-u-margin-y--3"
                        data-testid={`failed-file-${file.id}`}
                      >
                        <div className="vads-u-margin-bottom--2">
                          <strong>
                            File name:
                            {file.fileName}
                          </strong>{' '}
                        </div>
                        <div>Request type: {file.trackedItemDisplayName}</div>
                        <div>Date failed: {formatDate(file.failedDate)}</div>
                        <div>File type: {file.documentType}</div>
                        <VaLink
                          href={`/track-claims/your-claims/${
                            file.claimId
                          }/status`}
                          text="Go to claim this file was uploaded for >"
                          class="vads-u-font-weight--bold"
                        />
                      </VaCard>
                    </li>
                  ))}
                </ul>
                {shouldPaginate && (
                  <VaPagination
                    page={currentPage}
                    pages={numPages}
                    onPageSelect={e => handlePageSelect(e.detail.page)}
                  />
                )}
              </>
            );
          }

          return null;
        })()}
      </div>

      <OtherWaysToSendYourDocuments />
    </>
  );

  const breadcrumbs = [
    {
      href: '#',
      label: "Files we couldn't receive",
    },
  ];

  return (
    <div>
      <div name="topScrollElement" />
      <div className="row">
        <div className="usa-width-two-thirds medium-8 columns">
          <ClaimsBreadcrumbs crumbs={breadcrumbs} />
          {loading ? (
            <va-loading-indicator
              set-focus
              message="Loading your failed uploads..."
            />
          ) : (
            content
          )}
          <NeedHelp />
        </div>
      </div>
    </div>
  );
};

export default FilesWeCouldntReceive;
