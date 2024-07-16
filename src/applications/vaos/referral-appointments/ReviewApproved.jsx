import React, { useEffect, useState } from 'react';
import FormLayout from '../new-appointment/components/FormLayout';
import ReferralAppLink from './components/ReferralAppLink';
import { getPatientDetails } from '../services/referral';

export default function ReviewApproved() {
  const [patientData, setPatientData] = useState({});

  useEffect(() => {
    const fetchDetails = async () => {
      const details = await getPatientDetails();
      setPatientData(details);
    };

    fetchDetails();
  }, []);

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
