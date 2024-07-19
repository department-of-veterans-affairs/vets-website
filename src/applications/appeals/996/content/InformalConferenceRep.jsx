import React from 'react';

import { Toggler } from 'platform/utilities/feature-toggles';

export const ContactRepresentativeTitle = (
  <h3 className="vads-u-margin-top--0">
    <Toggler toggleName={Toggler.TOGGLE_NAMES.hlrUpdatedContent}>
      <Toggler.Enabled>
        Your representative’s contact information
      </Toggler.Enabled>
      <Toggler.Disabled>
        What’s the best time for us to call you?
      </Toggler.Disabled>
    </Toggler>
  </h3>
);

export const ContactRepresentativeDescription = (
  <p className="vads-u-margin-top--0">
    We’ll contact your accredited representative to schedule an informal
    conference
  </p>
);

export const RepresentativeNameTitle = 'Representative’s name';
export const RepresentativeFirstNameTitle = 'Representative’s first name';
export const RepresentativeLastNameTitle = 'Representative’s last name';

export const RepresentativePhoneTitle = 'Representative’s phone number';
export const RepresentativePhoneExtensionTitle =
  'Representative’s phone extension';

export const RepresentativeEmailTitle = 'Representative’s email address';

export const RepresentativeReviewWidget = ({ name, value }) => (
  <span className="dd-privacy-hidden" data-dd-action-name={name || ''}>
    {value || null}
  </span>
);
