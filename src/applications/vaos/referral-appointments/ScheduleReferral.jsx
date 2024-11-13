import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { format } from 'date-fns';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import FormLayout from '../new-appointment/components/FormLayout';
import ReferralAppLink from './components/ReferralAppLink';
import { getPatientReferralById } from '../services/referral';
import { setFormCurrentPage } from './redux/actions';
import { referral } from './temp-data/referral';

export default function ScheduleReferral() {
  const [patientData, setPatientData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const params = useParams();

  useEffect(
    () => {
      dispatch(setFormCurrentPage('scheduleReferral'));
    },
    [location, dispatch],
  );

  useEffect(
    () => {
      const fetchDetails = async () => {
        let details = {};
        setError(false);
        try {
          // get the id from the url where url is /referral-review/:id
          const { id } = params;
          details = await getPatientReferralById(id);
        } catch (networkError) {
          setError(true);
        }
        setPatientData(details);
        setLoading(false);
      };

      // @TODO: This will eventually check for data in selected from redux
      if (!referral) {
        fetchDetails();
      } else {
        setPatientData(referral);
        setLoading(false);
      }
    },
    [params],
  );

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

  const appointmentCountString =
    patientData?.appointmentCount === 1
      ? '1 appointment'
      : `${patientData?.appointmentCount} appointments`;

  return (
    <FormLayout pageTitle="Review Approved Referral">
      <div>
        <h1>Referral for {patientData?.typeOfCare}</h1>
        <p data-testid="subtitle">
          {`Your referring VA facility approved you for ${appointmentCountString} with a community care provider. You can now schedule your appointment with a community care provider.`}
        </p>
        <va-additional-info
          data-testid="help-text"
          uswds
          trigger="If you already scheduled your appointment"
          class="vads-u-margin-bottom--2"
        >
          <p>
            Contact your referring VA facility if you have already scheduled
            with a community care provider.
          </p>
        </va-additional-info>
        <ReferralAppLink linkText="Schedule your appointment" />
        <h2>Details about your referral</h2>
        <p>
          <strong>Expiration date: </strong>
          {`All appointments for this referral must be scheduled by
          ${format(patientData?.expirationDate, 'MMMM d, yyyy')}`}
          <br />
          <strong>Type of care: </strong>
          {patientData?.typeOfCare}
          <br />
          <strong>Provider: </strong>
          {patientData?.providerName}
          <br />
          <strong>Location: </strong>
          {patientData?.location}
          <br />
          <strong>Number of appointments: </strong>
          {patientData?.appointmentCount}
          <br />
          <strong>Referral number: </strong>
          {patientData?.referralNumber}
        </p>
        <va-additional-info
          data-testid="help-text"
          uswds
          trigger="If you were approved for more than one appointment"
          class="vads-u-margin-bottom--2"
        >
          <p>
            If you were approved for more than one appointment, schedule your
            first appointment using this tool. You’ll need to schedule the
            remaining appointments later with your community care provider.
          </p>
        </va-additional-info>

        <h2>Have questions about your referral?</h2>
        <p>
          Contact your referring VA facility if you have questions about your
          referral or how to schedule your appointment.
        </p>
        <p>
          <strong>Referring VA facility: </strong>
          {patientData?.referringFacility.name}
          <br />
          <strong>Phone: </strong>
          {patientData?.referringFacility.phone}
        </p>
      </div>
    </FormLayout>
  );
}
