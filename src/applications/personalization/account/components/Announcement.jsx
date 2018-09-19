import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';
import dashboardManifest from '../../../../applications/personalization/dashboard/manifest.json';

export default function AccountAnnouncement({ dismiss, isDismissed }) {
  return (
    <AlertBox
      isVisible={!isDismissed}
      onCloseAlert={dismiss}
      status="info"
      content={
        <div>
          <h4 className="usa-alert-heading">Find your saved applications and links to available services</h4>
          <a onClick={dismiss} href={dashboardManifest.rootUrl}>Visit your new personalized homepage.</a>
        </div>
      }/>
  );
}
