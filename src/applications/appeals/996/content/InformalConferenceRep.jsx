import React from 'react';

import { Toggler } from 'platform/utilities/feature-toggles';

export const ContactRepresentativeTitle = (
  <h3 className="vads-u-margin-top--0">
    Your representative’s contact information
  </h3>
);

export const ContactRepresentativeDescription = (
  <Toggler toggleName={Toggler.TOGGLE_NAMES.hlrUpdatedContent}>
    <Toggler.Enabled>
      <p className="vads-u-margin-top--0">
        We’ll contact your accredited representative to schedule an informal
        conference
      </p>
    </Toggler.Enabled>
  </Toggler>
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
