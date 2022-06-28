import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import scrollToTop from 'platform/utilities/ui/scrollToTop';

import BackToHome from '../../../components/BackToHome';
import BackToAppointments from '../../../components/BackToAppointments';
import Footer from '../../../components/layout/Footer';
import TravelPayReimbursementLink from '../../../components/TravelPayReimbursementLink';
import Wrapper from '../../../components/layout/Wrapper';
import AppointmentConfirmationListItem from '../../../components/AppointmentDisplay/AppointmentConfirmationListItem';

const CheckInConfirmation = props => {
  const { appointments, selectedAppointment, triggerRefresh } = props;
  const { t } = useTranslation();

  const appointment = selectedAppointment;
  const appointmentDateTime = new Date(appointment.startTime);

  useEffect(() => {
    scrollToTop('topScrollElement');
  }, []);

  const pageTitle = t('youre-checked-in', {
    date: appointmentDateTime,
  });

  return (
    <Wrapper pageTitle={pageTitle} testID="multiple-appointments-confirm">
      <p>{t('your-appointment')}</p>
      <ol
        className="vads-u-border-top--1px vads-u-margin-bottom--4 check-in--appointment-list"
        data-testid="appointment-list"
      >
        <AppointmentConfirmationListItem appointment={appointment} key={0} />
      </ol>

      <va-alert background-only show-icon data-testid="error-message">
        <div>
          {t(
            'well-come-get-you-from-the-waiting-room-when-its-time-for-your-appointment-to-start',
          )}
        </div>
      </va-alert>
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
