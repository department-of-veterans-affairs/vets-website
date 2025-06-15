export const BATCHES = {
  // https://github.com/department-of-veterans-affairs/va.gov-team/issues/104097
  compensationBenefits: {
    regexMatch: new RegExp(
      /\/Compensation\/resources_comp(010[0-9]|011[1-46]|0199|020[0-9]|021[1-46]|0299)[.]asp$/i,
    ),
  },
  // https://github.com/department-of-veterans-affairs/va.gov-team/issues/104097
  compensationBirthDefects: {
    regexMatch: new RegExp(
      /\/Compensation\/sb(1999|200[0-9]|201[1-46])[.]asp$/i,
    ),
  },
  // https://github.com/department-of-veterans-affairs/va.gov-team/issues/104097
  compensationSpecialBenefits: {
    regexMatch: new RegExp(
      /\/Compensation\/special_Benefit_Allowances_(1999|200[0-9]|201[1-5])[.]asp$/i,
    ),
  },
};
