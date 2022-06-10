import { useSelector } from 'react-redux';
import useFormState from '../../../hooks/useFormState';
import { getSiteIdFromFacilityId } from '../../../services/location';
import { getClinicId } from '../../../services/healthcare-service';

import {
  getClinicsForChosenFacility,
  getFormData,
  selectPastAppointments,
} from '../../redux/selectors';

const initialSchema = {
  type: 'object',
  required: ['clinicId'],
  properties: {
    clinicId: {
      type: 'string',
      enum: [],
    },
  },
};
const uiSchema = {
  clinicId: {
    'ui:widget': 'radio',
  },
};

export default function useClinicFormState() {
  const initialData = useSelector(getFormData);
  const clinics = useSelector(getClinicsForChosenFacility);
  const pastAppointments = useSelector(selectPastAppointments);

  const formState = useFormState({
    initialSchema() {
      let newSchema = initialSchema;
      let filteredClinics = clinics;

      if (pastAppointments) {
        const pastAppointmentDateMap = new Map();
        const siteId = getSiteIdFromFacilityId(initialData.vaFacility);

        pastAppointments.forEach(appt => {
          const apptTime = appt.version === 2 ? appt.start : appt.startDate;
          const clinicId =
            appt.version === 2 ? appt.location.clinicId : appt.clinicId;
          const facilityId =
            appt.version === 2 ? appt.location.stationId : appt.facilityId;
          const latestApptTime = pastAppointmentDateMap.get(clinicId);
          if (
            // Remove parse function when converting the past appointment call to FHIR service
            facilityId === siteId &&
            (!latestApptTime || latestApptTime > apptTime)
          ) {
            pastAppointmentDateMap.set(clinicId, apptTime);
          }
        });

        filteredClinics = clinics.filter(clinic =>
          // Get clinic portion of id
          pastAppointmentDateMap.has(getClinicId(clinic)),
        );
      }

      if (filteredClinics.length === 1) {
        const clinic = filteredClinics[0];
        newSchema = {
          ...newSchema,
          properties: {
            clinicId: {
              type: 'string',
              title: `Would you like to make an appointment at ${
                clinic.serviceName
              }?`,
              enum: [clinic.id, 'NONE'],
              enumNames: [
                'Yes, make my appointment here',
                'No, I need a different clinic',
              ],
            },
          },
        };
      } else {
        newSchema = {
          ...newSchema,
          properties: {
            clinicId: {
              type: 'string',
              title:
                'Choose a clinic below or request a different clinic for this appointment.',
              enum: filteredClinics.map(clinic => clinic.id).concat('NONE'),
              enumNames: filteredClinics
                .map(clinic => clinic.serviceName)
                .concat('I need a different clinic'),
            },
          },
        };
      }

      return newSchema;
    },
    uiSchema,
    initialData,
  });

  return {
    ...formState,
    firstMatchingClinic: clinics?.find(
      clinic => clinic.id === formState.schema?.properties.clinicId.enum[0],
    ),
  };
}
