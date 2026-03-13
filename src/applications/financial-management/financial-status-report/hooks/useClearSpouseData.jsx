import { useEffect } from 'react';

const clearSpouseData = formData => {
  return {
    ...formData,
    questions: {
      ...formData.questions,
      spouseHasAdditionalIncome: undefined,
      spouseHasBenefits: undefined,
      spouseHasSocialSecurity: undefined,
      spouseIsEmployed: undefined,
    },
    personalData: {
      ...formData.personalData,
      spouseFullName: {},
    },
    income: formData.income
      ? formData.income.filter(
          incomeRecord => incomeRecord.veteranOrSpouse !== 'SPOUSE',
        )
      : [],
    socialSecurity: { ...formData.socialSecurity, spouse: {} },
    additionalIncome: { ...formData.additionalIncome, spouse: {} },
    benefits: { ...formData.benefits, spouseBenefits: {} },
    employmentHistory: {
      ...formData.employmentHistory,
      spouse: {}, // This will reset the spouse employment history
    },
  };
};

const useClearSpouseData = (isMarried, formData, setFormData) => {
  useEffect(
    () => {
      if (isMarried === false) {
        setFormData(clearSpouseData(formData));
      }
    },
    // Do not add formData to the dependency array, as it will cause an infinite loop. Linter warning will go away when feature flag is deprecated.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isMarried, setFormData],
  );
};

export default useClearSpouseData;
