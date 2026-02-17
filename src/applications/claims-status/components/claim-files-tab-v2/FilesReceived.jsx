import PropTypes from 'prop-types';
import React from 'react';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import * as TrackedItem from '../../utils/trackedItemContent';
import { useIncrementalReveal } from '../../hooks/useIncrementalReveal';
import { ANCHOR_LINKS } from '../../constants';
import DocumentCard from '../DocumentCard';

const NEED_ITEMS_STATUS = 'NEEDED_FROM_';

const getTrackedItemText = item => {
  if (item.status === 'INITIAL_REVIEW_COMPLETE' || item.status === 'ACCEPTED') {
    return 'Reviewed by VA';
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
      const requestTypeDisplayName =
        TrackedItem.getTrackedItemDisplayFromSupportingDocument(document);
      const requestTypeText =
        document.status === 'NO_LONGER_REQUIRED'
          ? `We received this file for a closed evidence request: ${requestTypeDisplayName}`
          : `Submitted in response to request: ${requestTypeDisplayName}`;

      // If tracked item has no documents, return single item
      if (document.documents.length === 0) {
        return {
          requestTypeText,
          document: null,
          text: getTrackedItemText(document),
          date: document.date,
          type: 'tracked_item',
        };
      }
      // Split tracked item into separate items for each document
      return document.documents.map(doc => ({
        requestTypeText,
        document: doc,
        text: getTrackedItemText(document),
        date: doc.uploadDate || document.date,
        type: 'tracked_item',
      }));
    }
    return {
      requestTypeText: 'You submitted this file as additional evidence.',
      document: {
        originalFileName: document.originalFileName,
        documentTypeLabel: document.documentTypeLabel,
        uploadDate: document.date,
      },
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
                const { document } = item;
                const fileName = document?.originalFileName || null;
                const documentType = document?.documentTypeLabel || null;
                const date = document?.uploadDate || item.date;

                return (
                  <li key={itemIndex}>
                    <DocumentCard
                      index={itemIndex}
                      variant="received"
                      statusBadgeText={statusBadgeText}
                      headingRef={el => {
                        headingRefs.current[itemIndex] = el;
                      }}
                      fileName={fileName}
                      documentType={documentType}
                      requestTypeText={item.requestTypeText}
                      date={date}
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
