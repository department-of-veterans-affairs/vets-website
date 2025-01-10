import { cloneDeep } from 'lodash';
import { transformForSubmit } from 'platform/forms-system/src/js/helpers';
import { getFTECalcs } from '../helpers';

export default function transform(formConfig, form) {
  const formData = cloneDeep(form);
  //
  // Include total enrolled FTE And supported student percentage FTE if 10+ supported students enrolled
  //
  formData.data.programs = formData.data?.programs?.map(program => {
    const programWithCalcs = program;
    if (!Number(program.supportedStudents) < 10 && program.fte) {
      const fteCalcs = getFTECalcs(program);
      programWithCalcs.fte.totalFTE = fteCalcs?.total;
      programWithCalcs.fte.supportedPercentageFTE =
        fteCalcs?.supportedFTEPercent;
    }
    return programWithCalcs;
  });
  const transformedData = transformForSubmit(formConfig, formData);
  return JSON.stringify({
    educationBenefitsClaim: {
      form: transformedData,
    },
  });
}
