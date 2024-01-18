import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';

import AdditionalEvidencePage from '../containers/AdditionalEvidencePage';
import { getTrackedItemId, truncateDescription } from '../utils/helpers';
import DueDateOld from './DueDateOld';

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
              <DueDateOld date={item.suspenseDate} />
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
          <div
            className="file-request-list-item usa-alert file-request-list-item-optional background-color-only alert-with-details"
            key={getTrackedItemId(item)}
          >
            <div className="item-container">
              <h3 className="file-request-title">{item.displayName}</h3>
              <p className="submission-description">
                {truncateDescription(item.description)}
              </p>
              <div className="vads-u-margin-top--0p5 vads-u-font-size--sm">
                <strong>Optional</strong> - We requested this from others, but
                you may upload it if you have it.
              </div>
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
      </div>

      <div className="submit-file-container">
        <div className="submit-additional-evidence">
          <h2 className="claim-file-border">Additional evidence</h2>
          <AdditionalEvidencePage />
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
