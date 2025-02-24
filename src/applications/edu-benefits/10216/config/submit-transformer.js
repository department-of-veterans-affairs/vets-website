import _ from 'lodash';
import { transformForSubmit } from 'platform/forms-system/src/js/helpers';
import { calculatedPercentage } from '../utilities';

export function transform(formConfig, form) {
  const newSchoolTransform = formData => {
    let clonedData = _.cloneDeep(formData);
    delete clonedData.studentRatioCalcChapter.studentPercentageCalc;
    delete clonedData.statementOfTruthCertified;
    let today = new Date();
    const offset = today.getTimezoneOffset();
    today = new Date(today.getTime() - offset * 60 * 1000);

    clonedData = {
      ...clonedData,
      studentRatioCalcChapter: {
        ...clonedData.studentRatioCalcChapter,
        beneficiaryStudent: Number(
          clonedData.studentRatioCalcChapter.beneficiaryStudent,
        ),
        numOfStudent: Number(clonedData.studentRatioCalcChapter.numOfStudent),
        VABeneficiaryStudentsPercentage: calculatedPercentage(clonedData),
      },
      dateSigned: today.toISOString().split('T')[0],
    };
    return clonedData;
  };
  const usFormTransform = formData =>
    transformForSubmit(formConfig, { ...form, data: formData });

  const transformedData = [newSchoolTransform, usFormTransform].reduce(
    (formData, transformer) => transformer(formData),
    form.data,
  );

  return JSON.stringify({
    educationBenefitsClaim: {
      form: transformedData,
    },
  });
}
