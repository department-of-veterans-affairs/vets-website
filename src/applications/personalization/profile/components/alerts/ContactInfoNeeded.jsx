import React from 'react';
import { useSelector } from 'react-redux';
import { selectVAPContactInfoField } from '@@vap-svc/selectors';
import {
  VaAlert,
  VaLinkAction,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { Toggler } from 'platform/utilities/feature-toggles';

const ContactInfoNeeded = () => {
  const email = useSelector(state => selectVAPContactInfoField(state, 'email'));
  const mailingAddress = useSelector(state =>
    selectVAPContactInfoField(state, 'mailingAddress'),
  );
  const mobilePhone = useSelector(state =>
    selectVAPContactInfoField(state, 'mobilePhone'),
  );

  const contactInfoIsNeeded =
    email?.emailAddress === null ||
    mailingAddress?.addressLine1 === null ||
    mobilePhone?.phoneNumber === null;

  return (
    <Toggler toggleName={Toggler.TOGGLE_NAMES.veteranOnboardingContactInfoFlow}>
      <Toggler.Enabled>
        {contactInfoIsNeeded && (
          <div className="vads-u-margin-bottom--4">
            <VaAlert data-testid="account-blocked-alert" status="info" uswds>
              <h2 slot="headline">We need your contact information</h2>
              <p>
                Add your contact information to your profile so that we can
                contact you about your VA benefits and services.
              </p>
              <VaLinkAction href="" text="Add your contact information" />
            </VaAlert>
          </div>
        )}
      </Toggler.Enabled>
    </Toggler>
  );
};

ContactInfoNeeded.propTypes = {};

export { ContactInfoNeeded };
