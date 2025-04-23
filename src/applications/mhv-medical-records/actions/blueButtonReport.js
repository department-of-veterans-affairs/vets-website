import { formatISO, subYears, addMonths } from 'date-fns';
import {
  getLabsAndTests,
  getNotes,
  getVaccineList,
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

export const clearFailedList = domain => dispatch => {
  dispatch({ type: Actions.BlueButtonReport.CLEAR_FAILED, payload: domain });
};

export const getBlueButtonReportData = (
  options = {},
  dateFilter,
) => async dispatch => {
  const fetchMap = {
    labsAndTests: getLabsAndTests,
    notes: getNotes,
    vaccines: getVaccineList,
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
        let fromDate;
        let toDate;
        const currentDate = new Date();
        if (dateFilter.option === 'any') {
          // Set fromDate to be two years in the past
          const dateTwoYearsAgo = subYears(currentDate, 2);
          // Set toDate to be 13 months in the future
          const dateThirteenMonthsAhead = addMonths(currentDate, 13);
          fromDate = formatISO(dateTwoYearsAgo);
          toDate = formatISO(dateThirteenMonthsAhead);
        } else {
          // Use the provided dates but clamp them to allowed boundaries
          let providedFromDate = new Date(dateFilter.fromDate);
          let providedToDate = new Date(dateFilter.toDate);
          const earliestAllowedFromDate = subYears(currentDate, 2);
          const latestAllowedToDate = addMonths(currentDate, 13);
          if (providedFromDate < earliestAllowedFromDate) {
            providedFromDate = earliestAllowedFromDate;
          }
          if (providedToDate > latestAllowedToDate) {
            providedToDate = latestAllowedToDate;
          }
          fromDate = formatISO(providedFromDate);
          toDate = formatISO(providedToDate);
        }

        return fetchFn(fromDate, toDate)
          .then(response => ({ key, response }))
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
            type: Actions.Vaccines.GET_LIST,
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
