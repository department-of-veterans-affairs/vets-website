import _ from 'lodash';
import { transformForSubmit } from 'platform/forms-system/src/js/helpers';
import { dateSigned } from '../helpers';

export function transform(formConfig, form) {
  const addressTransform = formData => {
    let clonedData = _.cloneDeep(formData);
    delete clonedData.institutionDetails.loader;

    clonedData = {
      ...clonedData,
      institutionDetails: {
        ...clonedData.institutionDetails,
      },
    };
    return clonedData;
  };

  const cleanUpTransform = formData => {
    let clonedData = _.cloneDeep(formData);
    delete clonedData.statementOfTruthCertified;

    clonedData = {
      ...clonedData,
      dateSigned: dateSigned(),
    };
    return clonedData;
  };

  const usFormTransform = formData =>
    transformForSubmit(formConfig, { ...form, data: formData });

  const transformedData = [
    addressTransform,
    cleanUpTransform,
    usFormTransform,
  ].reduce((formData, transformer) => transformer(formData), form.data);

  return JSON.stringify({
    educationBenefitsClaim: {
      form: transformedData,
    },
  });
}
