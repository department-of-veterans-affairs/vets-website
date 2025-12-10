import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom-v5-compat';
import {
  VaLink,
  VaCard,
  VaPagination,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles';
import OtherWaysToSendYourDocuments from './claim-files-tab-v2/OtherWaysToSendYourDocuments';
import ClaimsBreadcrumbs from './ClaimsBreadcrumbs';
import { usePagination } from '../hooks/usePagination';
import { fetchFailedUploads } from '../actions';
import {
  buildDateFormatter,
  getTrackedItemDisplayNameFromEvidenceSubmission,
} from '../utils/helpers';
import { setPageFocus } from '../utils/page';
import { ITEMS_PER_PAGE } from '../constants';
import NeedHelp from './NeedHelp';

const FilesWeCouldntReceive = () => {
  const { TOGGLE_NAMES, useToggleValue } = useFeatureToggle();
  const isFailedUploadsEnabled = useToggleValue(
    TOGGLE_NAMES.cstShowDocumentUploadStatus,
  );

  const dispatch = useDispatch();

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

  const handlePageSelect = page => {
    onPageSelect(page);
    setPageFocus('#pagination-info');
  };

  useEffect(
    () => {
      // Only fetch failed uploads if feature flag is enabled
      if (isFailedUploadsEnabled) {
        dispatch(fetchFailedUploads());
      }
    },
    [dispatch, isFailedUploadsEnabled],
  );

  useEffect(
    () => {
      if (!loading) {
        setPageFocus('h1');
      }
    },
    [loading],
  );

  // Redirect to claims list if feature flag is disabled
  if (!isFailedUploadsEnabled) {
    return <Navigate to="/your-claims/" replace />;
  }

  let content;

  if (error) {
    content = (
      <>
        <h1>We encountered a problem</h1>
        <va-alert
          class="vads-u-margin-top--1 vads-u-margin-bottom--3"
          status="warning"
        >
          <h2 slot="headline">Your files are temporarily unavailable</h2>
          <p className="vads-u-margin-y--0">
            We’re sorry. We’re having trouble loading your files right now. Try
            again in an hour.
          </p>
        </va-alert>
      </>
    );
  } else {
    const hasFailedFiles = sortedFailedFiles && sortedFailedFiles.length > 0;

    content = (
      <>
        <h1>Files we couldn’t receive</h1>
        <p>
          If we couldn’t receive files you submitted online, you’ll need to
          submit them by mail or in person.
        </p>
        <VaLink
          className="vads-u-display--block"
          href="#other-ways-to-send-documents"
          text="Learn about other ways to send your documents."
          onClick={e => {
            e.preventDefault();
            setPageFocus('#other-ways-to-send');
          }}
        />

        <div
          id="files-not-received-section"
          className="files-not-received-section"
          data-testid="files-not-received-section"
        >
          <h2>Files not received</h2>

          {hasFailedFiles ? (
            <>
              <p>
                This is a list of files you submitted using this tool that we
                couldn’t receive. You’ll need to resubmit these documents by
                mail or in person. We’re sorry about this.
              </p>
              <p>
                <strong>Note:</strong> If you already resubmitted these files,
                you don’t need to do anything else. Files submitted by mail or
                in person, by you or by others, don’t appear in this tool.
              </p>

              {shouldPaginate &&
                (() => {
                  const listLen = sortedFailedFiles.length;
                  const start = (currentPage - 1) * ITEMS_PER_PAGE + 1;
                  const end = Math.min(currentPage * ITEMS_PER_PAGE, listLen);
                  const txt = `Showing ${start} \u2012 ${end} of ${listLen} items`;
                  return <p id="pagination-info">{txt}</p>;
                })()}

              {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
              <ul
                className="failed-files-list"
                data-testid="failed-files-list"
                role="list"
              >
                {currentPageItems.map(file => {
                  const requestTypeText = getTrackedItemDisplayNameFromEvidenceSubmission(
                    file,
                  );

                  return (
                    <li key={file.id}>
                      <VaCard
                        className="vads-u-margin-y--3"
                        data-testid={`failed-file-${file.id}`}
                      >
                        <h3
                          className="filename-title vads-u-margin-y--0 vads-u-margin-bottom--2"
                          data-dd-privacy="mask"
                          data-dd-action-name="document filename"
                        >
                          File name:
                          {file.fileName}
                        </h3>
                        {requestTypeText && (
                          <div>Request type: {requestTypeText}</div>
                        )}
                        <div>Date failed: {formatDate(file.failedDate)}</div>
                        <div>File type: {file.documentType}</div>
                        <VaLink
                          active
                          href={`/track-claims/your-claims/${
                            file.claimId
                          }/status`}
                          text="Go to claim this file was uploaded for"
                          label={`Go to the claim this file was uploaded for: ${
                            file.fileName
                          }`}
                        />
                      </VaCard>
                    </li>
                  );
                })}
              </ul>
              {shouldPaginate && (
                <VaPagination
                  page={currentPage}
                  pages={numPages}
                  onPageSelect={e => handlePageSelect(e.detail.page)}
                />
              )}
            </>
          ) : (
            <p>We’ve received all files you submitted online.</p>
          )}
        </div>

        <OtherWaysToSendYourDocuments />
      </>
    );
  }

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
