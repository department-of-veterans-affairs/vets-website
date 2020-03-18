import _ from 'lodash/fp';
import vaMedicalFacilities from 'vets-json-schema/dist/vaMedicalFacilities.json';

// Merges all the state facilities into one object with values as keys
// and labels as values
export const medicalCenterLabels = Object.keys(vaMedicalFacilities).reduce(
  (labels, state) => {
    const stateLabels = vaMedicalFacilities[state].reduce(
      (centers, center) =>
        Object.assign(centers, {
          [center.value]: center.label,
        }),
      {},
    );

    return Object.assign(labels, stateLabels);
  },
  {},
);

// Turns the facility list for each state into an array of strings
export const medicalCentersByState = _.mapValues(
  val => val.map(center => center.value),
  vaMedicalFacilities,
);
