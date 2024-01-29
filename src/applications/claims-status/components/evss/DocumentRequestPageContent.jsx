import React from 'react';
import PropTypes from 'prop-types';

import DueDateOld from '../DueDateOld';

export default function DocumentRequestPageContent({ trackedItem }) {
  return (
    <>
      <h1 className="claims-header">{trackedItem.displayName}</h1>
      {trackedItem.type.endsWith('you_list') ? (
        <DueDateOld date={trackedItem.suspenseDate} />
      ) : null}
      {trackedItem.type.endsWith('others_list') ? (
        <div className="optional-upload">
          <p>
            <strong>Optional</strong> - We’ve asked others to send this to us,
            but you may upload it if you have it.
          </p>
        </div>
      ) : null}
      <p>{trackedItem.description}</p>
    </>
  );
}

DocumentRequestPageContent.propTypes = {
  trackedItem: PropTypes.object,
};
