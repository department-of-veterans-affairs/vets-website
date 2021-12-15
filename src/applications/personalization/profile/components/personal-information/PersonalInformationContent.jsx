import React, { memo } from 'react';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';

import InitializeVAPServiceID from '@@vap-svc/containers/InitializeVAPServiceID';

import LegacyGenderAndDOBSection from './LegacyGenderAndDOBSection';
import ContactInformationSection from '../contact-information/ContactInformationSection';
import EmailInformationSection from '../contact-information/email-addresses/EmailInformationSection';
import PersonalInformationSection from '../personal-information/PersonalInformationSection';

const PersonalInformationContent = ({
  hasVAPServiceError,
  shouldShowProfileLGBTQEnhancements,
}) => (
  <>
    {!shouldShowProfileLGBTQEnhancements && (
      <LegacyGenderAndDOBSection className="vads-u-margin-bottom--6" />
    )}

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
            personal information. Please refresh the page or try again later.
          </p>
        </AlertBox>
      </div>
    ) : (
      <InitializeVAPServiceID>
        {shouldShowProfileLGBTQEnhancements ? (
          <PersonalInformationSection />
        ) : (
          <>
            <ContactInformationSection />
            <EmailInformationSection />
          </>
        )}
      </InitializeVAPServiceID>
    )}
  </>
);

export default memo(PersonalInformationContent);
