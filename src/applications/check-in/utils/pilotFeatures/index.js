import fileTravelClaimWilkesBarre from './fileTravelClaim/wilkesBarre.json';
import fileTravelClaimVisnFifteen from './fileTravelClaim/visnFifteen.json';
import fortyFiveMinuteTextVisnFifteen from './fortyFiveMinuteText/visnFifteen.json';

const devStations = {
  // Dev
  '500': {},
  // Stage
  '530': {},
  // Local
  '0001': {
    clinics: ['0001'],
  },
};

const pilotFeatures = {
  fileTravelClaim: {
    pilotStations: {
      ...devStations,
      ...fileTravelClaimWilkesBarre,
      ...fileTravelClaimVisnFifteen,
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
    },
  },
  fortyFiveMinuteText: {
    pilotStations: {
      ...devStations,
      ...fortyFiveMinuteTextVisnFifteen,
    },
  },
};

/**
 * @param {object} station
 * @param {string} clinicIen
 * @returns {bool}
 * */

const clinicCheck = (station, clinicIen) => {
  const hasClinicKey = 'clinics' in station;
  if (!hasClinicKey) {
    return true;
  }
  const clinicsList = station.clinics;

  return clinicsList.includes(clinicIen);
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

  if (stationNo in featureList === false) {
    return false;
  }

  const passesClinic = clinicCheck(featureList[stationNo], clinicIen);

  const stations = Object.keys(featureList);

  return stations.includes(stationNo) && passesClinic;
};

export { isInPilot };
