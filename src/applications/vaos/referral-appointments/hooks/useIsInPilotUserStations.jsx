import { useSelector } from 'react-redux';
import { selectPatientFacilities } from '@department-of-veterans-affairs/platform-user/cerner-dsot/selectors';
import { selectFeatureCCDirectScheduling } from '../../redux/selectors';
import { getIsInPilotUserStations } from '../utils/pilot';

const emptyPatientFacilities = [];

const useIsInPilotUserStations = () => {
  const featureCCDirectScheduling = useSelector(
    selectFeatureCCDirectScheduling,
  );
  const patientFacilities = useSelector(selectPatientFacilities);

  return {
    isInPilotUserStations: getIsInPilotUserStations(
      featureCCDirectScheduling,
      patientFacilities || emptyPatientFacilities,
    ),
  };
};

export { useIsInPilotUserStations };
