import { camelCase, isEmpty, omit } from 'lodash';
import { transformForSubmit } from 'platform/forms-system/src/js/helpers';

const submitTransformer = (formConfig, form) => {
  const { data: formData } = form;
  const primaryKey = formData['view:hasPrimaryCaregiver'] ? 'primary' : null;
  const SecondaryOneKey = formData['view:hasSecondaryCaregiverOne']
    ? 'secondaryOne'
    : null;
  const SecondaryTwoKey = formData['view:hasSecondaryCaregiverTwo']
    ? 'secondaryTwo'
    : null;

  if (formData['view:useFacilitiesAPI']) {
    const plannedClinicId = formData['view:plannedClinic'].caregiverSupport.id
      .split('_')
      .pop();

    formData.veteranPlannedClinic = plannedClinicId;
  }

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
      return keyMap[key];
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
      ...buildChapterSortedObject(primaryKey),
      ...buildChapterSortedObject(SecondaryOneKey),
      ...buildChapterSortedObject(SecondaryTwoKey),
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

export default submitTransformer;
