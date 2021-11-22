import React from 'react';

/* eslint-disable camelcase */
export const hearingTypeContent = {
  virtual_hearing: (
    <>
      <strong>A tele-hearing online</strong>
      <p className="hide-on-review">
        You can attend your hearing on a computer, mobile phone, or tablet from
        a location you choose. You just need to be somewhere that has a Wi-Fi
        connection. Your accredited representative can be with you or in a
        separate location. The Veterans Law Judge will be located in a separate
        location.
      </p>
    </>
  ),

  video_conference: (
    <>
      <strong>A video hearing at a VA regional office near you</strong>
      <p className="hide-on-review">
        You and your accredited representative can attend your hearing by video
        at a VA regional office near you. The Veterans Law Judge will be located
        in a separate location.
      </p>
      <p className="hide-on-review">
        <strong>Note:</strong> Fewer Veterans will be able to use this option
        right now due to COVID-19 and social distancing.
      </p>
    </>
  ),

  central_office: (
    <>
      <strong>An in-person hearing at the Board in Washington, D.C.</strong>
      <p className="hide-on-review">
        You can attend an in-person hearing with a Veterans Law Judge.
      </p>
      <p className="hide-on-review">
        <strong>Note:</strong> Fewer Veterans will be able to use this option
        right now due to COVID-19 and social distancing.
      </p>
    </>
  ),
};

export const missingHearingTypeErrorMessage = 'Please choose a conference type';
