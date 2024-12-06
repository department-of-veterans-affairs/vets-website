import { cloneDeep } from 'lodash';
import { transformForSubmit } from 'platform/forms-system/src/js/helpers';

export default function transform(formConfig, form) {
  const formData = cloneDeep(form);
  //
  // Need to add in Total enrolled FTE And supported student percentage FTE if 10+ supported students enrolled
  //
  formData.data.programs = formData.data.programs.map(program => {
    const programWithCalcs = program;
    if (!Number(program.supportedStudents) < 10 && program.fte) {
      const supported = Number(program.fte.supported);
      const nonSupported = Number(program.fte.nonSupported);
      const total = supported + nonSupported;
      programWithCalcs.fte.totalFTE = total;
      programWithCalcs.fte.supportedPercentageFTE = ((supported / total) * 100)
        .toFixed(2)
        .replace(/[.,]00$/, '');
    }
    return programWithCalcs;
  });
  console.log(formData);
  const transformedData = transformForSubmit(formConfig, formData);
  return JSON.stringify({
    educationBenefitsClaim: {
      form: transformedData,
    },
  });
}
