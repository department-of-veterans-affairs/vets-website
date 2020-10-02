import React from 'react';

export const receiveTextsNote = () => (
  // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
  <div className="vads-u-padding-top--1p5" tabIndex="0">
    <p>
      <b>Note:</b> Text messages may include status updates or requests to
      verify school attendance or other GI Bill benefit information. Message and
      data rates may apply.
    </p>
  </div>
);

export const receiveTextsAlert = () => (
  <div
    className="usa-alert usa-alert-warning background-color-only"
    role="alert"
  >
    Since you've opted to receive text message updates, you need to enter your
    mobile phone number so we can send updates to your device.
  </div>
);
