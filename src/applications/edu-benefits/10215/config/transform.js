import { cloneDeep } from 'lodash';
import { transformForSubmit } from 'platform/forms-system/src/js/helpers';
import { getFTECalcs } from '../helpers';

export default function transform(formConfig, form) {
  const formData = cloneDeep(form);
  //
  // Include total enrolled FTE And supported student percentage FTE if 10+ supported students enrolled
  //
  formData.data.programs = formData.data?.programs?.map(p => {
    const program = p;
    program.studentsEnrolled = parseInt(program.studentsEnrolled, 10);
    program.supportedStudents = parseInt(program.supportedStudents, 10);
    if (!program.supportedStudents < 10 && program.fte) {
      const fteCalcs = getFTECalcs(program);
      program.fte.totalFTE = fteCalcs?.total;
      program.fte.supportedPercentageFTE =
        fteCalcs?.supportedFTEPercent &&
        Number(
          fteCalcs?.supportedFTEPercent.substring(
            0,
            fteCalcs?.supportedFTEPercent.length - 1,
          ),
        );
    }
    if (program.fte) {
      program.fte.nonSupported = parseInt(program.fte.nonSupported, 10);
      program.fte.supported = parseInt(program.fte.supported, 10);
    }
    return program;
  });
  // Strip Statement of truth checkbox value
  delete formData.data.statementOfTruthCertified;
  const transformedData = transformForSubmit(formConfig, formData);

  return JSON.stringify({
    educationBenefitsClaim: {
      form: transformedData,
    },
  });
}
