import React from 'react';
import { Link } from 'react-router-dom-v5-compat';
import PropTypes from 'prop-types';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles';

import {
  truncateDescription,
  isAutomated5103Notice,
  buildDateFormatter,
} from '../../utils/helpers';
import { standard5103Item } from '../../constants';
import DueDate from '../DueDate';

export default function FilesNeeded({ item, previousPage = null }) {
  const { TOGGLE_NAMES, useToggleValue } = useFeatureToggle();
  const cst5103UpdateEnabled = useToggleValue(
    TOGGLE_NAMES.cst5103UpdateEnabled,
  );
  const cstFriendlyEvidenceRequests = useToggleValue(
    TOGGLE_NAMES.cstFriendlyEvidenceRequests,
  );
  // We will not use the truncateDescription() here as these descriptions are custom and specific to what we want
  // the user to see based on the given item type.
  const itemsWithNewDescriptions = [
    {
      type: 'Automated 5103 Notice Response',
      description: standard5103Item.description,
    },
  ];

  const getItemDisplayName = () => {
    let { displayName } = item;

    if (isAutomated5103Notice(item.displayName) && cst5103UpdateEnabled) {
      displayName = standard5103Item.displayName;
    }
    return displayName;
  };

  const getItemDescription = () => {
    const itemWithNewDescription = itemsWithNewDescriptions.find(
      i => i.type === item.displayName,
    );
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
      {!isAutomated5103Notice(item.displayName) &&
        !cstFriendlyEvidenceRequests && <DueDate date={item.suspenseDate} />}
      {cstFriendlyEvidenceRequests && (
        <p className="vads-u-font-size--h3">Respond by {formattedDueDate}</p>
      )}

      <span className="alert-description">{getItemDescription()}</span>
      <div className="link-action-container">
        <Link
          aria-label={`Details for ${item.displayName}`}
          title={`Details for ${item.displayName}`}
          className="vads-c-action-link--blue"
          to={`../document-request/${item.id}`}
          onClick={() => {
            if (previousPage !== null) {
              sessionStorage.setItem('previousPage', previousPage);
            }
          }}
        >
          {cstFriendlyEvidenceRequests ? 'About this request' : 'Details'}
        </Link>
      </div>
    </va-alert>
  );
}

FilesNeeded.propTypes = {
  item: PropTypes.object.isRequired,
  previousPage: PropTypes.string,
};
