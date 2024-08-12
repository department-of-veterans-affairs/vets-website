import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom-v5-compat';

import { truncateDescription } from '../utils/helpers';
import DueDateOld from './DueDateOld';

function FilesNeededOld({ item }) {
  return (
    <div
      data-testid={`item-${item.id}`}
      className="file-request-list-item usa-alert usa-alert-warning background-color-only alert-with-details"
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
          to={`../document-request/${item.id}`}
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

FilesNeededOld.propTypes = {
  item: PropTypes.object.isRequired,
};

export default FilesNeededOld;
