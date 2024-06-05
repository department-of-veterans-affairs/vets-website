import React from 'react';
import PageLayout from '../appointment-list/components/PageLayout';
import ReferralAppLink from './components/ReferralAppLink';

export default function AppointmentNotificationPage() {
  return (
    <PageLayout showBreadcrumbs showNeedHelp>
      <h1>Appointment Notifications</h1>
      <p data-testid="subtitle" className="vads-u-font-family--serif">
        Sort notifications
      </p>
      <div>Expires MMM DD </div>
      <div>Schedule an appointment for your (TypeOfCare) approved referral</div>
      <div>
        <ReferralAppLink
          linkText="Start scheduling"
          linkPath="/review-approved"
        />
      </div>
    </PageLayout>
  );
}
