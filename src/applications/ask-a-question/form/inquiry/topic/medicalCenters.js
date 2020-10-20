import { vaMedicalFacilities } from 'vets-json-schema/dist/constants.json';
import _ from 'lodash/fp';

function getAllMedicalCenters() {
  const medicalCenters = [];
  Object.values(vaMedicalFacilities).forEach(state =>
    state.map(facility => medicalCenters.push(facility)),
  );
  return _.sortBy(['label'], medicalCenters);
}

const vaMedicalCentersList = getAllMedicalCenters();
export const vaMedicalCentersValues = vaMedicalCentersList.map(
  center => center.value,
);
export const vaMedicalCentersLabels = vaMedicalCentersList.map(
  center => center.label,
);
