import React from 'react';
import { Link } from 'react-router-dom-v5-compat';
import PropTypes from 'prop-types';

import { truncateDescription } from '../../utils/helpers';
import DueDate from '../DueDate';

function FilesNeeded({ item }) {
  return (
    <va-alert class="primary-alert vads-u-margin-bottom--2" status="warning">
      <h4 slot="headline" className="alert-title">
        {item.displayName}
      </h4>
      <DueDate date={item.suspenseDate} />
      <p className="alert-description">
        {truncateDescription(item.description, 200)}
      </p>
      <div className="link-action-container">
        <Link
          aria-label={`Details for ${item.displayName}`}
          title={`Details for ${item.displayName}`}
          className="vads-c-action-link--blue"
          to={`../document-request/${item.id}`}
        >
          Details
        </Link>
      </div>
    </va-alert>
  );
}

FilesNeeded.propTypes = {
  item: PropTypes.object.isRequired,
};

export default FilesNeeded;
