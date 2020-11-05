import { mapValues } from 'lodash/fp';
import caregiverFacilities from 'vets-json-schema/dist/caregiverProgramFacilities.json';
import { transformForSubmit } from 'platform/forms-system/src/js/helpers';
import {
  primaryCaregiverFields,
  secondaryCaregiverFields,
} from 'applications/caregivers/definitions/constants';

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
const medicalCentersByState = mapValues(
  val => val.map(center => center.code),
  caregiverFacilities,
);

// transforms forData to match fullSchema structure for backend submission
const submitTransform = (formConfig, form) => {
  // checks for optional chapters using ssnOrTin
  const hasSecondaryOne = form.data['view:hasSecondaryCaregiverOne']
    ? 'secondaryOne'
    : null;

  const hasSecondaryTwo = form.data['view:hasSecondaryCaregiverTwo']
    ? 'secondaryTwo'
    : null;

  // creates chapter objects by matching chapter prefixes
  const buildChapterSortedObject = (data, dataPrefix) => {
    // check to make sure there is a keyName
    if (dataPrefix === null) return {};
    const keys = Object.keys(data);

    // matches prefix to fullSchema chapter object labels/keys
    const getChapterName = key => {
      switch (key) {
        case 'veteran':
          return 'veteran';
        case 'primary':
          return 'primaryCaregiver';
        case 'secondaryOne':
          return 'secondaryCaregiverOne';
        case 'secondaryTwo':
          return 'secondaryCaregiverTwo';
        default:
          return null;
      }
    };

    const chapterName = getChapterName(dataPrefix);

    const sortedDataByChapter = {
      [chapterName]: {},
    };

    const lowerCaseFirstLetter = string =>
      string.charAt(0).toLowerCase() + string.slice(1);

    // maps over all keys, and creates objects of the same prefix then removes prefix
    keys.map(key => {
      // if has same prefix
      if (key.includes(dataPrefix)) {
        // if preferredFacility grab the nested "plannedClinic" value, and surface it
        if (key === 'veteranPreferredFacility') {
          sortedDataByChapter[chapterName] = {
            ...sortedDataByChapter[chapterName],
            plannedClinic: data[key].plannedClinic,
          };
        } else {
          // otherwise just remove the prefix, and populate chapter object
          const keyWithoutPrefix = lowerCaseFirstLetter(
            key.split(dataPrefix)[1],
          );
          sortedDataByChapter[chapterName] = {
            ...sortedDataByChapter[chapterName],
            [keyWithoutPrefix]: data[key],
          };
        }
      }

      // returning null due to "array-callback-return" eslint rule
      return null;
    });

    return sortedDataByChapter;
  };

  const remappedData = {
    ...form,
    data: {
      ...buildChapterSortedObject(form.data, 'veteran'),
      ...buildChapterSortedObject(form.data, 'primary'),
      ...buildChapterSortedObject(form.data, hasSecondaryOne),
      ...buildChapterSortedObject(form.data, hasSecondaryTwo),
    },
  };

  const formData = transformForSubmit(formConfig, remappedData);

  return JSON.stringify({
    caregiversAssistanceClaim: {
      form: formData,
    },
  });
};

const hasSecondaryCaregiverOne = formData =>
  formData[primaryCaregiverFields.hasSecondaryCaregiverOneView] === true;

const hasSecondaryCaregiverTwo = formData =>
  formData[
    secondaryCaregiverFields.secondaryOne.hasSecondaryCaregiverTwoView
  ] === true;

const isSSNUnique = formData => {
  const {
    veteranSsnOrTin,
    primarySsnOrTin,
    secondaryOneSsnOrTin,
    secondaryTwoSsnOrTin,
  } = formData;

  const allSSNs = [
    veteranSsnOrTin,
    primarySsnOrTin,
    secondaryOneSsnOrTin,
    secondaryTwoSsnOrTin,
  ];

  const allValidSSNs = allSSNs.filter(ssn => ssn !== undefined);

  const checkIfArrayIsUnique = array => array.length === new Set(array).size;

  return checkIfArrayIsUnique(allValidSSNs);
};

const validateSSNIsUnique = (errors, formData) => {
  if (!isSSNUnique(formData)) {
    errors.addError(
      "We're sorry. You've already entered this number elsewhere. Please check your data and try again.",
    );
  }
};

export const facilityNameMaxLength = (errors, formData) => {
  const facilityNameLength = formData.veteranLastTreatmentFacility.name?.length;
  if (facilityNameLength > 80) {
    errors.addError(
      "You've entered too many characters, please enter less than 80 characters.",
    );
  }
};

export {
  medicalCenterLabels,
  medicalCentersByState,
  submitTransform,
  hasSecondaryCaregiverOne,
  hasSecondaryCaregiverTwo,
  validateSSNIsUnique,
};
