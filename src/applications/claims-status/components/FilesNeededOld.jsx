import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';
import { getTrackedItemId, truncateDescription } from '../utils/helpers';
import DueDateOld from './DueDateOld';

function FilesNeededOld({ id, item }) {
  return (
    <div className="file-request-list-item usa-alert usa-alert-warning background-color-only alert-with-details">
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
          to={`your-claims/${id}/document-request/${getTrackedItemId(item)}`}
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

FilesNeededOld.propTypes = {
  id: PropTypes.string.isRequired,
  item: PropTypes.object.isRequired,
};

export default FilesNeededOld;
