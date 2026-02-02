import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom-v5-compat';

import {
  buildDateFormatter,
  renderDefaultThirdPartyMessage,
  renderOverrideThirdPartyMessage,
  getIsDBQ,
} from '../../utils/helpers';

function FilesOptional({ item }) {
  const dateFormatter = buildDateFormatter();
  const isDBQ = getIsDBQ(item);

  const getRequestText = () => {
    const formattedDate = dateFormatter(item.requestedDate);
    if (isDBQ) {
      return `We made a request for an exam on ${formattedDate}`;
    }
    return `We made a request outside VA on ${formattedDate}`;
  };
  const getItemDisplayName = () => {
    if (isDBQ) {
      return 'Request for an exam';
    }
    if (item.friendlyName) {
      return item.friendlyName;
    }
    return 'Request for evidence outside VA';
  };
  return (
    <va-alert class="optional-alert vads-u-margin-bottom--2" status="info">
      <h4 slot="headline" className="alert-title">
        {getItemDisplayName()}
      </h4>
      <p>{getRequestText()}</p>
      <p className="alert-description">
        {item.shortDescription || item.activityDescription
          ? renderOverrideThirdPartyMessage(item)
          : renderDefaultThirdPartyMessage(item.displayName)}
      </p>
      <div className="call-to-action">
        <Link
          aria-label={`About this notice for ${item.friendlyName ||
            item.displayName}`}
          className="add-your-claims-link"
          to={`../needed-from-others/${item.id}`}
        >
          About this notice
        </Link>
      </div>
    </va-alert>
  );
}

FilesOptional.propTypes = {
  item: PropTypes.object.isRequired,
};

export default FilesOptional;
