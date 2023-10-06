import wilkesBarre from './travelClaim/wilkesBarre.json';
import salem from './travelClaim/salem.json';

const devStations = (withDev = true, withStage = true, withLocal = true) => {
  const dev = {
    '500': {},
  };
  const stage = {
    '530': {},
  };
  const local = {
    '0001': {
      clinics: ['0001'],
    },
  };

  return {
    ...(withDev ? dev : {}),
    ...(withStage ? stage : {}),
    ...(withLocal ? local : {}),
  };
};

const pilotNames = {
  fileTravelClaim: {
    pilotStations: {
      ...devStations(),
      ...wilkesBarre,
      // Week 1 658
      ...salem,
      // Week 2 565
      // ...fayetteville,
      // Week 3 558
      // ...durham,
      // Week 4 652
      // ...hunterHolmes,
      // Week 5 590
      // ...hampton,
      // Week 6 659
      // ...salisbury,
      // Week 7 637
      // ...asheville,
      // Week 8
      // VISN 15
    },
  },
  fortyFiveMinuteText: {
    pilotStations: {
      ...devStations(),
    },
  },
};

/**
 * @param {Object} appointment
 * @param {string} pilotFeature
 * @returns {bool}
 * */

const isInPilot = ({ appointment, pilotFeature }) => {
  let { clinicIen, stationNo } = appointment;
  clinicIen = String(clinicIen);
  stationNo = String(stationNo);

  if (pilotFeature in pilotNames === false) {
    return false;
  }
  const featureList = pilotNames[pilotFeature].pilotStations;
  const passesClinic = () => {
    const hasClinic = 'clinics' in featureList[stationNo];
    if (!hasClinic) {
      return true;
    }
    const clinicsList = featureList[stationNo].clinics;

    return clinicsList.includes(clinicIen);
  };
  const stations = Object.keys(featureList);

  return stations.includes(stationNo) && passesClinic();
};

export { isInPilot };
