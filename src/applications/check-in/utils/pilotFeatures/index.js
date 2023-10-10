import fileTravelClaimWilkesBarre from './fileTravelClaim/wilkesBarre.json';
// import salem from './travelClaim/salem.json';

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

const pilotFeatures = {
  fileTravelClaim: {
    pilotStations: {
      ...devStations(),
      ...fileTravelClaimWilkesBarre,
      // Week 1 658
      // ...fileTravelClaimSalem,
      // Week 2 565
      // ...fileTravelClaimFayetteville,
      // Week 3 558
      // ...fileTravelClaimDurham,
      // Week 4 652
      // ...fileTravelClaimHunterHolmes,
      // Week 5 590
      // ...fileTravelClaimHampton,
      // Week 6 659
      // ...fileTravelClaimSalisbury,
      // Week 7 637
      // ...fileTravelClaimAsheville,
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
  if (pilotFeature in pilotFeatures === false) {
    return false;
  }
  const featureList = pilotFeatures[pilotFeature].pilotStations;
  const passesClinic = () => {
    const hasClinicKey = 'clinics' in featureList[stationNo];
    if (!hasClinicKey) {
      return true;
    }
    const clinicsList = featureList[stationNo].clinics;

    return clinicsList.includes(clinicIen);
  };
  const stations = Object.keys(featureList);

  return stations.includes(stationNo) && passesClinic();
};

export { isInPilot };
