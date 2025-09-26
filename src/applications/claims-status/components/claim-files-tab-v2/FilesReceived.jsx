import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';

import { buildDateFormatter } from '../../utils/helpers';

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
  return docsFiled.map(document => {
    if (document.id && document.status) {
      return {
        requestTypeText: `Request type: ${document.displayName}`,
        documents: document.documents,
        text: getTrackedItemText(document),
        date:
          document.documents.length !== 0
            ? document.documents[0].uploadDate || document.date
            : document.date,
        type: 'tracked_item',
      };
    }
    return {
      requestTypeText: 'Additional evidence',
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
    return moment(item2.date) - moment(item1.date);
  });
};

const FilesReceived = ({ claim }) => {
  const { supportingDocuments, trackedItems } = claim.attributes;

  // Get itemsFiled from trackedItems and supportingDocuments
  const itemsFiled = trackedItems.filter(
    item => !item.status.startsWith(NEED_ITEMS_STATUS),
  );
  itemsFiled.push(...supportingDocuments);

  const currentPageItems = getSortedItems(itemsFiled);

  return (
    <div className="files-received-container" data-testid="files-received">
      <h3 className="vads-u-margin-top--0 vads-u-margin-bottom--3">
        Files received
      </h3>
      <p>
        Files we received after you submitted them using this tool or the VA
        Health and Benefits mobile app. Files submitted by mail or in person, by
        you or by others, don’t appear in this tool.
      </p>
      <div data-testid="files-received-cards">
        {currentPageItems.length === 0 ? (
          <div>
            <p>We haven’t received any files yet.</p>
          </div>
        ) : (
          <p>Placeholder for {currentPageItems.length} files received</p>
        )}
      </div>
    </div>
  );
};

FilesReceived.propTypes = {
  claim: PropTypes.object.isRequired,
};

export default FilesReceived;
