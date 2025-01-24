import { useSelector } from 'react-redux';
import { selectPatientFacilities } from '@department-of-veterans-affairs/platform-user/cerner-dsot/selectors';
import { selectFeatureCCDirectScheduling } from '../../redux/selectors';
import { getIsInCCPilot } from '../utils/pilot';

const useIsInCCPilot = () => {
  const featureCCDirectScheduling = useSelector(
    selectFeatureCCDirectScheduling,
  );
  const patentFacilities = useSelector(selectPatientFacilities);

  return {
    isInCCPilot: getIsInCCPilot(
      featureCCDirectScheduling,
      patentFacilities || [],
    ),
  };
};

export { useIsInCCPilot };
