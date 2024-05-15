import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom-v5-compat';

import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';

import { truncateDescription } from '../../utils/helpers';

const clickHandler = href => {
  recordEvent({
    event: 'claim-details-files-optional-link',
    'gtm.element.textContent': 'Claim Details Files Optional link',
    'gtm.elementUrl': environment.API_URL + href,
  });
};

function FilesOptional({ item }) {
  const href = `../document-request/${item.id}`;
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
          to={href}
          onClick={() => {
            clickHandler(href);
          }}
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
