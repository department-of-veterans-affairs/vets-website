import React from 'react';

export const missingHearingTypeErrorMessage = 'Choose a conference type';

export const hearingTypeTitle =
  'What type of hearing would you like to request?';

// export const hearingTypeTitle = (
//   <h3 className="vads-u-display--inline">{title}</h3>
// );

/* eslint-disable camelcase */
export const hearingTypeLabels = {
  virtual_hearing: 'A virtual tele-hearing online',
  video_conference:
    'A Regional Office hearing at a VA Regional Office near you',
  central_office: 'An in-person hearing at the Board in Washington, D.C.',
};
export const hearingTypeDescriptions = {
  virtual_hearing:
    'You can attend your hearing on a computer, mobile phone, or tablet from a location you choose. You just need to be somewhere that has a Wi-Fi connection. Your accredited representative can be with you or in a separate location. The Veterans Law Judge will be located in a separate location.',
  video_conference:
    'You and your accredited representative can attend your hearing by video at a VA regional office near you. The Veterans Law Judge will be located in a separate location.',
  central_office:
    'You can attend an in-person hearing with a Veterans Law Judge.',
};
/* eslint-enable camelcase */

export const HearingTypeReviewField = ({ children }) => (
  <div className="review-row">
    <dt>{hearingTypeTitle}</dt>
    <dd>
      {children?.props?.formData ? (
        children
      ) : (
        <span className="usa-input-error-message">Missing hearing option</span>
      )}
    </dd>
  </div>
);
