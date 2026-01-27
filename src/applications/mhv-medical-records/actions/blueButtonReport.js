import { subYears, addMonths, startOfDay, endOfDay } from 'date-fns';
import {
  getLabsAndTests,
  getNotes,
  getVaccineList,
  getAcceleratedImmunizations,
  getAllergies,
  getConditions,
  getVitalsList,
  getMhvRadiologyTests,
  getMedications,
  getDemographicInfo,
  getMilitaryService,
  getPatient,
  getAppointments,
} from '../api/MrApi';
import { Actions } from '../util/actionTypes';
import { getAppointmentsDateRange } from '../util/helpers';

export const clearFailedList = domain => dispatch => {
  dispatch({ type: Actions.BlueButtonReport.CLEAR_FAILED, payload: domain });
};

export const getBlueButtonReportData = (
  options = {},
  dateFilter,
) => async dispatch => {
  const { isAcceleratingVaccines = false } = options;

  const vaccinesActionType = isAcceleratingVaccines
    ? Actions.Vaccines.GET_UNIFIED_LIST
    : Actions.Vaccines.GET_LIST;

  const fetchMap = {
    labsAndTests: getLabsAndTests,
    notes: getNotes,
    vaccines: isAcceleratingVaccines
      ? getAcceleratedImmunizations
      : getVaccineList,
    allergies: getAllergies,
    conditions: getConditions,
    vitals: getVitalsList,
    radiology: getMhvRadiologyTests,
    medications: getMedications,
    appointments: getAppointments,
    demographics: getDemographicInfo,
    militaryService: getMilitaryService,
    patient: getPatient,
  };

  const promises = Object.entries(fetchMap)
    .filter(([key]) => options[key]) // Only include enabled fetches
    .map(([key, fetchFn]) => {
      if (key === 'appointments') {
        const { startDate, endDate } = getAppointmentsDateRange(
          dateFilter.option === 'any' ? null : dateFilter.fromDate,
          dateFilter.option === 'any' ? null : dateFilter.toDate,
        );

        // Checking if selected date range is within the 2 years/13 months for appointments
        const now = new Date();
        const earliest = startOfDay(subYears(now, 2));
        const latest = endOfDay(addMonths(now, 13));
        if (
          dateFilter.option !== 'any' &&
          (new Date(dateFilter.toDate) < earliest ||
            latest < new Date(dateFilter.fromDate))
        ) {
          return {
            key: 'appointments',
            response: new Response([], { status: 200 }),
          };
        }

        return fetchFn(startDate, endDate)
          .then(response => {
            return { key, response };
          })
          .catch(error => {
            const newError = new Error(error);
            newError.key = key;
            throw newError;
          });
      }
      return fetchFn()
        .then(response => ({ key, response }))
        .catch(error => {
          const newError = new Error(error);
          newError.key = key;
          throw newError;
        });
    });

  const results = await Promise.allSettled(promises);

  // Temporary variables to hold labsAndTests and radiology results
  let labsAndTestsResponse = null;
  let radiologyResponse = null;

  results.forEach(({ status, value, reason }) => {
    if (status === 'fulfilled') {
      const { key, response } = value;
      switch (key) {
        case 'labsAndTests':
          labsAndTestsResponse = response;
          break;
        case 'radiology':
          radiologyResponse = response;
          break;
        case 'notes':
          dispatch({
            type: Actions.CareSummariesAndNotes.GET_LIST,
            response,
          });
          break;
        case 'vaccines':
          dispatch({
            type: vaccinesActionType,
            response,
          });
          break;
        case 'allergies':
          dispatch({
            type: Actions.Allergies.GET_LIST,
            response,
          });
          break;
        case 'conditions':
          dispatch({
            type: Actions.Conditions.GET_LIST,
            response,
          });
          break;
        case 'vitals':
          dispatch({
            type: Actions.Vitals.GET_LIST,
            response,
          });
          break;
        case 'medications':
        case 'appointments':
        case 'demographics':
        case 'militaryService':
        case 'patient':
          dispatch({
            type: Actions.BlueButtonReport.GET,
            [`${key}Response`]: response,
          });
          break;
        default:
          break;
      }
    } else {
      // Handle rejected promises
      const { key } = reason;
      dispatch({ type: Actions.BlueButtonReport.ADD_FAILED, payload: key });
    }
  });

  // Dispatch combined labsAndTests and radiology response
  if (labsAndTestsResponse || radiologyResponse) {
    dispatch({
      type: Actions.LabsAndTests.GET_LIST,
      labsAndTestsResponse,
      radiologyResponse,
    });
  }
};
