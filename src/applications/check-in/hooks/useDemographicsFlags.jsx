import { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { makeSelectCurrentContext, makeSelectForm } from '../selectors';

const useDemographicsFlags = (defaultValue = false) => {
  const [demographicsFlagsSent, setDemographicsFlagsSent] = useState(false);

  const selectCurrentContext = useMemo(makeSelectCurrentContext, []);
  const context = useSelector(selectCurrentContext);
  const { token } = context;

  const selectForm = useMemo(makeSelectForm, []);
  const { data } = useSelector(selectForm);

  // These will be undefined if pages are skipped in day-of. Default to 'yes'
  const {
    demographicsUpToDate = defaultValue ? 'yes' : 'no',
    emergencyContactUpToDate = defaultValue ? 'yes' : 'no',
    nextOfKinUpToDate = defaultValue ? 'yes' : 'no',
  } = data;

  const demographicsData = {
    uuid: token,
    demographicsUpToDate: demographicsUpToDate === 'yes',
    emergencyContactUpToDate: emergencyContactUpToDate === 'yes',
    nextOfKinUpToDate: nextOfKinUpToDate === 'yes',
  };

  return { demographicsData, demographicsFlagsSent, setDemographicsFlagsSent };
};

export { useDemographicsFlags };
