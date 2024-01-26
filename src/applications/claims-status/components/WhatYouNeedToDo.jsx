import PropTypes from 'prop-types';
import React from 'react';
import {
  getTrackedItemId,
  getTrackedItems,
  getFilesNeeded,
} from '../utils/helpers';

import FilesNeeded from './FilesNeeded';

function WhatYouNeedToDo({ claim, useLighthouse }) {
  const trackedItems = getTrackedItems(claim, useLighthouse);
  const filesNeeded = getFilesNeeded(trackedItems, useLighthouse);

  return (
    <div className="what-you-need-to-do-container">
      <h3 className="vads-u-margin-bottom--3">What you need to do</h3>
      {filesNeeded.length === 0 ? (
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
  useLighthouse: PropTypes.bool,
};

export default WhatYouNeedToDo;
