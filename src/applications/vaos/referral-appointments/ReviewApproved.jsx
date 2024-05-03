import React from 'react';
import PageLayout from '../appointment-list/components/PageLayout';
import ReferralAppLink from './components/ReferralAppLink';

export default function ReviewApproved() {
  return (
    <PageLayout showBreadcrumbs showNeedHelp>
      <h1>Review your approved referral and start scheduling an appointment</h1>
      <p data-testid="subtitle" className="vads-u-font-family--serif">
        Your community care referral has been approved and can now be schedule.
      </p>
      <div className="vads-u-font-weight--bold">What</div>
      <div>Family Medicine</div>
      <div className="vads-u-font-weight--bold">Preferred Facility</div>
      <div>none</div>
      <div className="vads-u-font-weight--bold">Preferred location</div>
      <div>none</div>
      <div className="vads-u-font-weight--bold">Preferred provider</div>
      <div>none</div>
      <div className="vads-u-font-weight--bold">
        Details you shared with your provider
      </div>
      <div>Back hurts</div>
      <div className="vads-u-font-weight--bold">
        Details you shared with your provider
      </div>
      <div>
        <span className="vads-u-font-weight--bold vads-u-font-size--h5 vads-u-margin-bottom--2">
          Referral number:
        </span>{' '}
        None
      </div>
      <div>
        <span className="vads-u-font-weight--bold vads-u-font-size--h5 vads-u-margin-bottom--2">
          Start date:
        </span>{' '}
        None
      </div>
      <div>
        <span className="vads-u-font-weight--bold vads-u-font-size--h5 vads-u-margin-bottom--2">
          Expiration date:
        </span>{' '}
        None
      </div>
      <div>
        <span className="vads-u-font-weight--bold vads-u-font-size--h5 vads-u-margin-bottom--2">
          Referring VA facility:
        </span>{' '}
        None
      </div>
      <div>
        <span className="vads-u-font-weight--bold vads-u-font-size--h5 vads-u-margin-bottom--2">
          Phone number:
        </span>{' '}
        None
      </div>
      <div>
        <ReferralAppLink
          linkText="Schedule community care appointment"
          linkPath="/choose-community-care-appointment"
        />
      </div>
    </PageLayout>
  );
}
