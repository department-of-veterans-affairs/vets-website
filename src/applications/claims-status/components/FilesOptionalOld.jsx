import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom-v5-compat';

import { truncateDescription } from '../utils/helpers';

export default function FilesOptionalOld({ item }) {
  return (
    <div className="file-request-list-item usa-alert file-request-list-item-optional background-color-only alert-with-details">
      <div className="item-container">
        <h3 className="file-request-title">{item.displayName}</h3>
        <p className="submission-description">
          {truncateDescription(item.description)}
        </p>
        <div className="vads-u-margin-top--0p5 vads-u-font-size--sm">
          <strong>Optional</strong> - We requested this from others, but upload
          it if you have it.
        </div>
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

FilesOptionalOld.propTypes = {
  item: PropTypes.object.isRequired,
};
