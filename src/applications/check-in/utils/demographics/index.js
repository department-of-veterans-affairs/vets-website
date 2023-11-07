import { differenceInCalendarDays, sub } from 'date-fns';
import { DEMOGRAPHICS_UPDATE_FREQUENCY } from '../appConstants';

const isWithInDays = (days, date) => {
  const daysAgo = differenceInCalendarDays(Date.now(), date);
  return daysAgo <= days;
};

const upToDate = (needsUpdate, confirmedAt) => {
  const demoLastUpdated = confirmedAt
    ? new Date(confirmedAt)
    : sub(new Date(), { days: DEMOGRAPHICS_UPDATE_FREQUENCY + 1 }); // if none supplied make this always be not within the update frequency

  return (
    isWithInDays(DEMOGRAPHICS_UPDATE_FREQUENCY, demoLastUpdated) &&
    needsUpdate === false
  );
};

const getDemographicsStatuses = patientDemographicsStatus => {
  const {
    demographicsNeedsUpdate,
    demographicsConfirmedAt,
    nextOfKinNeedsUpdate,
    nextOfKinConfirmedAt,
    emergencyContactNeedsUpdate,
    emergencyContactConfirmedAt,
  } = patientDemographicsStatus;

  return {
    demographicsUpToDate: upToDate(
      demographicsNeedsUpdate,
      demographicsConfirmedAt,
    ),
    nextOfKinUpToDate: upToDate(nextOfKinNeedsUpdate, nextOfKinConfirmedAt),
    emergencyContactUpToDate: upToDate(
      emergencyContactNeedsUpdate,
      emergencyContactConfirmedAt,
    ),
  };
};

export { getDemographicsStatuses };
