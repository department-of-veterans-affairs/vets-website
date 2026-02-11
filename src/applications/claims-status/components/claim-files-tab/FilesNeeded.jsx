import React from 'react';
import { useNavigate } from 'react-router-dom-v5-compat';
import { VaCriticalAction } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';

import {
  truncateDescription,
  isAutomated5103Notice,
  buildDateFormatter,
  getDisplayFriendlyName,
} from '../../utils/helpers';
import { standard5103Item } from '../../constants';
import { evidenceDictionary } from '../../utils/evidenceDictionary';

export default function FilesNeeded({ claimId, item, previousPage = null }) {
  // useNavigate for client-side routing (avoids full page reload with VaCriticalAction).
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
    // Use API boolean properties with fallback to evidenceDictionary
    const isSensitive =
      item.isSensitive ??
      evidenceDictionary[item.displayName]?.isSensitive ??
      false;
    const noProvidePrefix =
      item.noProvidePrefix ??
      evidenceDictionary[item.displayName]?.noProvidePrefix ??
      false;

    if (isSensitive) {
      return `Request for evidence`;
    }
    if (noProvidePrefix) {
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
    <>
      <va-card data-testid={`item-${item.id}`} class="vads-u-margin-bottom--2">
        <h4 className="vads-u-margin-top--0 vads-u-font-size--h3">
          {getItemDisplayName()}
        </h4>
        <p className="vads-u-margin-y--1">{getItemDescription()}</p>
        <VaCriticalAction
          link={`/track-claims/your-claims/${claimId}/needed-from-you/${
            item.id
          }`}
          text={`Requested by ${formattedDueDate}`}
          onClick={e => {
            e.preventDefault();
            if (previousPage !== null) {
              sessionStorage.setItem('previousPage', previousPage);
            }
            navigate(`/your-claims/${claimId}/needed-from-you/${item.id}`);
          }}
        />
      </va-card>
    </>
  );
}

FilesNeeded.propTypes = {
  claimId: PropTypes.string.isRequired,
  item: PropTypes.object.isRequired,
  previousPage: PropTypes.string,
};
