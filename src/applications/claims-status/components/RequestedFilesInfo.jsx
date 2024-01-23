import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';

import AdditionalEvidencePageOld from '../containers/AdditionalEvidencePageOld';
import { getTrackedItemId, truncateDescription } from '../utils/helpers';
import DueDate from './DueDate';
import FilesOptionalOld from './FilesOptionalOld';

export default function RequestedFilesInfo({ id, filesNeeded, optionalFiles }) {
  return (
    <div className="claims-requested-files-container">
      <div className="file-request-list">
        <h2 className="claim-file-border">File requests</h2>

        {filesNeeded.length + optionalFiles.length === 0 ? (
          <div className="no-documents">
            <p>You don’t need to turn in any documents to VA.</p>
          </div>
        ) : null}

        {filesNeeded.map(item => (
          <div
            className="file-request-list-item usa-alert usa-alert-warning background-color-only alert-with-details"
            key={getTrackedItemId(item)}
          >
            <div className="item-container">
              <h3 className="file-request-title">{item.displayName}</h3>
              <p className="submission-description">
                {truncateDescription(item.description)}
              </p>
              <DueDate date={item.suspenseDate} />
            </div>
            <div className="button-container">
              <Link
                aria-label={`View Details for ${item.displayName}`}
                title={`View Details for ${item.displayName}`}
                className="usa-button usa-button-secondary view-details-button"
                to={`your-claims/${id}/document-request/${getTrackedItemId(
                  item,
                )}`}
              >
                View Details
              </Link>
            </div>
          </div>
        ))}

        {optionalFiles.map(item => (
          <FilesOptionalOld key={getTrackedItemId(item)} id={id} item={item} />
        ))}
      </div>

      <div className="submit-file-container">
        <div className="submit-additional-evidence">
          <h2 className="claim-file-border">Additional evidence</h2>
          <AdditionalEvidencePageOld />
        </div>
      </div>
    </div>
  );
}

RequestedFilesInfo.propTypes = {
  filesNeeded: PropTypes.array.isRequired,
  id: PropTypes.string.isRequired,
  optionalFiles: PropTypes.array.isRequired,
};
