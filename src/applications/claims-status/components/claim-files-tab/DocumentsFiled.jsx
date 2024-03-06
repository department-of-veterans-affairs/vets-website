import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import moment from 'moment';
import { buildDateFormatter } from '../../utils/helpers';
import { ITEMS_PER_PAGE } from '../../constants';

const NEED_ITEMS_STATUS = 'NEEDED_FROM_';

const formatDate = date => buildDateFormatter('MMMM d, yyyy')(date);

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
        date: document.date,
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

const reviewed = text => {
  return text?.includes('Reviewed');
};

const receivedDateExists = (uploadDate, itemDate) => {
  return uploadDate !== null || (uploadDate === null && itemDate !== null);
};

const docsFiledReceivedDate = itemText =>
  [
    'vads-u-margin-top--0p5',
    itemText ? 'vads-u-margin-bottom--2' : 'vads-u-margin-bottom--1',
  ].join(' ');

const docsFiledDocType = (uploadDate, itemDate) =>
  [
    'vads-u-margin-top--0p5',
    receivedDateExists(uploadDate, itemDate)
      ? 'vads-u-margin-bottom--0'
      : 'vads-u-margin-bottom--1',
  ].join(' ');

function DocumentsFiled({ claim }) {
  const { supportingDocuments, trackedItems } = claim.attributes;
  const [currentPage, setCurrentPage] = useState(1);

  // Get itemsFiled from trackedItems and supportingDocuments
  const itemsFiled = trackedItems.filter(
    item => !item.status.startsWith(NEED_ITEMS_STATUS),
  );
  itemsFiled.push(...supportingDocuments);

  const items = getSortedItems(itemsFiled);
  const pageLength = items.length;
  const numPages = Math.ceil(pageLength / ITEMS_PER_PAGE);
  const shouldPaginate = numPages > 1;

  let currentPageItems = items;

  if (shouldPaginate) {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = Math.min(currentPage * ITEMS_PER_PAGE, pageLength);
    currentPageItems = items.slice(start, end);
  }

  const onPageSelect = useCallback(
    selectedPage => {
      setCurrentPage(selectedPage);
    },
    [setCurrentPage],
  );

  return (
    <div className="documents-filed-container">
      <h3 className="vads-u-margin-top--0 vads-u-margin-bottom--3">
        Documents filed
      </h3>
      {currentPageItems.length === 0 ? (
        <div>
          <p>You haven’t turned in any documents to the VA.</p>
        </div>
      ) : (
        <>
          {pageLength > 0 && (
            <ol className="va-list-horizontal">
              {currentPageItems.map((item, itemIndex) => (
                <li
                  key={itemIndex}
                  className="vads-u-margin-bottom--2 vads-u-padding-bottom--1"
                >
                  {item.documents.length === 0 ? (
                    <>
                      <h4 className="vads-u-margin-y--0">File name unknown</h4>
                      <p className="vads-u-margin-top--0p5 vads-u-margin-bottom--0">
                        {item.requestTypeText}
                      </p>
                      {item.date !== null && (
                        <p className={docsFiledReceivedDate(item.text)}>
                          {`Received on ${formatDate(item.date)}`}
                        </p>
                      )}
                    </>
                  ) : (
                    item.documents.map((doc, index) => (
                      <div key={index}>
                        <h4 className="vads-u-margin-y--0">
                          {doc.originalFileName
                            ? doc.originalFileName
                            : 'File name unknown'}
                        </h4>
                        <p className="vads-u-margin-top--0p5 vads-u-margin-bottom--0">
                          {item.requestTypeText}
                        </p>
                        <p
                          className={docsFiledDocType(
                            doc.uploadDate,
                            item.date,
                          )}
                        >
                          {`Document type: ${doc.documentTypeLabel}`}
                        </p>
                        {doc.uploadDate !== null && (
                          <p className={docsFiledReceivedDate(item.text)}>
                            {`Received on ${formatDate(doc.uploadDate)}`}
                          </p>
                        )}
                        {doc.uploadDate === null &&
                          item.date !== null && (
                            <p className={docsFiledReceivedDate(item.text)}>
                              {`Received on ${formatDate(item.date)}`}
                            </p>
                          )}
                      </div>
                    ))
                  )}
                  {item.text && (
                    <div className="vads-u-margin-top--0 vads-u-margin-bottom--1">
                      {reviewed(item.text) && (
                        <i className="fa fa-check-circle docs-filed-icon" />
                      )}
                      <span className="docs-filed-text">{item.text}</span>
                    </div>
                  )}
                </li>
              ))}
            </ol>
          )}
          {shouldPaginate && (
            <VaPagination
              uswds
              className="vads-u-border--0"
              page={currentPage}
              pages={numPages}
              onPageSelect={e => onPageSelect(e.detail.page)}
            />
          )}
        </>
      )}
    </div>
  );
}

DocumentsFiled.propTypes = {
  claim: PropTypes.object,
};

export default DocumentsFiled;
