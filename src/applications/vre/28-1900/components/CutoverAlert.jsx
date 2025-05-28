import React, { useEffect, useState } from 'react';

export const CutoverAlert = location => {
  const [showAlert, setShowAlert] = useState(false);

  useEffect(
    () => {
      if (
        location.location.pathname !== `/introduction` &&
        location.location.pathname !== `/confirmation`
      ) {
        setShowAlert(true);
      }
    },
    [location],
  );

  return showAlert ? (
    <va-alert
      close-btn-aria-label="Close notification"
      status="warning"
      visible
    >
      <>
        <p className="vads-u-margin-y--0">
          This form is scheduled to be updated on MM/DD/YYYY. If you do not
          complete it by then, all of your saved progress will be lost.
        </p>
      </>
    </va-alert>
  ) : null;
};
