import _ from 'lodash';
import { transformForSubmit } from 'platform/forms-system/src/js/helpers';
import { calculatedPercentage, dateSigned } from '../utilities';

export function transform(formConfig, form) {
  const newSchoolTransform = formData => {
    let clonedData = _.cloneDeep(formData);
    delete clonedData.statementOfTruthCertified;
    delete clonedData.studentRatioCalcChapter.studentPercentageCalc;
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
      dateSigned: dateSigned(),
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
