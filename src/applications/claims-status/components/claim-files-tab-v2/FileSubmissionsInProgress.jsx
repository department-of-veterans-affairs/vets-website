import PropTypes from 'prop-types';
import React from 'react';
import {
  VaCard,
  VaButton,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { buildDateFormatter } from '../../utils/helpers';
import { useIncrementalReveal } from '../../hooks/useIncrementalReveal';
import TimezoneDiscrepancyMessage from '../TimezoneDiscrepancyMessage';

const formatDate = buildDateFormatter();

const generateInProgressDocs = evidenceSubmissions => {
  return (evidenceSubmissions || [])
    .filter(es => es.uploadStatus !== 'FAILED' && es.uploadStatus !== 'SUCCESS')
    .map(es => ({
      ...es,
      uploadStatusDisplayValue: 'SUBMISSION IN PROGRESS',
    }));
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
      <h3 className="vads-u-margin-top--0 vads-u-margin-bottom--3">
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
            {numSupportingDocuments === 0 ? (
              <p>You don’t have any file submissions in progress.</p>
            ) : (
              <p>We’ve received all the files you’ve uploaded.</p>
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
                const requestTypeText = item.trackedItemDisplayName
                  ? `Request type: ${item.trackedItemDisplayName}`
                  : 'You submitted this file as additional evidence.';

                return (
                  <li key={item.id || itemIndex}>
                    <VaCard
                      className="vads-u-margin-y--3"
                      data-testid={`file-in-progress-card-${itemIndex}`}
                    >
                      {statusBadgeText && (
                        <div className="file-status-badge vads-u-margin-bottom--2">
                          <span className="vads-u-visibility--screen-reader">
                            Status
                          </span>
                          <span className="usa-label vads-u-padding-x--1">
                            {statusBadgeText}
                          </span>
                        </div>
                      )}
                      <h4
                        className="filename-title vads-u-margin-top--0 vads-u-margin-bottom--2"
                        data-dd-privacy="mask"
                        data-dd-action-name="document filename"
                        ref={el => {
                          headingRefs.current[itemIndex] = el;
                        }}
                        tabIndex="-1"
                      >
                        {item.fileName || 'File name unknown'}
                      </h4>
                      <div className="vads-u-margin-bottom--2">
                        {item.documentType && (
                          <p className="vads-u-margin-y--0">
                            {`Document type: ${item.documentType}`}
                          </p>
                        )}
                        <p className="vads-u-margin-y--0">{requestTypeText}</p>
                      </div>
                      {item.createdAt && (
                        <p className="file-submitted-date vads-u-margin-y--0">
                          {`Submitted on ${formatDate(item.createdAt)}`}
                        </p>
                      )}
                    </VaCard>
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
