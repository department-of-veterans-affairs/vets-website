import { useSelector } from 'react-redux';
import useFormState from '../../../hooks/useFormState';
import { getClinicId } from '../../../services/healthcare-service';
import { getSiteIdFromFacilityId } from '../../../services/location';

import { selectFeatureMentalHealthHistoryFiltering } from '../../../redux/selectors';
import {
  getClinicsForChosenFacility,
  getFormData,
  getTypeOfCare,
  selectPastAppointments,
} from '../../redux/selectors';
import AppointmentsRadioWidget from '../AppointmentsRadioWidget';
import { typeOfCareRequiresPastHistory } from '../../../services/patient';

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

export default function useClinicFormState(pageTitle, singleClinicTitlePrefix) {
  const initialData = useSelector(getFormData);
  const selectedTypeOfCare = getTypeOfCare(initialData);

  const clinics = useSelector(getClinicsForChosenFacility);
  const pastAppointments = useSelector(selectPastAppointments);

  // Retrieves flipper state for mental health history filtering
  const featurePastVisitMHFilter = useSelector(
    selectFeatureMentalHealthHistoryFiltering,
  );

  // filter the clinics based on Direct Scheduling value from VATS
  // v2 uses boolean while v0 uses Y/N string
  let filteredClinics = clinics.filter(
    clinic => clinic.patientDirectScheduling === true,
  );

  // Past appointment history check
  // primary care and mental health (with flipper) and SUD are exempt
  // NOTE: Same check is in ../services/patient/index.js:fetchFlowEligibilityAndClinics
  const isCheckTypeOfCare = typeOfCareRequiresPastHistory(
    selectedTypeOfCare.id,
    featurePastVisitMHFilter,
  );

  if (isCheckTypeOfCare) {
    const pastAppointmentDateMap = new Map();
    const siteId = getSiteIdFromFacilityId(initialData.vaFacility);

    pastAppointments.forEach(appt => {
      const apptTime = appt.version === 2 ? appt.start : appt.startDate;
      const clinicId =
        appt.version === 2 ? appt.location.clinicId : appt.clinicId;
      const facilityId =
        appt.version === 2 ? appt.location.vistaId : appt.facilityId;
      const latestApptTime = pastAppointmentDateMap.get(clinicId);
      if (
        // Remove parse function when converting the past appointment call to FHIR service
        facilityId === siteId &&
        (!latestApptTime || latestApptTime > apptTime)
      ) {
        pastAppointmentDateMap.set(clinicId, apptTime);
      }
    });
    // filter clinic where past appts contains clinicId
    filteredClinics = filteredClinics.filter(clinic =>
      pastAppointmentDateMap.has(getClinicId(clinic)),
    );
  }

  const uiSchema = {
    clinicId: {
      'ui:widget': AppointmentsRadioWidget,
      'ui:options': {
        classNames: 'vads-u-margin-top--neg2',
        hideLabelText: filteredClinics.length > 1,
      },
    },
  };

  return useFormState({
    initialSchema() {
      let newSchema = initialSchema;

      if (filteredClinics.length === 1) {
        const clinic = filteredClinics[0];
        newSchema = {
          ...newSchema,
          properties: {
            clinicId: {
              type: 'string',
              title: `${singleClinicTitlePrefix} ${
                clinic.serviceName
              }. Do you you want to schedule your appointment at this clinic?`,
              enum: [clinic.id, 'NONE'],
              enumNames: [
                `Yes, make my appointment at ${clinic.serviceName}`,
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
              title: pageTitle,
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
}
