import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Trans, useTranslation } from 'react-i18next';

import scrollToTop from 'platform/utilities/ui/scrollToTop';

import BackToHome from '../../../components/BackToHome';
import BackToAppointments from '../../../components/BackToAppointments';
import Footer from '../../../components/Footer';
import AppointmentLocation from '../../../components/AppointmentDisplay/AppointmentLocation';
import TravelPayReimbursementLink from '../../../components/TravelPayReimbursementLink';
import Wrapper from '../../../components/layout/Wrapper';

const CheckInConfirmation = props => {
  const { appointments, selectedAppointment, triggerRefresh } = props;
  const { t } = useTranslation();

  const appointment = selectedAppointment;
  const appointmentDateTime = new Date(appointment.startTime);

  useEffect(() => {
    scrollToTop('topScrollElement');
  }, []);

  const pageTitle = t('youre-checked-in-for-your-appointment', {
    date: appointmentDateTime,
  });

  return (
    <Wrapper pageTitle={pageTitle} testID="multiple-appointments-confirm">
      <p>
        <Trans
          i18nKey="well-come-get-you-from-the-waiting-room-when-its-time-for-your-appointment-to-start"
          components={[
            <AppointmentLocation
              key="location"
              appointment={appointment}
              bold
            />,
          ]}
        />
      </p>
      <TravelPayReimbursementLink />
      <BackToAppointments
        appointments={appointments}
        triggerRefresh={triggerRefresh}
      />
      <Footer />
      <BackToHome />
    </Wrapper>
  );
};

CheckInConfirmation.propTypes = {
  appointments: PropTypes.array,
  selectedAppointment: PropTypes.object,
  triggerRefresh: PropTypes.func,
};

export default CheckInConfirmation;
