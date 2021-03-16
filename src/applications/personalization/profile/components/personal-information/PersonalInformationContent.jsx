import React, { memo } from 'react';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';

import InitializeVAPServiceID from '@@vap-svc/containers/InitializeVAPServiceID';

import GenderAndDOBSection from './GenderAndDOBSection';
import ContactInformationSection from './ContactInformationSection';
import EmailInformationSection from './email-addresses/EmailInformationSection';

const PersonalInformationContent = ({ hasVAPServiceError }) => (
  <>
    <GenderAndDOBSection className="vads-u-margin-bottom--6" />

    {hasVAPServiceError ? (
      <div data-testid="vap-service-not-available-error">
        <AlertBox
          level={2}
          status="warning"
          headline="We can’t load your contact information"
          className="vads-u-margin-bottom--4"
        >
          <p>
            We’re sorry. Something went wrong on our end. We can’t display your
            contact information. Please refresh the page or try again later.
          </p>
        </AlertBox>
      </div>
    ) : (
      <InitializeVAPServiceID>
        <ContactInformationSection className="vads-u-margin-bottom--6" />
        <EmailInformationSection />
      </InitializeVAPServiceID>
    )}
  </>
);

export default memo(PersonalInformationContent);
