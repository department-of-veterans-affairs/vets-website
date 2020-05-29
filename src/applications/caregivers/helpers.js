import _ from 'lodash/fp';
import caregiverFacilities from 'vets-json-schema/dist/caregiverProgramFacilities.json';
import { transformForSubmit } from 'platform/forms-system/src/js/helpers';

// Merges all the state facilities into one object with values as keys
// and labels as values
const medicalCenterLabels = Object.keys(caregiverFacilities).reduce(
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
const medicalCentersByState = _.mapValues(
  val => val.map(center => center.code),
  caregiverFacilities,
);

const submitTransform = (formConfig, form) => {
  console.log('raw data', form.data);

  const makeObject = (data, keyName) => {
    const keys = Object.keys(data);

    const getObjKey = key => {
      switch (key) {
        case 'veteran':
          return 'veteran';
        case 'primary':
          return 'primaryCaregiver';
        case 'secondaryOne':
          return 'veteran';
        case 'secondaryTwo ':
          return 'veteran';
        default:
          return null;
      }
    };

    let objName = getObjKey(keyName);

    const newObj = {
      [objName]: {},
    };

    const lowerCaseFirstLetter = string =>
      string.charAt(0).toLowerCase() + string.slice(1);

    keys.map(key => {
      if (key.includes(keyName)) {
        const keyWithoutPrefix = lowerCaseFirstLetter(key.split(keyName)[1]);
        objName = { ...newObj, [keyWithoutPrefix]: data[key] };
      }

      return null;
    });

    return newObj;
  };

  const remappedData = {
    ...form,
    data: {
      ...makeObject(form.data, 'veteran'),
      ...makeObject(form.data, 'primary'),
    },
  };

  console.log('remappedData', remappedData);

  const formData = transformForSubmit(formConfig, remappedData);
  console.log('formData', formData);

  return JSON.stringify({
    caregiversAssistanceClaim: {
      form: formData,
    },
  });
};

export { medicalCenterLabels, medicalCentersByState, submitTransform };
