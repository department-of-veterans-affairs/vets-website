import { useSelector } from 'react-redux';
import { selectPatientFacilities } from '@department-of-veterans-affairs/platform-user/cerner-dsot/selectors';
import { selectFeatureCCDirectScheduling } from '../../redux/selectors';
import { getIsInCCPilot } from '../utils/pilot';

const emptyPatientFacilities = [];

const useIsInCCPilot = () => {
  const featureCCDirectScheduling = useSelector(
    selectFeatureCCDirectScheduling,
  );
  const patientFacilities = useSelector(selectPatientFacilities);

  return {
    isInCCPilot: getIsInCCPilot(
      featureCCDirectScheduling,
      patientFacilities || emptyPatientFacilities,
    ),
  };
};

export { useIsInCCPilot };
