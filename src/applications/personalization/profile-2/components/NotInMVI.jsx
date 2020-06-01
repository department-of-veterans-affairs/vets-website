import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import AdditionalInfo from '@department-of-veterans-affairs/formation-react/AdditionalInfo';
import facilityLocator from 'applications/facility-locator/manifest.json';

const NotInMVI = () => {
  const content = (
    <>
      <p>
        We’re sorry. We can’t match the information you entered to our Veteran records.
        We can’t give you access to health and benefit tools until we can match the information and verify your identity.
      </p>
      <p>
        If you’d like to use these tools on VA.gov, please contact your nearest VA medical center to verify and update your records.
      </p>

      <a href={facilityLocator.rootUrl}>
        Find your nearest VA medical center
      </a>
    </>
  );

  return (
    <div className="vads-u-margin-bottom--3 medium-screen:vads-u-margin-bottom--4">
      <AlertBox
        headline="We can’t match your information with our Veteran records"
        content={content}
        status="warning"
      />
    </div>
  );
};

export default NotInMVI;
