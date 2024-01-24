import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';
import { getTrackedItemId, truncateDescription } from '../utils/helpers';

function FilesOptional({ id, item }) {
  return (
    <va-alert
      class="optional-alert vads-u-margin-bottom--2"
      status="default"
      uswds
    >
      <div className="item-container">
        <h2 className="alert-title">{item.displayName}</h2>
        <p className="alert-description">
          {truncateDescription(item.description)}
          <div className="call-to-action">
            You don't have to do anything, but if you have this information you
            can&nbsp;
            <Link
              aria-label={`Add information for ${item.displayName}`}
              className="add-your-claims-link"
              to={`your-claims/${id}/document-request/${getTrackedItemId(
                item,
              )}`}
            >
              add it here.
            </Link>
          </div>
        </p>
      </div>
    </va-alert>
  );
}

FilesOptional.propTypes = {
  id: PropTypes.string.isRequired,
  item: PropTypes.object.isRequired,
};

export default FilesOptional;
