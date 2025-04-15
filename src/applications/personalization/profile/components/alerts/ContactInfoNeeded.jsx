import React from 'react';
import { useSelector } from 'react-redux';
import { selectVAPContactInfoField } from '@@vap-svc/selectors';
import {
  VaAlert,
  VaLinkAction,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { FIELD_NAMES } from 'platform/user/profile/vap-svc/constants';

export const ContactInfoNeeded = () => {
  const email = useSelector(state =>
    selectVAPContactInfoField(state, FIELD_NAMES.EMAIL),
  );
  const mailingAddress = useSelector(state =>
    selectVAPContactInfoField(state, FIELD_NAMES.MAILING_ADDRESS),
  );
  const mobilePhone = useSelector(state =>
    selectVAPContactInfoField(state, FIELD_NAMES.MOBILE_PHONE),
  );

  const contactInfoIsNeeded =
    !email?.emailAddress ||
    !mailingAddress?.addressLine1 ||
    !mobilePhone?.phoneNumber;

  return contactInfoIsNeeded ? (
    <div className="vads-u-margin-top--4 vads-u-margin-bottom--4">
      <VaAlert data-testid="account-blocked-alert" status="info" uswds>
        <h2 slot="headline">We need your contact information</h2>
        <p>
          Add your contact information to your profile so that we can contact
          you about your VA benefits and services.
        </p>
        <VaLinkAction
          href="/my-va/welcome-va-setup"
          text="Add your contact information"
        />
      </VaAlert>
    </div>
  ) : null;
};
