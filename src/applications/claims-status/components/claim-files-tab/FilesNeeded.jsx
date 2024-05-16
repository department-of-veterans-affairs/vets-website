import React from 'react';
import { Link } from 'react-router-dom-v5-compat';
import PropTypes from 'prop-types';

import { truncateDescription } from '../../utils/helpers';
import DueDate from '../DueDate';

function FilesNeeded({ item }) {
  // We will not use the truncateDescription() here as these descriptions are custom and specific to what we want
  // the user to see based on the given item type.
  const itemsWithNewDescriptions = [
    {
      type: 'Automated 5103 Notice Response',
      description: (
        <>
          <p>
            We sent you a "5103 notice" letter that lists the types of evidence
            we may need to decide your claim.
          </p>
          <p>
            Upload the waiver attached to letter if you’re finished adding
            evidence.
          </p>
        </>
      ),
    },
  ];

  const getItemDescription = () => {
    const itemWithNewDescription = itemsWithNewDescriptions.find(
      i => i.type === item.displayName,
    );
    return itemWithNewDescription !== undefined
      ? itemWithNewDescription.description
      : truncateDescription(item.description); // Truncating the item description to only 200 characters incase it is long
  };

  // Hide the due date when item type is Automated 5103 Notice Response
  const hideDueDate = item.displayName === 'Automated 5103 Notice Response';

  return (
    <va-alert class="primary-alert vads-u-margin-bottom--2" status="warning">
      <h4 slot="headline" className="alert-title">
        {item.displayName}
      </h4>
      {!hideDueDate && <DueDate date={item.suspenseDate} />}
      <p className="alert-description">{getItemDescription()}</p>
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
