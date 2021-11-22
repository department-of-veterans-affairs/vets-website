import constants from 'vets-json-schema/dist/constants.json';
import sortBy from 'lodash/sortBy';

function getAllMedicalCenters() {
  const medicalCenters = [];
  Object.values(constants.vaMedicalFacilities).forEach(state =>
    state.map(facility => medicalCenters.push(facility)),
  );

  return sortBy(medicalCenters, ['label']);
}

const vaMedicalCentersList = getAllMedicalCenters();
export const vaMedicalCentersValues = vaMedicalCentersList.map(
  center => center.value,
);
export const vaMedicalCentersLabels = vaMedicalCentersList.map(
  center => center.label,
);
