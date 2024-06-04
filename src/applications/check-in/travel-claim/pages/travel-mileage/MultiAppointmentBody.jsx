import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  VaRadio,
  VaRadioOption,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useTranslation } from 'react-i18next';

const MultipleAppointmentBody = props => {
  const {
    error,
    appointments,
    selectedAppointment,
    setSelectedAppointment,
  } = props;

  const { t } = useTranslation();

  const onCheck = useCallback(
    e => {
      const appointment = appointments[e.detail.value];
      setSelectedAppointment(appointment);
    },
    [appointments, setSelectedAppointment],
  );
  const getAppointmentsLabel = appointment => {
    return appointment.clinicStopCodeName
      ? ` ${appointment.clinicStopCodeName}`
      : ` ${t('VA-appointment')}`;
  };

  return (
    <div data-testid="multi-fac-context">
      <p>{t('if-youre-filing-only-mileage-no-other-file-all-claims-now')}</p>
      <VaRadio
        data-testid="radio-set"
        error={error ? t('select-at-least-one-appointment') : ''}
        uswds
        class="vads-u-margin-top--0 vads-u-margin-bottom--4"
        label={t('select-the-appointments-you-want')}
        onVaValueChange={onCheck}
      >
        {appointments.map((appointment, index) => (
          <VaRadioOption
            data-testid={`checkbox-${appointment.stationNo}-${
              appointment.appointmentIen
            }`}
            key={`${appointment.stationNo}-${appointment.appointmentIen}`}
            uswds
            value={index}
            label={`${getAppointmentsLabel(appointment)} at ${
              appointment.startTime
            } `}
            checked={
              `${selectedAppointment?.stationNo}-${
                selectedAppointment?.appointmentIen
              }` === `${appointment.stationNo}-${appointment.appointmentIen}`
            }
          />
        ))}
      </VaRadio>
    </div>
  );
};

MultipleAppointmentBody.propTypes = {
  appointments: PropTypes.array.isRequired,
  error: PropTypes.bool.isRequired,
  setSelectedAppointment: PropTypes.func.isRequired,
  selectedAppointment: PropTypes.object,
};

export default MultipleAppointmentBody;
