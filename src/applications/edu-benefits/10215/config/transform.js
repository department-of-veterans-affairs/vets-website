import { cloneDeep } from 'lodash';
import { getFTECalcs } from '../helpers';

export default function transform(form) {
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

  // Strip view fieldds and statement of truth checkbox value
  for (const i of formData.data.programs) {
    delete i['view:calcs'];
  }
  delete formData.data.statementOfTruthCertified;
  delete formData.data['view:programsSummary'];

  // Send date signed
  let today = new Date();
  const offset = today.getTimezoneOffset();
  today = new Date(today.getTime() - offset * 60 * 1000);
  // eslint-disable-next-line prefer-destructuring
  formData.data.dateSigned = today.toISOString().split('T')[0];

  return JSON.stringify({
    educationBenefitsClaim: {
      form: JSON.stringify(formData.data),
    },
  });
}
