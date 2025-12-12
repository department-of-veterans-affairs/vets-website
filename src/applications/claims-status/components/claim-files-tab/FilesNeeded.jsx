import React from 'react';
import { VaLinkAction } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';

import {
  truncateDescription,
  isAutomated5103Notice,
  buildDateFormatter,
  getDisplayFriendlyName,
} from '../../utils/helpers';
import { standard5103Item } from '../../constants';
import { evidenceDictionary } from '../../utils/evidenceDictionary';

export default function FilesNeeded({ id, item, previousPage = null }) {
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
    if (evidenceDictionary[item.displayName]?.isSensitive) {
      return `Request for evidence`;
    }
    if (evidenceDictionary[item.displayName]?.noProvidePrefix) {
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
          className="vads-c-action-link--blue"
          href={`/track-claims/your-claims/${id}/needed-from-you/${item.id}`}
          onClick={() => {
            if (previousPage !== null) {
              sessionStorage.setItem('previousPage', previousPage);
            }
          }}
          text="About this request"
        />
      </div>
    </va-alert>
  );
}

FilesNeeded.propTypes = {
  id: PropTypes.string.isRequired,
  item: PropTypes.object.isRequired,
  previousPage: PropTypes.string,
};
