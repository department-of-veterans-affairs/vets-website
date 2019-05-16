import get from '../../../../platform/utilities/data/get';
import set from '../../../../platform/utilities/data/set';
import { capitalizeEachWord, sippableId } from '../utils';

// As seen in createCheckboxSchema, the property name in the
// treatedDisabilityNames object will take this form
const propertyName = name => capitalizeEachWord(name).toLowerCase();

function addDisabilityUUID(savedData) {
  const { formData } = savedData;
  const uuidMap = new Map();
  let newData = formData;

  // Add a uuid to each rated disability
  const rated = get('ratedDisabilities', formData);
  if (rated) {
    newData = set(
      'ratedDisabilities',
      rated.map(r => {
        const id = sippableId();
        uuidMap.set(propertyName(r.name), id);
        return set('uuid', id, r);
      }),
      newData,
    );
  }

  // Add a uuid to each new disability
  const newDisabilities = get('newDisabilities', formData);
  if (newDisabilities) {
    newData = set(
      'newDisabilities',
      newDisabilities.map(n => {
        const id = sippableId();
        uuidMap.set(propertyName(n.condition), id);
        return set('uuid', id, n);
      }),
      newData,
    );
  }

  // Associate each `treatedDisabilityName` in each
  // `vaTreatmentFacilities` with the appropriate uuid
  const facilities = get('vaTreatmentFacilities', formData);
  if (facilities) {
    newData = set(
      'vaTreatmentFacilities',
      facilities.map(f => {
        const newNames = {};
        Object.entries(f.treatedDisabilityNames || {}).forEach(
          ([name, value]) => {
            newNames[uuidMap.get(name)] = value;
          },
        );
        return set('treatedDisabilityNames', newNames, f);
      }),
      newData,
    );
  }

  return set('formData', newData, savedData);
}

export default addDisabilityUUID;
