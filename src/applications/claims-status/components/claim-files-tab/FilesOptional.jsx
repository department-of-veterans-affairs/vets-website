import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom-v5-compat';

import { truncateDescription } from '../../utils/helpers';

function FilesOptional({ item }) {
  return (
    <va-alert class="optional-alert vads-u-margin-bottom--2" status="info">
      <h4 slot="headline" className="alert-title">
        {item.displayName}
      </h4>
      <p className="alert-description">
        {truncateDescription(item.description)}
      </p>
      <div className="call-to-action vads-u-padding-top--2">
        You don’t have to do anything, but if you have this information you can{' '}
        <Link
          aria-label={`Add information for ${item.displayName}`}
          className="add-your-claims-link"
          to={`../document-request/${item.id}`}
        >
          add it here.
        </Link>
      </div>
    </va-alert>
  );
}

FilesOptional.propTypes = {
  item: PropTypes.object.isRequired,
};

export default FilesOptional;
