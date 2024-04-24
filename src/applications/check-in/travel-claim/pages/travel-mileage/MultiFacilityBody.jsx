import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { VaCheckbox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useTranslation } from 'react-i18next';
import {
  sortAppointmentsByStartTime,
  utcToFacilityTimeZone,
} from '../../../utils/appointment';

const MultipleFacilityBody = props => {
  const {
    error,
    appointmentsByFacility,
    selectedFacilities,
    setSelectedFacilities,
  } = props;

  const { t } = useTranslation();

  const onCheck = useCallback(
    e => {
      const stationNo = e.target.value;
      const { checked } = e.detail;
      const appointments = appointmentsByFacility[stationNo];
      const firstAppointment = sortAppointmentsByStartTime(appointments)[0];
      const value = {
        stationNo: firstAppointment.stationNo,
        startTime: utcToFacilityTimeZone(
          firstAppointment.startTime,
          firstAppointment.timezone,
        ),
        facility: firstAppointment.facility,
        appointmentCount: appointments.length,
      };
      let newFacilities;
      if (checked) {
        newFacilities = [...selectedFacilities, value];
      } else {
        newFacilities = selectedFacilities.filter(
          fac => fac.stationNo !== value.stationNo,
        );
      }
      setSelectedFacilities(newFacilities);
    },
    [appointmentsByFacility, selectedFacilities, setSelectedFacilities],
  );
  const getAppointmentsLabel = facility => {
    const apptCount = appointmentsByFacility[facility].length;
    const appointments = appointmentsByFacility[facility].map(
      appointment =>
        appointment.clinicStopCodeName
          ? ` ${appointment.clinicStopCodeName}`
          : ` ${t('VA-appointment')}`,
    );
    return `${apptCount} ${t('appointments', {
      count: apptCount,
    })}: ${appointments}`;
  };

  return (
    <div data-testid="multi-fac-context">
      <p>{t('if-youre-filing-only-mileage-no-other-file-all-claims-now')}</p>
      <va-checkbox-group
        data-testid="checkbox-group"
        error={error ? t('select-at-least-one-appointment') : ''}
        uswds
        class="vads-u-margin-top--0 vads-u-margin-bottom--4"
        label={t('select-the-appointments-you-want')}
      >
        {Object.keys(appointmentsByFacility).map(facility => (
          <VaCheckbox
            data-testid={`checkbox-${facility}`}
            key={facility}
            uswds
            tile
            value={facility}
            label={appointmentsByFacility[facility][0].facility}
            checkbox-description={getAppointmentsLabel(facility)}
            onVaChange={onCheck}
            checked={selectedFacilities.some(fac => fac.stationNo === facility)}
          />
        ))}
      </va-checkbox-group>
    </div>
  );
};

MultipleFacilityBody.propTypes = {
  appointmentsByFacility: PropTypes.object.isRequired,
  error: PropTypes.bool.isRequired,
  selectedFacilities: PropTypes.array.isRequired,
  setSelectedFacilities: PropTypes.func.isRequired,
};

export default MultipleFacilityBody;
