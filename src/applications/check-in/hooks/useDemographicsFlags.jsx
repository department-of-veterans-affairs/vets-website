import { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { makeSelectCurrentContext, makeSelectForm } from '../selectors';

const useDemographicsFlags = () => {
  const [demographicsFlagsSent, setDemographicsFlagsSent] = useState(false);

  const selectCurrentContext = useMemo(makeSelectCurrentContext, []);
  const context = useSelector(selectCurrentContext);
  const { token } = context;

  const selectForm = useMemo(makeSelectForm, []);
  const { data } = useSelector(selectForm);

  // These will be undefined if pages are skipped in day-of. Default to 'yes'
  const {
    demographicsUpToDate = null,
    emergencyContactUpToDate = null,
    nextOfKinUpToDate = null,
  } = data;

  const demographicsData = {
    uuid: token,
  };

  if (demographicsUpToDate)
    demographicsData.demographicsUpToDate = demographicsUpToDate === 'yes';
  if (emergencyContactUpToDate)
    demographicsData.emergencyContactUpToDate =
      emergencyContactUpToDate === 'yes';
  if (nextOfKinUpToDate)
    demographicsData.nextOfKinUpToDate = nextOfKinUpToDate === 'yes';

  return { demographicsData, demographicsFlagsSent, setDemographicsFlagsSent };
};

export { useDemographicsFlags };
