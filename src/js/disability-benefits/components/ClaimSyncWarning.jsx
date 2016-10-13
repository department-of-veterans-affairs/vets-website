import React from 'react';
import moment from 'moment';

export default function ClaimSyncWarning({ syncedDate }) {
  const updatedDate = moment(syncedDate).format('MMM D, YYYY');

  return (
    <div className="va-action-bar--header disability-claims-warning">
      <div className="row">
        <div className="columns small-12">
          Our system is temporarily down. This is an older version of your claim status from {updatedDate} and may be outdated. Try refreshing this page to see the latest updates.
        </div>
      </div>
    </div>
  );
}

ClaimSyncWarning.propTypes = {
  syncedDate: React.PropTypes.string.isRequired
};

