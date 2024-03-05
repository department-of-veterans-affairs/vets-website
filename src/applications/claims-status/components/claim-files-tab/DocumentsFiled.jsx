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
        requestType: document.displayName,
        documents: document.documents,
        text: getTrackedItemText(document),
        date: document.date,
        type: 'tracked_item',
      };
    }
    return {
      requestType: 'Additional evidence',
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

const noLongerNeeded = text => {
  return text?.includes('No longer needed');
};

const pendingReview = text => {
  return text?.includes('Pending review');
};
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
                      <h4 className="vads-u-margin-y--0">Unknown file name</h4>
                      <p className="vads-u-margin-top--0p5 vads-u-margin-bottom--0">
                        {`Request type: ${item.requestType}`}
                      </p>
                      <p className="vads-u-margin-top--0p5 vads-u-margin-bottom--2">
                        {`Received on ${formatDate(item.date)}`}
                      </p>
                    </>
                  ) : (
                    item.documents.map((doc, index) => (
                      <div key={index}>
                        <h4 className="vads-u-margin-y--0">
                          {doc.originalFileName
                            ? doc.originalFileName
                            : 'Unknown file name'}
                        </h4>
                        <p className="vads-u-margin-top--0p5 vads-u-margin-bottom--0">
                          {`Request type: ${item.requestType}`}
                        </p>
                        <p className="vads-u-margin-top--0p5 vads-u-margin-bottom--0">
                          {`Document type: ${doc.documentTypeLabel}`}
                        </p>
                        {doc.uploadDate !== null && (
                          <p className="vads-u-margin-top--0p5 vads-u-margin-bottom--2">
                            {`Received on ${formatDate(doc.uploadDate)}`}
                          </p>
                        )}
                        {doc.uploadDate === null &&
                          item.date !== null && (
                            <p className="vads-u-margin-top--0p5 vads-u-margin-bottom--2">
                              {`Received on ${formatDate(item.date)}`}
                            </p>
                          )}
                      </div>
                    ))
                  )}
                  {reviewed(item.text) && (
                    <div>
                      <i className="fa fa-check-circle submission-icon" />
                      <span className="docs-filed-text vads-u-margin-top--0p5 vads-u-margin-bottom--1">
                        {item.text}
                      </span>
                    </div>
                  )}
                  {noLongerNeeded(item.text) ||
                    (pendingReview(item.text) && (
                      <div>
                        <p className=" docs-filed-text vads-u-margin-top--0p5 vads-u-margin-bottom--1">
                          {item.text}
                        </p>
                      </div>
                    ))}
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
