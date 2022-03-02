import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { focusElement } from 'platform/utilities/ui';
import Telephone from '@department-of-veterans-affairs/component-library/Telephone';

import { api } from '../../../api';
import AppointmentBlock from '../../../components/AppointmentBlock';
import BackToHome from '../../../components/BackToHome';
import { useFormRouting } from '../../../hooks/useFormRouting';

import {
  makeSelectCurrentContext,
  makeSelectForm,
  makeSelectVeteranData,
} from '../../../selectors';

const Confirmation = props => {
  const { router } = props;
  const { goToErrorPage } = useFormRouting(router);

  const selectForm = useMemo(makeSelectForm, []);
  const { data } = useSelector(selectForm);
  const {
    demographicsUpToDate = null,
    emergencyContactUpToDate = null,
    nextOfKinUpToDate = null,
  } = data;

  const selectCurrentContext = useMemo(makeSelectCurrentContext, []);
  const { token } = useSelector(selectCurrentContext);

  const [demographicsFlagsSent, setDemographicsFlagsSent] = useState(false);

  useEffect(
    () => {
      focusElement('h1');

      async function sendPreCheckInData() {
        // Set pre-checkin complete and send demographics flags.
        const preCheckInData = { uuid: token };

        if (demographicsUpToDate) {
          preCheckInData.demographicsUpToDate = demographicsUpToDate === 'yes';
        }
        if (nextOfKinUpToDate) {
          preCheckInData.nextOfKinUpToDate = nextOfKinUpToDate === 'yes';
        }
        if (emergencyContactUpToDate) {
          preCheckInData.emergencyContactUpToDate =
            emergencyContactUpToDate === 'yes';
        }

        try {
          const resp = await api.v2.postPreCheckInData({ ...preCheckInData });
          if (resp.data.error || resp.data.errors) {
            goToErrorPage();
          } else {
            setDemographicsFlagsSent();
          }
        } catch (error) {
          goToErrorPage();
        }
      }

      if (!demographicsFlagsSent) {
        sendPreCheckInData();
      }
    },
    [
      demographicsFlagsSent,
      demographicsUpToDate,
      emergencyContactUpToDate,
      goToErrorPage,
      nextOfKinUpToDate,
      token,
    ],
  );
  const selectVeteranData = useMemo(makeSelectVeteranData, []);
  const selectFormData = useMemo(makeSelectForm, []);
  const { appointments } = useSelector(selectVeteranData);
  const { data: formData } = useSelector(selectFormData);
  const hasUpdates = Object.values(formData).includes('no');

  if (appointments.length === 0) {
    return <></>;
  }
  return (
    <div
      className="vads-l-grid-container vads-u-padding-bottom--3 vads-u-padding-top--3"
      data-testid="confirmation-wrapper"
    >
      <h1 tabIndex="-1" className="vads-u-margin-top--2">
        You’ve completed pre-check-in
      </h1>
      <AppointmentBlock appointments={appointments} />
      {hasUpdates ? (
        <va-alert
          background-only
          status="info"
          show-icon
          data-testid="confirmation-update-alert"
        >
          <div>
            A staff member will help you on the day of your appointment to
            update your information.
          </div>
        </va-alert>
      ) : (
        <></>
      )}
      <p className={hasUpdates ? `vads-u-padding-left--2` : ``}>
        <a href="https://va.gov/health-care/schedule-view-va-appointments/appointments/">
          Go to your appointment
        </a>
      </p>
      <p className={hasUpdates ? `vads-u-padding-left--2` : ``}>
        Please bring your insurance cards with you to your appointment.
      </p>
      <h3 data-testid="appointment-questions">
        What if I have questions about my appointment?
      </h3>
      <p>Call your VA health care team:</p>
      {appointments.map((appointment, index) => {
        return (
          <p key={index}>
            {appointment.clinicFriendlyName || appointment.clinicName} at{' '}
            <Telephone contact={appointment.clinicPhoneNumber} />
          </p>
        );
      })}
      <BackToHome />
    </div>
  );
};

Confirmation.propTypes = {
  router: PropTypes.object,
};

export default Confirmation;
