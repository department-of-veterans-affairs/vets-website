import PropTypes from 'prop-types';
import React from 'react';
import {
  VaButton,
  VaLink,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { getTrackedItemDisplayNameFromEvidenceSubmission } from '../../utils/helpers';
import DocumentCard from '../DocumentCard';
import { useIncrementalReveal } from '../../hooks/useIncrementalReveal';
import TimezoneDiscrepancyMessage from '../TimezoneDiscrepancyMessage';
import { ANCHOR_LINKS } from '../../constants';
import { setPageFocus } from '../../utils/page';

const generateInProgressDocs = evidenceSubmissions => {
  return (evidenceSubmissions || [])
    .filter(es => es.uploadStatus !== 'FAILED' && es.uploadStatus !== 'SUCCESS')
    .map(es => ({
      ...es,
      uploadStatusDisplayValue: 'SUBMISSION IN PROGRESS',
    }));
};

const hasFailedUploads = evidenceSubmissions => {
  return (evidenceSubmissions || []).some(es => es.uploadStatus === 'FAILED');
};

const getSortedInProgressItems = evidenceSubmissions => {
  const items = generateInProgressDocs(evidenceSubmissions);

  return items.sort((item1, item2) => {
    return new Date(item2.createdAt) - new Date(item1.createdAt);
  });
};

const FileSubmissionsInProgress = ({ claim }) => {
  const { evidenceSubmissions, supportingDocuments } = claim.attributes;

  const numSupportingDocuments = supportingDocuments.length;
  const allItems = getSortedInProgressItems(evidenceSubmissions);
  const hasFailed = hasFailedUploads(evidenceSubmissions);

  const {
    currentPageItems,
    shouldShowButton,
    nextBatchSize,
    onShowMoreClicked,
    headingRefs,
  } = useIncrementalReveal(allItems);

  return (
    <div
      className="file-submissions-in-progress-container"
      data-testid="file-submissions-in-progress"
    >
      <h3
        id="file-submissions-in-progress"
        className="vads-u-margin-top--0 vads-u-margin-bottom--3 scroll-anchor"
      >
        File submissions in progress
      </h3>
      <TimezoneDiscrepancyMessage />
      <p>
        Documents you submitted for review using this tool, or the VA: Health
        and Benefits mobile app, that we haven’t received yet. It can take up to
        2 days for us to receive them.
      </p>
      <div data-testid="file-submissions-in-progress-cards">
        {currentPageItems.length === 0 ? (
          <div>
            {hasFailed ? (
              <p>
                We received your uploaded files, except the ones our system
                couldn’t accept. You can find more about those in the{' '}
                <VaLink
                  href={`#${ANCHOR_LINKS.filesWeCouldntReceive}`}
                  text="Files we couldn’t receive section"
                  onClick={e => {
                    e.preventDefault();
                    setPageFocus(e.target.href);
                  }}
                />
                .
              </p>
            ) : (
              <>
                {numSupportingDocuments === 0 ? (
                  <p>You don’t have any file submissions in progress.</p>
                ) : (
                  <p>We’ve received all the files you’ve uploaded.</p>
                )}
              </>
            )}
          </div>
        ) : (
          <>
            {/* add explicit role=list to expose the <ul> as a list for Safari/VoiceOver */}
            {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
            <ul
              className="usa-card-group vads-u-padding-x--0 usa-unstyled-list"
              role="list"
            >
              {currentPageItems.map((item, itemIndex) => {
                const statusBadgeText = item.uploadStatusDisplayValue;
                const requestType =
                  getTrackedItemDisplayNameFromEvidenceSubmission(item);
                const requestTypeText = requestType
                  ? `Submitted in response to request: ${requestType}`
                  : 'You submitted this file as additional evidence.';

                return (
                  <li key={item.id || itemIndex}>
                    <DocumentCard
                      variant="in-progress"
                      index={itemIndex}
                      statusBadgeText={statusBadgeText}
                      headingRef={el => {
                        headingRefs.current[itemIndex] = el;
                      }}
                      fileName={item.fileName}
                      documentType={item.documentType}
                      requestTypeText={requestTypeText}
                      date={item.createdAt}
                    />
                  </li>
                );
              })}
            </ul>
            {shouldShowButton && (
              <div className="vads-u-margin-top--2">
                <VaButton
                  secondary
                  onClick={onShowMoreClicked}
                  text={`Show more in progress (${nextBatchSize})`}
                  data-testid="show-more-in-progress-button"
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

FileSubmissionsInProgress.propTypes = {
  claim: PropTypes.object.isRequired,
};

export default FileSubmissionsInProgress;
