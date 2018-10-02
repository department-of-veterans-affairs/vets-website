import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';
import AdditionalInfo from '@department-of-veterans-affairs/formation/AdditionalInfo';
import isBrandConsolidationEnabled from '../../../../platform/brand-consolidation/feature-flag';

import recordEvent from '../../../../platform/monitoring/record-event';

export default function ContactInformationExplanation() {
  return (
    <div>
      <div style={{ marginBottom: 10 }}>
        <AlertBox status="info" isVisible>
          <p>
            We’ll use this information to contact you about certain benefits and
            services, including disability compensation, pension benefits, and
            claims and appeals. If you’re enrolled in the VA health care
            program, your health care team may also use this information to
            communicate with you.
          </p>
          {!isBrandConsolidationEnabled() && (
            <span>
              <a
                href="/health-care/"
                onClick={() => {
                  recordEvent({
                    event: 'profile-navigation',
                    'profile-action': 'view-link',
                    'profile-section': 'learn-more-va-benefits',
                  });
                }}
              >
                Learn more about VA health benefits
              </a>
              .
            </span>
          )}
        </AlertBox>
      </div>
      <AdditionalInfo
        triggerText="How do I update my contact information for other benefits?"
        onClick={() => {
          recordEvent({
            event: 'profile-navigation',
            'profile-action': 'view-link',
            'profile-section': 'update-personal-information',
          });
        }}
      >
        <p>
          Some of our departments keep your contact information updated in their
          own separate records. If you use any of the VA benefits or services
          listed below, you’ll need to contact the department that handles those
          benefits directly to update your information.
        </p>
        <h5>
          Contact these departments directly to update your contact information:
        </h5>
        <ul>
          <li>
            <strong>For education benefits:</strong> Call 1-888-GIBILL-1
            (1-888-442-4551), Monday through Friday, 7:00 a.m. to 6:00 p.m. (CT)
          </li>
          <li>
            <strong>For home loan benefits:</strong> Call 1-877-827-3702, Monday
            through Friday, 8:00 a.m. to 6:00 p.m. (ET) to reach the nearest VA
            regional benefit office with loan guaranty staff.
          </li>
          <li>
            <strong>For Veterans' Mortgage Life Insurance:</strong> Call the VA
            Insurance Center (VAIC) at 1-800-669-8477, Monday through Friday,
            8:00 a.m. to 6:00 p.m. (ET)
          </li>
          <li>
            <strong>For prescriptions:</strong> Call your health care team or
            your nearest VA medical center.
          </li>
        </ul>
        <a href="/facilities/">Find your nearest VA medical center</a>.
      </AdditionalInfo>
    </div>
  );
}
