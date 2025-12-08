import PropTypes from 'prop-types';
import React from 'react';
import {
  VaCard,
  VaButton,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import {
  buildDateFormatter,
  getTrackedItemDisplayFromSupportingDocument,
} from '../../utils/helpers';
import { useIncrementalReveal } from '../../hooks/useIncrementalReveal';
import { ANCHOR_LINKS } from '../../constants';

const NEED_ITEMS_STATUS = 'NEEDED_FROM_';

const formatDate = buildDateFormatter();

const getTrackedItemText = item => {
  if (item.status === 'INITIAL_REVIEW_COMPLETE' || item.status === 'ACCEPTED') {
    return `Reviewed by VA on ${formatDate(item.receivedDate)}`;
  }
  if (item.status === 'NO_LONGER_REQUIRED' && item.closedDate !== null) {
    return 'No longer needed';
  }
  if (item.status === 'SUBMITTED_AWAITING_REVIEW') {
    return 'Pending review';
  }
  return null;
};

const generateDocsFiled = docsFiled => {
  return docsFiled.flatMap(document => {
    if (document.id && document.status) {
      const requestTypeDisplayName = getTrackedItemDisplayFromSupportingDocument(
        document,
      );
      const requestTypeText =
        document.status === 'NO_LONGER_REQUIRED'
          ? `We received this file for a closed evidence request (${requestTypeDisplayName}).`
          : `Request type: ${requestTypeDisplayName}`;

      // If tracked item has no documents, return single item
      if (document.documents.length === 0) {
        return {
          requestTypeText,
          documents: [],
          text: getTrackedItemText(document),
          date: document.date,
          type: 'tracked_item',
        };
      }
      // Split tracked item into separate items for each document
      return document.documents.map(doc => ({
        requestTypeText,
        documents: [doc],
        text: getTrackedItemText(document),
        date: doc.uploadDate || document.date,
        type: 'tracked_item',
      }));
    }
    return {
      requestTypeText: 'You submitted this file as additional evidence.',
      documents: [
        {
          originalFileName: document.originalFileName,
          documentTypeLabel: document.documentTypeLabel,
          uploadDate: document.date,
        },
      ],
      text: null,
      date: document.date,
      type: 'additional_evidence_item',
    };
  });
};

const getSortedItems = itemsFiled => {
  // Get items from trackedItems and additionalEvidence
  const items = generateDocsFiled(itemsFiled);

  return items.sort((item1, item2) => {
    return new Date(item2.date) - new Date(item1.date);
  });
};

const getStatusBadgeText = item => {
  if (item.type === 'additional_evidence_item') {
    return 'On File';
  }
  if (item.text) {
    if (item.text.includes('Reviewed')) {
      return 'Reviewed by VA';
    }
    if (item.text === 'No longer needed') {
      return 'On File';
    }
    return item.text;
  }
  return null;
};

const FilesReceived = ({ claim }) => {
  const { supportingDocuments, trackedItems } = claim.attributes;

  // Get itemsFiled from trackedItems and supportingDocuments
  const itemsFiled = trackedItems.filter(
    item => !item.status.startsWith(NEED_ITEMS_STATUS),
  );
  itemsFiled.push(...supportingDocuments);

  const allItems = getSortedItems(itemsFiled);

  const {
    currentPageItems,
    shouldShowButton,
    nextBatchSize,
    onShowMoreClicked,
    headingRefs,
  } = useIncrementalReveal(allItems);

  return (
    <div className="files-received-container" data-testid="files-received">
      <h3
        id={ANCHOR_LINKS.filesReceived}
        className="vads-u-margin-top--0 vads-u-margin-bottom--3"
      >
        Files received
      </h3>
      <p>
        Files we received after you submitted them using this tool or the VA:
        Health and Benefits mobile app. Files submitted by mail or in person, by
        you or by others, don’t appear in this tool.
      </p>
      <div data-testid="files-received-cards">
        {currentPageItems.length === 0 ? (
          <div>
            <p>We haven’t received any files yet.</p>
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
                const statusBadgeText = getStatusBadgeText(item);
                return (
                  <li key={itemIndex}>
                    <VaCard
                      key={itemIndex}
                      className="vads-u-margin-y--3"
                      data-testid={`file-received-card-${itemIndex}`}
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
                      {item.documents.length === 0 ? (
                        <>
                          <h4
                            className="filename-title vads-u-margin-top--0 vads-u-margin-bottom--2"
                            ref={el => {
                              headingRefs.current[itemIndex] = el;
                            }}
                            tabIndex="-1"
                          >
                            File name unknown
                          </h4>
                          <div className="vads-u-margin-bottom--2">
                            <p className="vads-u-margin--0">
                              {item.requestTypeText}
                            </p>
                          </div>
                          {item.date !== null && (
                            <p className="file-received-date vads-u-margin--0">
                              {`Received on ${formatDate(item.date)}`}
                            </p>
                          )}
                        </>
                      ) : (
                        item.documents.map((doc, index) => (
                          <div key={index}>
                            <h4
                              className="filename-title vads-u-margin-top--0 vads-u-margin-bottom--2"
                              data-dd-privacy="mask"
                              data-dd-action-name="document filename"
                              ref={el => {
                                headingRefs.current[itemIndex] = el;
                              }}
                              tabIndex="-1"
                            >
                              {doc.originalFileName
                                ? doc.originalFileName
                                : 'File name unknown'}
                            </h4>
                            <div className="vads-u-margin-bottom--2">
                              <p className="vads-u-margin-y--0">
                                {`Document type: ${doc.documentTypeLabel}`}
                              </p>
                              <p className="vads-u-margin-y--0">
                                {item.requestTypeText}
                              </p>
                            </div>
                            {(doc.uploadDate || item.date) && (
                              <p className="file-received-date vads-u-margin-y--0">
                                {`Received on ${formatDate(
                                  doc.uploadDate || item.date,
                                )}`}
                              </p>
                            )}
                          </div>
                        ))
                      )}
                      {item.text &&
                        item.text.includes('Reviewed') && (
                          <p className="vads-u-margin-y--0">{item.text}</p>
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
                  text={`Show more received (${nextBatchSize})`}
                  data-testid="show-more-button"
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

FilesReceived.propTypes = {
  claim: PropTypes.object.isRequired,
};

export default FilesReceived;
