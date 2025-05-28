import React from 'react';

export const CutoverAlert = () => (
  <va-alert close-btn-aria-label="Close notification" status="warning" visible>
    <>
      <p className="vads-u-margin-y--0">
        This form is scheduled to be updated on MM/DD/YYYY. If you do not
        complete it by then, all of your saved progress will be lost.
      </p>
    </>
  </va-alert>
);
