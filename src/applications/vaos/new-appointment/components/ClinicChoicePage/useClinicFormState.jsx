import { useSelector } from 'react-redux';
import { VaRadioField } from '@department-of-veterans-affairs/platform-forms-system/web-component-fields';
import useFormState from '../../../hooks/useFormState';
import { getSiteIdFromFacilityId } from '../../../services/location';
import { getClinicId } from '../../../services/healthcare-service';

import {
  getClinicsForChosenFacility,
  getFormData,
  getTypeOfCare,
  selectChosenFacilityInfo,
  selectPastAppointments,
} from '../../redux/selectors';
import { TYPE_OF_CARE_IDS } from '../../../utils/constants';
import { selectFeatureMentalHealthHistoryFiltering } from '../../../redux/selectors';

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

export default function useClinicFormState(pageTitle) {
  const initialData = useSelector(getFormData);
  const location = useSelector(selectChosenFacilityInfo);

  const selectedTypeOfCare = getTypeOfCare(initialData);
  const clinics = useSelector(getClinicsForChosenFacility);
  const pastAppointments = useSelector(selectPastAppointments);

  // Retrieves flipper state for mental health history filtering
  const usePastVisitMHFilter = useSelector(
    selectFeatureMentalHealthHistoryFiltering,
  );

  // filter the clinics based on Direct Scheduling value from VATS
  // v2 uses boolean while v0 uses Y/N string
  let filteredClinics = clinics.filter(
    clinic => clinic.patientDirectScheduling === true,
  );

  // Past appointment history check
  // primary care and mental health are exempt
  // NOTE: Same check is in ../services/patient/index.js:fetchFlowEligibilityAndClinics
  const isCheckTypeOfCare =
    (initialData.typeOfCareId !== TYPE_OF_CARE_IDS.MENTAL_HEALTH ||
      usePastVisitMHFilter) &&
    initialData.typeOfCareId !== TYPE_OF_CARE_IDS.PRIMARY_CARE &&
    location?.legacyVAR?.settings?.[selectedTypeOfCare.id]?.direct
      ?.patientHistoryRequired === true;
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
      'ui:widget': 'radio', // Required
      'ui:webComponentField': VaRadioField,
      'ui:options': {
        classNames: 'vads-u-margin-top--neg2',
        showFieldLabel: false,
        ...(filteredClinics.length > 1 && { labelHeaderLevel: '1' }),
      },
    },
  };

  const formState = useFormState({
    initialSchema() {
      let newSchema = initialSchema;

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

  return {
    ...formState,
    firstMatchingClinic: clinics?.find(
      clinic => clinic.id === formState.schema?.properties.clinicId.enum[0],
    ),
  };
}
