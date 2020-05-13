import _ from 'lodash/fp';
import caregiverFacilities from 'vets-json-schema/dist/caregiverProgramFacilities.json';

// Merges all the state facilities into one object with values as keys
// and labels as values
export const medicalCenterLabels = Object.keys(caregiverFacilities).reduce(
  (labels, state) => {
    const stateLabels = caregiverFacilities[state].reduce(
      (centers, center) =>
        Object.assign(centers, {
          [center.code]: center.label,
        }),
      {},
    );

    return Object.assign(labels, stateLabels);
  },
  {},
);

// Turns the facility list for each state into an array of strings
export const medicalCentersByState = _.mapValues(
  val => val.map(center => center.code),
  caregiverFacilities,
);
