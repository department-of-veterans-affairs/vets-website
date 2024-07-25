import React from 'react';
import FormLayout from '../new-appointment/components/FormLayout';
import ReferralAppLink from './components/ReferralAppLink';

export default function ReviewApproved() {
  return (
    <FormLayout>
      <div>
        <h1>
          Review your approved referral and start scheduling an appointment
        </h1>
        <p data-testid="subtitle">
          Your community care referral has been approved and can now be
          scheduled.
        </p>
        <hr className="vads-u-margin-y--2" />
        <div className="vads-u-font-weight--bold">What</div>
        <div>Family Medicine</div>
        <hr className="vads-u-margin-y--2" />
        <div className="vads-u-font-weight--bold">Preferred Facility</div>
        <div>none</div>
        <hr className="vads-u-margin-y--2" />
        <div className="vads-u-font-weight--bold">Preferred location</div>
        <div>none</div>
        <hr className="vads-u-margin-y--2" />
        <div className="vads-u-font-weight--bold">Preferred provider</div>
        <div>none</div>
        <hr className="vads-u-margin-y--2" />
        <div className="vads-u-font-weight--bold">
          Details you shared with your provider
        </div>
        <div>Back hurts</div>
        <hr className="vads-u-margin-y--2" />
        <div className="vads-u-font-weight--bold vads-u-margin-bottom--2">
          Details about your referral
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
        <hr className="vads-u-margin-y--2" />
        <div>
          <ReferralAppLink
            linkText="Start scheduling your community care appointment"
            linkPath="/choose-community-care-appointment"
          />
        </div>
      </div>
    </FormLayout>
  );
}
