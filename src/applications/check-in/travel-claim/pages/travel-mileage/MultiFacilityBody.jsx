import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { VaCheckbox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useTranslation } from 'react-i18next';

const MultipleFacilityBody = props => {
  const {
    error,
    formatAppointment,
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
      const firstAppointment = appointments[0];
      const value = {
        stationNo: firstAppointment.stationNo,
        startTime: firstAppointment.startTime,
        multipleAppointments: appointments.length > 1,
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

  return (
    <div data-testid="multi-fac-context">
      <p>{t('if-youre-filing-only-mileage-no-other-file-all-claims-now')}</p>
      <va-checkbox-group
        data-testid="checkbox-group"
        error={error ? t('select-one-or-more-appointments') : ''}
        uswds
        class="vads-u-margin-top--0 vads-u-margin-bottom--4"
      >
        {Object.keys(appointmentsByFacility).map(facility => (
          <VaCheckbox
            data-testid={`checkbox-${facility}`}
            key={facility}
            uswds
            tile
            value={facility}
            label={appointmentsByFacility[facility][0].facility}
            checkbox-description={appointmentsByFacility[facility].map(
              appointment => ` ${formatAppointment(appointment)}`,
            )}
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
  formatAppointment: PropTypes.func.isRequired,
  selectedFacilities: PropTypes.array.isRequired,
  setSelectedFacilities: PropTypes.func.isRequired,
};

export default MultipleFacilityBody;
