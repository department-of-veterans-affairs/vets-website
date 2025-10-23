import React from 'react';

import { getPhoneString } from '~/platform/forms-system/src/js/utilities/data/profile';

const MockContactInfo = ({
  formData: {
    veteran: { homePhone, mobilePhone, email, address },
  },
}) => (
  <>
    <h3 id="confirmContactInfoHeader" className="vads-u-margin-top--0">
      Contact information
    </h3>
    <p>
      This is the contact information we have on file for you. We’ll send any
      updates or information about your appeal to this address.
    </p>
    <p>
      <strong>Note:</strong> Any updates you make here will be reflected in your
      VA.gov profile.
    </p>
    <div className="blue-bar-block vads-u-margin-top--4">
      <div className="va-profile-wrapper">
        <h4 className="vads-u-font-size--h4 vads-u-width--auto vads-u-margin-top--0p5">
          Home phone number
        </h4>
        <span className="dd-privacy-hidden" data-dd-action-name="home phone">
          <va-telephone
            contact={getPhoneString(homePhone)}
            extension={homePhone?.extension}
            not-clickable
          />
        </span>
        <div>
          <a href="#main" aria-label="edit home phone">
            edit
          </a>
        </div>

        <h4 className="vads-u-font-size--h4 vads-u-width--auto">
          Mobile phone number
        </h4>
        <span className="dd-privacy-hidden" data-dd-action-name="mobile phone">
          <va-telephone
            contact={getPhoneString(mobilePhone)}
            extension={mobilePhone?.extension}
            not-clickable
          />
        </span>
        <div>
          <a href="#main" aria-label="edit mobile phone">
            edit
          </a>
        </div>

        <h4 className="vads-u-font-size--h4 vads-u-width--auto">
          Email address
        </h4>
        <span className="dd-privacy-hidden" data-dd-action-name="email">
          {email}
        </span>
        <div>
          <a href="#main" aria-label="edit email address">
            edit
          </a>
        </div>

        <h4 className="vads-u-font-size--h4 vads-u-width--auto">
          Mailing address
        </h4>
        <div className="dd-privacy-hidden" data-dd-action-name="street">
          {[
            address.addressLine1,
            address.addressLine2 || '',
            address.addressLine3 || '',
          ]
            .filter(Boolean)
            .join(', ')}
        </div>
        <div
          className="dd-privacy-hidden"
          data-dd-action-name="city, state and zip code"
        >
          {address.city || ''}, {address.stateCode || ''}{' '}
          {address.zipCode || ''}
        </div>
        <div>
          <a href="#main" aria-label="edit mailing address">
            edit
          </a>
        </div>
      </div>
    </div>
  </>
);

export default MockContactInfo;
