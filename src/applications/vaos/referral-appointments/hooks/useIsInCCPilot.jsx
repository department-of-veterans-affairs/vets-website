import { useSelector } from 'react-redux';
import { selectPatientFacilities } from '@department-of-veterans-affairs/platform-user/cerner-dsot/selectors';
import { selectFeatureCCDirectScheduling } from '../../redux/selectors';

const useIsInCCPilot = () => {
  let isInCCPilot = false;
  const pilotStations = ['984', '983'];
  const featureCCDirectScheduling = useSelector(
    selectFeatureCCDirectScheduling,
  );
  const patentFacilities = useSelector(selectPatientFacilities);

  if (featureCCDirectScheduling) {
    isInCCPilot = patentFacilities.some(station =>
      pilotStations.includes(station.facilityId),
    );
  }

  return { isInCCPilot };
};

export { useIsInCCPilot };
