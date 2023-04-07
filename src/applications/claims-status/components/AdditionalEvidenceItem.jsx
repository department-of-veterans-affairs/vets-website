import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';

export default function AdditionalEvidenceItem({ item }) {
  const itemDate = item.uploadDate;

  return (
    <div className="submitted-file-list-item">
      <h3 className="vads-u-padding-bottom--0 vads-u-margin-bottom--0 submission-file-type additional-evidence">
        Additional evidence
      </h3>
      <p className="submission-description">
        <span className="claim-item-label">File:</span> {item.originalFileName}
        <br />
        <span className="claim-item-label">Type:</span> {item.documentTypeLabel}
      </p>
      <div>
        <strong className="submission-status">Submitted:</strong>
        {!!itemDate && (
          <span className="submission-date">
            {moment(itemDate).format('MMM D, YYYY')}
          </span>
        )}
      </div>
    </div>
  );
}

AdditionalEvidenceItem.propTypes = {
  item: PropTypes.object.isRequired,
};
