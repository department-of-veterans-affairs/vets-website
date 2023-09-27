import React from 'react';

const None = () => {
  return (
    <>
      <div>This person may be contacted in the event of an emergency.</div>

      <va-additional-info
        trigger="How to update your emergency contact"
        uswds
        disable-border
      >
        <div>
          To add an emergency contact, please call the Help Desk at
          844-698-2311.
        </div>
      </va-additional-info>
    </>
  );
};

export default None;
