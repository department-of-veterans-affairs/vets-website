import React from 'react';

export default function PhoneInstructions({ isPhone }) {
  if (!isPhone) {
    return null;
  }

  return (
    <div className="vads-u-font-size--base vads-u-font-family--sans vads-u-margin-bottom--0">
      Someone from your VA facility will call you at your phone number on file
      at the appointment time.
    </div>
  );
}
