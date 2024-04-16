import React from 'react';
import { Link } from 'react-router-dom-v5-compat';
import PropTypes from 'prop-types';

import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';

import { truncateDescription } from '../../utils/helpers';
import DueDate from '../DueDate';

const clickHandler = href => {
  recordEvent({
    event: 'claim-details-files-needed-link',
    'gtm.element.textContent': 'Claim Details Files Needed link',
    'gtm.elementUrl': environment.API_URL + href,
  });
};

function FilesNeeded({ item }) {
  const href = `../document-request/${item.id}`;

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
          aria-label={`View details for ${item.displayName}`}
          title={`View details for ${item.displayName}`}
          className="vads-c-action-link--blue"
          to={href}
          onClick={() => {
            clickHandler(href);
          }}
        >
          View details
        </Link>
      </div>
    </va-alert>
  );
}

FilesNeeded.propTypes = {
  item: PropTypes.object.isRequired,
};

export default FilesNeeded;
