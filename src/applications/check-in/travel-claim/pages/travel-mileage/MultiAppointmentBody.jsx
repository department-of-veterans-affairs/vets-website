import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  VaRadio,
  VaRadioOption,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useTranslation } from 'react-i18next';
import { getApptLabel } from '../../../utils/appointment';

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

  return (
    <div data-testid="multi-appointment-context">
      <VaRadio
        data-testid="radio-set"
        error={error ? t('select-at-least-one-appointment') : ''}
        uswds
        class="vads-u-margin-top--0 vads-u-margin-bottom--4"
        label={t('select-the-appointment-you-want')}
        onVaValueChange={onCheck}
      >
        {appointments.map((appointment, index) => (
          <VaRadioOption
            data-testid={`radio-${appointment.stationNo}-${
              appointment.appointmentIen
            }`}
            key={`${appointment.stationNo}-${appointment.appointmentIen}`}
            uswds
            value={index}
            tile
            label={getApptLabel(appointment)}
            description={`${t('in-person-at')} ${
              appointment.facility
            }${appointment.doctorName &&
              ` ${t('with')} ${appointment.doctorName}`}`}
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
