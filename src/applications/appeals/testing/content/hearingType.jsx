import React from 'react';

const title = 'What type of hearing would you like to request?';

export const hearingTypeTitle = (
  <h1 className="vads-u-display--inline">{title}</h1>
);

/* eslint-disable camelcase */
export const hearingTypes = {
  virtual_hearing: 'A virtual tele-hearing online',
  video_conference:
    'A Regional Office hearing at a VA Regional Office near you',
  central_office: 'An in-person hearing at the Board in Washington, D.C.',
};

export const hearingTypeContent = {
  virtual_hearing: (
    <>
      <strong>A virtual tele-hearing online</strong>
      <p className="hide-on-review">
        You can attend your hearing on a computer, mobile phone, or tablet from
        a location you choose. You just need to be somewhere that has a Wi-Fi
        connection. Your accredited representative can be with you or in a
        separate location. The Veterans Law Judge will be located in a separate
        location.
      </p>
    </>
  ),

  video_conference: (
    <>
      <strong>
        A Regional Office hearing at a VA Regional Office near you
      </strong>
      <p className="hide-on-review">
        You and your accredited representative can attend your hearing by video
        at a VA regional office near you. The Veterans Law Judge will be located
        in a separate location.
      </p>
    </>
  ),

  central_office: (
    <>
      <strong>An in-person hearing at the Board in Washington, D.C.</strong>
      <p className="hide-on-review">
        You can attend an in-person hearing with a Veterans Law Judge.
      </p>
    </>
  ),
};

export const missingHearingTypeErrorMessage = 'Choose a conference type';

export const HearingTypeReviewField = ({ children }) => (
  <div className="review-row">
    <dt>{title}</dt>
    <dd>
      {children?.props?.formData ? (
        children
      ) : (
        <span className="usa-input-error-message">Missing hearing option</span>
      )}
    </dd>
  </div>
);
