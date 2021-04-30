import React from 'react';

/* eslint-disable camelcase */
export const hearingTypeContent = {
  virtual_hearing: (
    <>
      <strong>Virtual tele-hearing from my home</strong>
      <p className="hide-on-review">
        You’ll have the flexibility and convenience of attending your Board
        hearing with a Veterans Law judge and Veteran representatives from a
        personal computer or mobile device.
      </p>
    </>
  ),

  video_conference: (
    <>
      <strong>Video hearing from a VA location near me</strong>
      <p className="hide-on-review">
        You’ll travel to your closest regional office and teleconference with a
        Judge in Washington, D.C. Video hearings are open depending on the
        status of the regional office. We are only able to accomodate a limited
        amount to Veterans to make sure everyone is socially distant and safe.
      </p>
    </>
  ),

  central_office: (
    <>
      <strong>In-person hearing at the Board in Washington, D.C.</strong>
      <p className="hide-on-review">
        You’ll travel to Washington, D.C., for an in-person hearing with a
        Judge. Central Office hearings are open, but capacity is limited to
        ensure appropriate social distancing and sanitized hearing rooms.
      </p>
    </>
  ),
};

export const missingHearingTypeErrorMessage = 'Please choose a conference type';
