import React, { useEffect } from 'react';
import { waitForRenderThenFocus } from 'platform/utilities/ui';

export default () => {
  useEffect(() => {
    if (!window.Cypress) {
      waitForRenderThenFocus('va-loading-indicator');
    }
  }, []);

  return (
    <div className="vads-u-margin-y--5">
      <div className="loading-indicator-container">
        <va-loading-indicator
          message="Please wait while we check to see if you have an existing Intent to File."
          label="looking for an intent to file"
        />
      </div>
    </div>
  );
};
