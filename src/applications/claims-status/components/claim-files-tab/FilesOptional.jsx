import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom-v5-compat';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles';

import { truncateDescription, buildDateFormatter } from '../../utils/helpers';

function FilesOptional({ item }) {
  const { TOGGLE_NAMES, useToggleValue } = useFeatureToggle();

  const cstFriendlyEvidenceRequests = useToggleValue(
    TOGGLE_NAMES.cstFriendlyEvidenceRequests,
  );
  const dateFormatter = buildDateFormatter();
  return (
    <va-alert class="optional-alert vads-u-margin-bottom--2" status="info">
      <h4 slot="headline" className="alert-title">
        {cstFriendlyEvidenceRequests && item.friendlyName
          ? item.friendlyName
          : item.displayName}
      </h4>
      <p>
        {cstFriendlyEvidenceRequests
          ? `Requested from outside VA on ${dateFormatter(item.requestedDate)}`
          : `Requested to others on ${dateFormatter(item.requestedDate)}`}
      </p>
      <p className="alert-description">
        {cstFriendlyEvidenceRequests &&
          (item.shortDescription || item.activityDescription ? (
            item.shortDescription || item.activityDescription
          ) : (
            <>
              <strong>You don’t have to do anything.</strong> We asked someone
              outside VA for documents related to your claim.
              <br />
            </>
          ))}
      </p>
      {!cstFriendlyEvidenceRequests && (
        <p className="alert-description">
          {truncateDescription(item.description)}
        </p>
      )}

      {cstFriendlyEvidenceRequests ? (
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
      ) : (
        <div className="call-to-action vads-u-padding-top--2">
          You don’t have to do anything, but if you have this information you
          can{' '}
          <Link
            aria-label={`Add it here for ${item.displayName}`}
            className="add-your-claims-link"
            to={`../document-request/${item.id}`}
          >
            add it here.
          </Link>
        </div>
      )}
    </va-alert>
  );
}

FilesOptional.propTypes = {
  item: PropTypes.object.isRequired,
};

export default FilesOptional;
