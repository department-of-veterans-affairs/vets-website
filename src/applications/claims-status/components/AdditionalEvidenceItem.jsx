import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';

export default function AdditionalEvidenceItem({ item }) {
  const { documentTypeLabel, originalFileName, uploadDate } = item;

  return (
    <div className="submitted-file-list-item">
      <h3 className="vads-u-padding-bottom--0 vads-u-margin-bottom--0 submission-file-type additional-evidence">
        Additional evidence
      </h3>
      <p className="submission-description">
        <span className="claim-item-label">File:</span>{' '}
        <span
          className="filename"
          data-dd-privacy="mask"
          data-dd-action-name="filename"
        >
          {originalFileName}
        </span>
        <br />
        <span className="claim-item-label">Type:</span> {documentTypeLabel}
      </p>
      <div>
        <strong className="submission-status">Submitted:</strong>
        {!!uploadDate && (
          <span className="submission-date">
            {moment(uploadDate).format('MMM D, YYYY')}
          </span>
        )}
      </div>
    </div>
  );
}

AdditionalEvidenceItem.propTypes = {
  item: PropTypes.shape({
    documentTypeLabel: PropTypes.string,
    originalFileName: PropTypes.string,
    uploadDate: PropTypes.string,
  }).isRequired,
};
