import { camelCase, isEmpty, omit } from 'lodash';
import { transformForSubmit } from 'platform/forms-system/src/js/helpers';

// transforms form data to match fullSchema structure for backend submission
export const submitTransform = (formConfig, form) => {
  const { data: formData } = form;
  const hasPrimary = formData['view:hasPrimaryCaregiver'] ? 'primary' : null;
  const hasSecondaryOne = formData['view:hasSecondaryCaregiverOne']
    ? 'secondaryOne'
    : null;
  const hasSecondaryTwo = formData['view:hasSecondaryCaregiverTwo']
    ? 'secondaryTwo'
    : null;

  // creates chapter objects by matching chapter prefixes
  const buildChapterSortedObject = dataPrefix => {
    // check to make sure there is a keyName
    if (dataPrefix === null) return {};

    // matches prefix to fullSchema chapter object labels/keys
    const getChapterName = key => {
      const keyMap = {
        veteran: 'veteran',
        primary: 'primaryCaregiver',
        secondaryOne: 'secondaryCaregiverOne',
        secondaryTwo: 'secondaryCaregiverTwo',
      };
      return keyMap[key] || null;
    };

    const dataKeys = Object.keys(formData).filter(k => k.includes(dataPrefix));
    const chapterName = getChapterName(dataPrefix);
    const dataToReturn = dataKeys.reduce((acc, key) => {
      const keyWithoutPrefix = camelCase(key.split(dataPrefix)[1]);

      // map the home address to the mailing address, if applicable
      if (key.includes('HomeSameAsMailingAddress')) {
        if (formData[key]) {
          acc.mailingAddress = omit(
            formData[`${dataPrefix}Address`],
            'country',
          );
        }
        return acc;
      }

      // omit country from address fields, if applicable
      if (key.endsWith('Address')) {
        acc[keyWithoutPrefix] = omit(formData[key], 'country');
        return acc;
      }

      // otherwise just populate form data
      acc[keyWithoutPrefix] = formData[key];
      return acc;
    }, {});

    return {
      [chapterName]: dataToReturn,
    };
  };

  // map the form data related to signing as representative
  const buildRespresentativeData = () => {
    const {
      signAsRepresentativeYesNo,
      signAsRepresentativeDocumentUpload,
    } = formData;
    const signAsRepresentative = signAsRepresentativeYesNo === 'yes';
    const dataToReturn = { signAsRepresentative };

    if (!isEmpty(signAsRepresentativeDocumentUpload) && signAsRepresentative) {
      dataToReturn.poaAttachmentId = signAsRepresentativeDocumentUpload[0].guid;
    }

    return dataToReturn;
  };

  const remappedData = {
    ...form,
    data: {
      ...buildChapterSortedObject('veteran'),
      ...buildChapterSortedObject(hasPrimary),
      ...buildChapterSortedObject(hasSecondaryOne),
      ...buildChapterSortedObject(hasSecondaryTwo),
      ...buildRespresentativeData(),
    },
  };

  const dataToSubmit = transformForSubmit(formConfig, remappedData);

  return JSON.stringify({
    caregiversAssistanceClaim: {
      form: dataToSubmit,
    },
  });
};

export const hasPrimaryCaregiver = formData => {
  return formData['view:hasPrimaryCaregiver'] === true;
};

export const hasSecondaryCaregiverOne = formData =>
  formData['view:hasSecondaryCaregiverOne'] === true;

export const hasSecondaryCaregiverTwo = formData =>
  formData['view:hasSecondaryCaregiverTwo'] === true;

export const isSsnUnique = formData => {
  const {
    veteranSsnOrTin,
    primarySsnOrTin,
    secondaryOneSsnOrTin,
    secondaryTwoSsnOrTin,
  } = formData;

  const checkIfPartyIsPresent = (comparator, data) => {
    return comparator(formData) ? data : undefined;
  };

  const presentPrimarySsn = checkIfPartyIsPresent(
    hasPrimaryCaregiver,
    primarySsnOrTin,
  );

  const presentSecondaryOneSsn = checkIfPartyIsPresent(
    hasSecondaryCaregiverOne,
    secondaryOneSsnOrTin,
  );

  const presentSecondaryTwoSsn = checkIfPartyIsPresent(
    hasSecondaryCaregiverTwo,
    secondaryTwoSsnOrTin,
  );

  const allSSNs = [
    veteranSsnOrTin,
    presentPrimarySsn,
    presentSecondaryOneSsn,
    presentSecondaryTwoSsn,
  ];

  const allValidSSNs = allSSNs.filter(ssn => ssn !== undefined);

  const checkIfArrayIsUnique = array => array.length === new Set(array).size;

  return checkIfArrayIsUnique(allValidSSNs);
};

export const hideCaregiverRequiredAlert = formData => {
  const hasPrimary = hasPrimaryCaregiver(formData);
  const hasSecondary = hasSecondaryCaregiverOne(formData);
  const isSecondaryOneUndefined =
    formData['view:hasSecondaryCaregiverOne'] === undefined;
  return hasPrimary || hasSecondary || isSecondaryOneUndefined;
};

export const hideUploadWarningAlert = formData => {
  const { signAsRepresentativeDocumentUpload: upload } = formData;
  const hasDocument = upload?.length;

  if (!hasDocument) return false;

  const { guid, name, errorMessage } = upload[0];
  return !(guid && name && !errorMessage);
};

/**
 * Helper that builds a full name string based on provided input values
 * @param {Object} name - the object that stores all the available input values
 * @param {Boolean} outputMiddle - optional param to declare whether to output
 * the middle name as part of the returned string
 * @returns {String} - the name string with all extra whitespace removed
 */
export const normalizeFullName = (name = {}, outputMiddle = false) => {
  const { first = '', middle = '', last = '', suffix = '' } = name;
  const nameToReturn = outputMiddle
    ? `${first} ${middle !== null ? middle : ''} ${last} ${suffix}`
    : `${first} ${last} ${suffix}`;
  return nameToReturn.replace(/ +(?= )/g, '').trim();
};

/**
 * Helper that replaces specified parts of a string with a dynamic value
 * @param {String} src - the original string to parse
 * @param {String} val - the value to input into the new string
 * @param {String} char - the value to be replaced in the original string
 * @returns {String} - the new string with all replaced values
 */
export const replaceStrValues = (src, val, char = '%s') => {
  return src && val ? src.toString().replace(char, val) : '';
};

// form config specific helpers
export const primaryHasDifferentMailingAddress = formData => {
  const hasCaregiver = hasPrimaryCaregiver(formData);
  const hasDifferentMailingAddress =
    formData['view:primaryHomeSameAsMailingAddress'] === false;
  return hasCaregiver && hasDifferentMailingAddress;
};

export const secondaryOneHasDifferentMailingAddress = formData => {
  const hasCaregiver = hasSecondaryCaregiverOne(formData);
  const hasDifferentMailingAddress =
    formData['view:secondaryOneHomeSameAsMailingAddress'] === false;
  return hasCaregiver && hasDifferentMailingAddress;
};

export const secondaryTwoHasDifferentMailingAddress = formData => {
  const hasCaregiver = hasSecondaryCaregiverTwo(formData);
  const hasDifferentMailingAddress =
    formData['view:secondaryTwoHomeSameAsMailingAddress'] === false;
  return hasCaregiver && hasDifferentMailingAddress;
};
