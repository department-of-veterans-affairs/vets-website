import { createSelector } from 'reselect';

const getConstants = (state) => state.constants.constants;

const getRequiredAttributes = (state) => {
  const {
    graduationRateVeteran,
    graduationRateAllStudents,
    salaryAllStudents,
    predDegreeAwarded,
    vaHighestDegreeOffered,
    retentionRateVeteranOtb,
    retentionRateVeteranBa,
    retentionAllStudentsBa,
    retentionAllStudentsOtb,
    repaymentRateAllStudents,
  } = state.profile.attributes;
  return {
    graduationRateVeteran,
    graduationRateAllStudents,
    salaryAllStudents,
    predDegreeAwarded,
    vaHighestDegreeOffered,
    retentionRateVeteranOtb,
    retentionRateVeteranBa,
    retentionAllStudentsBa,
    retentionAllStudentsOtb,
    repaymentRateAllStudents,
  };
};

const isNumeric = (n) => (!Number.isNaN(parseFloat(n)));

const whenDataAvailable = (n1, n2, obj) => {
  if (isNumeric(n1) || isNumeric(n2)) return obj;
  return {
    error: 'Data Not Available'
  };
};

export const outcomeNumbers = createSelector(
  [getConstants, getRequiredAttributes],
  (constant, institution) => {
    const getVeteranRetentionRate = () => {
      const a = [3, 4].includes(institution.predDegreeAwarded);
      const b = String(institution.vaHighestDegreeOffered).toLowerCase() === '4-year';
      const upperClass = a || b;
      if (upperClass) {
        return institution.retentionRateVeteranBa || institution.retentionRateVeteranOtb;
      }
      return institution.retentionRateVeteranOtb || institution.retentionRateVeteranBa;
    };
    const getAllStudentRetentionRate = () => {
      const a = [3, 4].includes(institution.predDegreeAwarded);
      const b = String(institution.vaHighestDegreeOffered).toLowerCase() === '4-year';
      const upperClass = a || b;
      if (upperClass) {
        return institution.retentionAllStudentsBa || institution.retentionAllStudentsOtb;
      }
      return institution.retentionAllStudentsOtb || institution.retentionAllStudentsBa;
    };

    const retention = whenDataAvailable(
      getVeteranRetentionRate(),
      getAllStudentRetentionRate(),
      {
        rate: isNumeric(getVeteranRetentionRate()) ? Number(getVeteranRetentionRate(institution) * 100) : null,
        all: isNumeric(getAllStudentRetentionRate()) ? Number(getAllStudentRetentionRate(institution) * 100) : null,
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
