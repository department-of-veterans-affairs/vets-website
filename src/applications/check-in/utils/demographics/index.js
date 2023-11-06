import { differenceInCalendarDays, sub } from 'date-fns';

// How often demgraphics have to be reviewed in days
const UPDATE_FREQUENCY = 7;

const isWithInDays = (days, date) => {
  const daysAgo = differenceInCalendarDays(Date.now(), date);
  return daysAgo <= days;
};

const upToDate = (needsUpdate, confirmedAt) => {
  const demoLastUpdated = confirmedAt
    ? new Date(confirmedAt)
    : sub(new Date(), { years: 99 }); // if none supplied make this always be not within the update frequency

  return (
    isWithInDays(UPDATE_FREQUENCY, demoLastUpdated) && needsUpdate === false
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

export { UPDATE_FREQUENCY, getDemographicsStatuses };
