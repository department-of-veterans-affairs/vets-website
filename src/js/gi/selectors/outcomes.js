import { createSelector } from 'reselect';
import { isFinite, pick } from 'lodash';

const getConstants = (state) => state.constants.constants;

const getRequiredAttributes = (state) => {
  return pick(state.profile.attributes, [
    'graduationRateVeteran',
    'graduationRateAllStudents',
    'salaryAllStudents',
    'highestDegree',
    'retentionRateVeteranOtb',
    'retentionRateVeteranBa',
    'retentionAllStudentsBa',
    'retentionAllStudentsOtb',
    'repaymentRateAllStudents'
  ]);
};

const whenDataAvailable = (n1, n2, obj) => {
  if (isFinite(n1) || isFinite(n2)) return obj;
  return {
    error: 'Data Not Available'
  };
};

export const outcomeNumbers = createSelector(
  [getConstants, getRequiredAttributes],
  (constant, institution) => {
    const veteranRetentionRate =
      institution.highestDegree === 4 ?
      institution.retentionRateVeteranBa || institution.retentionRateVeteranOtb :
      institution.retentionRateVeteranOtb || institution.retentionRateVeteranBa;

    const allStudentRetentionRate =
      institution.highestDegree === 4 ?
      institution.retentionAllStudentsBa || institution.retentionAllStudentsOtb :
      institution.retentionAllStudentsOtb || institution.retentionAllStudentsBa;

    const retention = whenDataAvailable(
      veteranRetentionRate,
      allStudentRetentionRate,
      {
        rate: isFinite(veteranRetentionRate) ? Number(veteranRetentionRate * 100) : null,
        all: isFinite(allStudentRetentionRate) ? Number(allStudentRetentionRate * 100) : null,
        average: constant.AVERETENTIONRATE,
      }
    );

    const graduation = whenDataAvailable(
      institution.graduationRateVeteran,
      institution.graduationRateAllStudents,
      {
        rate: Number(institution.graduationRateVeteran * 100),
        all: Number(institution.graduationRateAllStudents * 100),
        average: constant.AVEGRADRATE,
      }
    );

    const salary = whenDataAvailable(
      null,
      institution.salaryAllStudents,
      {
        all: institution.salaryAllStudents,
        average: constant.AVESALARY,
      }
    );

    const repayment = whenDataAvailable(
      null,
      institution.repaymentRateAllStudents,
      {
        rate: null,
        all: Number(institution.repaymentRateAllStudents * 100),
        average: constant.AVEREPAYMENTRATE,
      }
    );

    return {
      retention,
      graduation,
      salary,
      repayment
    };
  }
);
