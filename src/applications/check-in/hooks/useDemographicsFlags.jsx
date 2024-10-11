import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { makeSelectCurrentContext, makeSelectForm } from '../selectors';

const useDemographicsFlags = () => {
  const selectCurrentContext = useMemo(makeSelectCurrentContext, []);
  const context = useSelector(selectCurrentContext);
  const { token } = context;

  const selectForm = useMemo(makeSelectForm, []);
  const { data } = useSelector(selectForm);

  // These will be undefined if pages are skipped in day-of. Default to 'yes'
  const {
    demographicsUpToDate,
    emergencyContactUpToDate,
    nextOfKinUpToDate,
  } = data;

  let demographicsData = {
    uuid: token,
  };

  if (demographicsUpToDate !== undefined)
    demographicsData = {
      ...demographicsData,
      demographicsUpToDate: demographicsUpToDate === 'yes',
    };
  if (emergencyContactUpToDate !== undefined)
    demographicsData = {
      ...demographicsData,
      emergencyContactUpToDate: emergencyContactUpToDate === 'yes',
    };
  if (nextOfKinUpToDate !== undefined)
    demographicsData = {
      ...demographicsData,
      nextOfKinUpToDate: nextOfKinUpToDate === 'yes',
    };

  const demographicsFlagsEmpty =
    demographicsUpToDate === undefined &&
    emergencyContactUpToDate === undefined &&
    nextOfKinUpToDate === undefined;
  return {
    demographicsData,
    demographicsFlagsEmpty,
  };
};

export { useDemographicsFlags };
