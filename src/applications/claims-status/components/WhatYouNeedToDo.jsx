import PropTypes from 'prop-types';
import React from 'react';
import { getTrackedItemId } from '../utils/helpers';

import FilesNeeded from './FilesNeeded';

function WhatYouNeedToDo({ claim }) {
  const { trackedItems } = claim.attributes;

  const filesNeeded = trackedItems.filter(
    item => item.status === 'NEEDED_FROM_YOU',
  );

  const optionalFiles = trackedItems.filter(
    item => item.status === 'NEEDED_FROM_OTHERS',
  );

  return (
    <div className="what-you-need-to-do-container">
      <h3 className="claim-status-subheader">What you need to do</h3>
      {filesNeeded.length + optionalFiles.length === 0 ? (
        <div className="no-documents">
          <p>
            There's nothing we need from you right now. We'll let you know when
            there's an update.
          </p>
        </div>
      ) : null}
      {filesNeeded.map(item => (
        <FilesNeeded key={getTrackedItemId(item)} id={claim.id} item={item} />
      ))}
    </div>
  );
}

WhatYouNeedToDo.propTypes = {
  claim: PropTypes.object,
};

export default WhatYouNeedToDo;
