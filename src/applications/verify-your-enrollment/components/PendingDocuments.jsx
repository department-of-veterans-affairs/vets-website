import React from 'react';
import PropTypes from 'prop-types';
import { getPendingDocumentDescription } from '../helpers';
import {
  PENDING_DOCUMENTS_TITLE,
  PENDING_DOCUMENTS_STATEMENT,
  NO_PENDING_DOCUMENTS_STATMENT,
} from '../constants/index';

const PendingDocuments = ({ loading, pendingDocuments }) => {
  const handlePendingDocuments = () => {
    const documentInfo = getPendingDocumentDescription(
      pendingDocuments[0]?.docType,
    );
    if (documentInfo.documentDisplayName === undefined) {
      return NO_PENDING_DOCUMENTS_STATMENT;
    }
    return (
      <>
        {PENDING_DOCUMENTS_STATEMENT}
        <span className="vads-u-font-weight--bold">
          {documentInfo?.documentDisplayName}
        </span>
        {documentInfo?.documentExplanation}
      </>
    );
  };

  return (
    <div id="vye-pending-documents">
      <p className="vads-u-font-size--h2 vads-u-font-family--serif vads-u-font-weight--bold">
        {PENDING_DOCUMENTS_TITLE}
      </p>
      {/* {PENDING_DOCUMENTS_STATEMENT} */}
      <div
        className="vads-u-border-color--gray-lighter
            vads-u-color-gray-dark
            vads-u-display--flex
            vads-u-flex-direction--column
            vads-u-padding-x--2
            vads-u-padding-y--1p5
            medium-screen:vads-u-padding--4
            vads-u-border--1px"
      >
        {loading && (
          <va-loading-indicator
            label="Loading"
            message="Loading Pending Documents..."
          />
        )}
        {!loading && pendingDocuments?.length > 0 && handlePendingDocuments()}
        {!loading &&
          !pendingDocuments?.length > 0 &&
          NO_PENDING_DOCUMENTS_STATMENT}
      </div>
    </div>
  );
};

PendingDocuments.propTypes = {
  loading: PropTypes.bool,
  pendingDocuments: PropTypes.array,
};

export default PendingDocuments;
