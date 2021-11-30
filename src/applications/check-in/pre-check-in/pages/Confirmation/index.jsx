import React, { useEffect } from 'react';
import { focusElement } from 'platform/utilities/ui';

const Confirmation = () => {
  useEffect(() => {
    focusElement('h1');
  }, []);
  return (
    <div className="vads-l-grid-container vads-u-padding-bottom--5 vads-u-padding-top--2">
      <h1>You’ve completed pre check-in</h1>
      <p className="vads-u-font-family--serif">Placeholder</p>
      {/* TODO APPOINTMENT LIST */}
      {/* TODO GO TO APPOINTMENT LINKS */}
      <p>Please bring your insurance cards with you to your appointment.</p>
      <h3>What if I have questions about my appointment?</h3>
      <p>Call your VA health care team:</p>
      {/* TODO FACILITY PHONE LINKS */}
    </div>
  );
};

export default Confirmation;
