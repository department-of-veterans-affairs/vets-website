import React, { useEffect, useState } from 'react';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import FormLayout from '../new-appointment/components/FormLayout';
import ReferralAppLink from './components/ReferralAppLink';
import { getPatientDetails } from '../services/referral';

export default function ReviewApproved() {
  const [patientData, setPatientData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      let details = {};
      setError(false);
      try {
        details = await getPatientDetails();
      } catch (networkError) {
        setError(true);
      }
      setPatientData(details);
      setLoading(false);
    };

    fetchDetails();
  }, []);

  if (loading) {
    return (
      <FormLayout pageTitle="Review Approved Referral">
        <va-loading-indicator set-focus message="Loading your data..." />
      </FormLayout>
    );
  }

  if (error) {
    return (
      <VaAlert status="error" visible>
        <h2 slot="headline">
          There was an error trying to get your referral data
        </h2>
        <p>Please try again later, or contact your VA facility for help.</p>
      </VaAlert>
    );
  }

  return (
    <FormLayout pageTitle="Review Approved Referral">
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
        <div>{patientData?.referral?.typeOfCare}</div>
        <hr className="vads-u-margin-y--2" />
        <div className="vads-u-font-weight--bold">Preferred Facility</div>
        <div>{patientData?.detailsShared?.preferredFacility}</div>
        <hr className="vads-u-margin-y--2" />
        <div className="vads-u-font-weight--bold">Preferred location</div>
        <div>{patientData?.detailsShared?.preferredLocation}</div>
        <hr className="vads-u-margin-y--2" />
        <div className="vads-u-font-weight--bold">Preferred provider</div>
        <div>{patientData?.detailsShared?.preferredProvider}</div>
        <hr className="vads-u-margin-y--2" />
        <div className="vads-u-font-weight--bold">
          Details you shared with your provider
        </div>
        <div>{patientData?.detailsShared?.bookNotes}</div>
        <hr className="vads-u-margin-y--2" />
        <div className="vads-u-font-weight--bold vads-u-margin-bottom--2">
          Details about your referral
        </div>
        <div>
          <span className="vads-u-font-weight--bold vads-u-font-size--h5 vads-u-margin-bottom--2">
            Referral number:
          </span>{' '}
          {patientData?.referral?.referralNumber}
        </div>
        <div>
          <span className="vads-u-font-weight--bold vads-u-font-size--h5 vads-u-margin-bottom--2">
            Start date:
          </span>{' '}
          {patientData?.referral?.startDate}
        </div>
        <div>
          <span className="vads-u-font-weight--bold vads-u-font-size--h5 vads-u-margin-bottom--2">
            Expiration date:
          </span>{' '}
          {patientData?.referral?.expirationDate}
        </div>
        <div>
          <span className="vads-u-font-weight--bold vads-u-font-size--h5 vads-u-margin-bottom--2">
            Referring VA facility:
          </span>{' '}
          {patientData?.referral?.referringFacility}
        </div>
        <div>
          <span className="vads-u-font-weight--bold vads-u-font-size--h5 vads-u-margin-bottom--2">
            Phone number:
          </span>{' '}
          {patientData?.referral?.phoneNumber}
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
