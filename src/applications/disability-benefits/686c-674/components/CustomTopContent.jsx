import React, { useState, useEffect } from 'react';
// import { useSelector } from 'react-redux';
// import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import { V2_LAUNCH_DATE } from '../config/constants';

export default function CustomTopContent() {
  // TODO: Add flipper logic
  // console.log(useSelector(toggleValues));
  const hideAlert =
    window.location.pathname.includes('/introduction') ||
    window.location.pathname.includes('/review-and-submit') ||
    window.location.pathname.includes('/form-saved');

  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleClose = () => setIsVisible(false);

    const alert = document.querySelector('va-alert');
    if (alert) {
      alert.addEventListener('closeEvent', handleClose);
    }

    return () => {
      if (alert) {
        alert.removeEventListener('closeEvent', handleClose);
      }
    };
  }, []);

  return hideAlert || !isVisible ? null : (
    <div className="vads-u-margin-bottom--4">
      <va-alert
        slim
        closeable
        visible={isVisible}
        close-btn-aria-label="Close notification"
      >
        <p className="vads-u-margin-y--0p5">
          This form will be undergoing maintenance on {V2_LAUNCH_DATE}. During
          this time, you may be redirected to the start of the form to review
          your information before submitting.
        </p>
      </va-alert>
    </div>
  );
}
