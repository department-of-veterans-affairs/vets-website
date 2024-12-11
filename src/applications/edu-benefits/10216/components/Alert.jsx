import React from 'react';

const Alert = () => {
  return (
    <va-alert
      close-btn-aria-label="Close notification"
      status="warning"
      visible
    >
      <h2 slot="headline">Additional form needed</h2>
      <>
        <p className="vads-u-margin-y--0" id="additional-form-needed-alert">
          Your school facility code indicates the school is not accredited. In
          addition to completing VA Form 22-10216, you’ll also need to complete
          and submit VA Form 22-10215. You will be directed to that form after
          completing this one.
        </p>
      </>
    </va-alert>
  );
};

export default Alert;
