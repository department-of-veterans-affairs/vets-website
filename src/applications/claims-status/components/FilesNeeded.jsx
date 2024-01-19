import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';
import { getTrackedItemId, truncateDescription } from '../utils/helpers';
import DueDate from './DueDate';

function FilesNeeded({ id, item }) {
  return (
    <va-alert status="warning" slim uswds>
      <div className="item-container">
        <h3 className="file-request-title">{item.displayName}</h3>
        <DueDate date={item.suspenseDate} />
        <p className="submission-description">
          {truncateDescription(item.description, 200)}
        </p>
      </div>
      <div className="link-action-container">
        <Link
          aria-label={`View details for ${item.displayName}`}
          title={`View details for ${item.displayName}`}
          className="vads-c-action-link--blue"
          to={`your-claims/${id}/document-request/${getTrackedItemId(item)}`}
        >
          View details
        </Link>
      </div>
    </va-alert>
  );
}

FilesNeeded.propTypes = {
  id: PropTypes.string.isRequired,
  item: PropTypes.object.isRequired,
};

export default FilesNeeded;
