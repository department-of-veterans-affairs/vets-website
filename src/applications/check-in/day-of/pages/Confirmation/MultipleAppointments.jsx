import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { focusElement } from 'platform/utilities/ui';
import scrollToTop from 'platform/utilities/ui/scrollToTop';

import BackToHome from '../../../components/BackToHome';
import BackToAppointments from '../../../components/BackToAppointments';
import Footer from '../../../components/Footer';
import AppointmentLocation from '../../../components/AppointmentDisplay/AppointmentLocation';
import TravelPayReimbursementLink from '../../../components/TravelPayReimbursementLink';
import LanguagePicker from '../../../components/LanguagePicker';

const MultipleAppointments = props => {
  const { appointments, selectedAppointment, triggerRefresh } = props;
  const { t } = useTranslation();

  const appointment = selectedAppointment;
  const appointmentDateTime = new Date(appointment.startTime);

  useEffect(() => {
    focusElement('h1');
    scrollToTop('topScrollElement');
  }, []);

  return (
    <div
      className="vads-l-grid-container vads-u-padding-y--5"
      data-testid="multiple-appointments-confirm"
    >
      <LanguagePicker />
      <div>
        <h1
          tabIndex="-1"
          aria-label={t('thank-you-for-checking-in')}
          slot="headline"
        >
          {t('youre-checked-in-for-your-appointment', {
            date: appointmentDateTime,
          })}
        </h1>
        <p>
          {t('well-come-get-you-from-the', {})}{' '}
          <AppointmentLocation appointment={appointment} bold />{' '}
          {t('waiting-room-when-its-time-for-your-appointment-to-start')}
        </p>
      </div>
      <TravelPayReimbursementLink />
      <BackToAppointments
        appointments={appointments}
        triggerRefresh={triggerRefresh}
      />
      <Footer />
      <BackToHome />
    </div>
  );
};

MultipleAppointments.propTypes = {
  appointments: PropTypes.array,
  selectedAppointment: PropTypes.object,
  triggerRefresh: PropTypes.func,
};

export default MultipleAppointments;
