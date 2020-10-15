import vaMedicalFacilities from 'vets-json-schema/dist/vaMedicalFacilities.json';

// Merges all the state facilities into one object with values as keys
// and labels as values.
// For example, with input:
// {
//   "VT": [
//     {
//       "value": "405HK",
//       "label": "WHITE RIVER JUNCTION MORC"
//     },
//     {
//       "value": "405GA",
//       "label": "Bennington VA Clinic"
//     }
//   ]
// }
// will return:
// {
//   "405HK": "WHITE RIVER JUNCTION MORC",
//   "405GA": "Bennington VA Clinic"
// }
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

/**
 *
 * @param {string} facilityId - facility id in the form: `'123 - ABCD'` or
 * `'123F'` where the id to look up is the first part of the string
 * @returns {string} - either the actual name of the medical center or the
 * passed in id if no match was found
 */
export function getMedicalCenterNameByID(facilityId) {
  if (!facilityId || typeof facilityId !== 'string') {
    return '';
  }
  const [id] = facilityId.split(' - ');
  return medicalCenterLabels[id] || facilityId;
}
