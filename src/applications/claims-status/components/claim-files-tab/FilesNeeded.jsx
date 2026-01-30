import React from 'react';
import { useNavigate } from 'react-router-dom-v5-compat';
import { VaLinkAction } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';

import {
  truncateDescription,
  isAutomated5103Notice,
  buildDateFormatter,
  getDisplayFriendlyName,
  getIsSensitive,
  getNoProvidePrefix,
} from '../../utils/helpers';
import { standard5103Item } from '../../constants';

export default function FilesNeeded({ claimId, item, previousPage = null }) {
  // useNavigate for client-side routing (avoids full page reload with VaLinkAction).
  // This is how 'to=""' worked in the previous version of this component.
  const navigate = useNavigate();
  // We will not use the truncateDescription() here as these descriptions are custom and specific to what we want
  // the user to see based on the given item type.
  const itemsWithNewDescriptions = [
    {
      type: 'Automated 5103 Notice Response',
      description: standard5103Item.description,
    },
  ];

  const getItemDisplayName = () => {
    if (isAutomated5103Notice(item.displayName)) {
      return standard5103Item.displayName;
    }
    if (getIsSensitive(item)) {
      return `Request for evidence`;
    }
    if (getNoProvidePrefix(item)) {
      return item.friendlyName;
    }
    if (item.friendlyName) {
      return `Provide ${getDisplayFriendlyName(item)}`;
    }
    return 'Request for evidence';
  };

  const getItemDescription = () => {
    const itemWithNewDescription = itemsWithNewDescriptions.find(
      i => i.type === item.displayName,
    );
    if (item.shortDescription || item.activityDescription) {
      return item.shortDescription || item.activityDescription;
    }
    return itemWithNewDescription !== undefined
      ? itemWithNewDescription.description
      : truncateDescription(item.description); // Truncating the item description to only 200 characters incase it is long
  };
  const formattedDueDate = buildDateFormatter()(item.suspenseDate);
  return (
    <va-alert
      data-testid={`item-${item.id}`}
      class="primary-alert vads-u-margin-bottom--2"
      status="warning"
    >
      <h4 slot="headline" className="alert-title">
        {getItemDisplayName()}
      </h4>

      <p>Respond by {formattedDueDate}</p>

      <span className="alert-description">{getItemDescription()}</span>
      <div className="link-action-container">
        <VaLinkAction
          aria-label={`About this request for ${item.friendlyName ||
            item.displayName}`}
          href={`/track-claims/your-claims/${claimId}/needed-from-you/${
            item.id
          }`}
          onClick={e => {
            // Prevent full page reload, use React Router instead
            e.preventDefault();

            if (previousPage !== null) {
              sessionStorage.setItem('previousPage', previousPage);
            }

            navigate(`/your-claims/${claimId}/needed-from-you/${item.id}`);
          }}
          text="About this request"
          type="secondary"
        />
      </div>
    </va-alert>
  );
}

FilesNeeded.propTypes = {
  claimId: PropTypes.string.isRequired,
  item: PropTypes.object.isRequired,
  previousPage: PropTypes.string,
};
