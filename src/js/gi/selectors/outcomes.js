import { createSelector } from 'reselect';

const getConstants = (state) => state.constants.constants;

const getRequiredAttributes = (state) => {
  const {graduation_rate_veteran, graduation_rate_all_students, salary_all_students} = state.profile.attributes;
  return {
    graduation_rate_veteran,
    graduation_rate_all_students,
    salary_all_students
  };
};

export const outcomeNumbers = createSelector(
  [getConstants, getRequiredAttributes],
  (constant, institution) => {
    const retention = {
      rate: 30,
      all: 97.83,
      average: constant.AVERETENTIONRATE,
    };
    const graduation = {
      rate: Number(institution.graduation_rate_veteran * 100),
      all: Number(institution.graduation_rate_all_students * 100),
      average: constant.AVEGRADRATE,
    };
    const salary = {
      all: institution.salary_all_students,
      average: constant.AVESALARY,
    }
    const repayment = {
      rate: Number(institution.graduation_rate_veteran * 100),
      all: Number(institution.graduation_rate_all_students * 100),
      average: constant.AVEGRADRATE,
    };
    return {
      retention,
      graduation,
      salary,
      repayment
    };
  }
);





// const getVeteranRetentionRate = (it) => {
//   const a = [3, 4].includes(it.pred_degree_awarded);
//   const b = String(it.va_highest_degree_offered).toLowerCase() === '4-year';
//   const upperClass = a || b;
//   if (upperClass) {
//     return it.retentation_rate_veteran_ba || it.retention_rate_veteran_otb;
//   } else {
//     return it.retentation_rate_veteran_otb || it.retention_rate_veteran_ba;
//   }
// };
// const getAllStudentRetentionRate = (it) => {
//   const a = [3, 4].includes(it.pred_degree_awarded);
//   const b = String(it.va_highest_degree_offered).toLowerCase() === '4-year';
//   const upperClass = a || b;
//   if (upperClass) {
//     return it.retention_all_students_ba || it.retention_all_students_otb;
//   } else {
//     return it.retention_all_students_otb || it.retention_all_students_ba;
//   }
// };
// const isNumeric = (n) => { return !Number.isNaN(parseFloat(n)); };
//
// const retention = {
//   rate: isNumeric(getVeteranRetentionRate(institution)) ? Number(getVeteranRetentionRate(institution) * 100) : null,
//   all: isNumeric(getAllStudentRetentionRate(institution)) ? Number(getAllStudentRetentionRate(institution) * 100) : null,
//   average: constant.AVERETENTIONRATE,
// };
// const repayment = {
//   rate: null,
//   all: Number(institution.repayment_rate_all_students * 100),
//   average: constant.AVEREPAYMENTRATE,
// };
// // const graduation = {
// //   rate: () => {
// //     console.log(graduationRate: institution.graduation_rate_veteran)
// //     isNumeric(institution.graduation_rate_veteran) ? Number(institution.graduation_rate_veteran* 100) : null
// //   },
// //   all: () => {
// //     console.log({graduationAll: institution.graduation_rate_all_students})
// //     isNumeric(institution.graduation_rate_all_students) ? Number(institution.graduation_rate_all_students* 100) : null
// //   },
// //   average: constant.AVEGRADRATE,
// // };
//
// const graduation = function(){
//   return {
//     rate: Number(institution.graduation_rate_veteran* 100),
//     all: Number(institution.graduation_rate_all_students* 100),
//     average: constant.AVEGRADRATE
//   };
// }();
