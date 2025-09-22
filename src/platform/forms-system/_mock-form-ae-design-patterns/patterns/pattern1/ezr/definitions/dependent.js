import dependentAddtlInformation from '../config/chapters/householdInformation/dependentAdditionalInformation';
import dependentAnnualIncome from '../config/chapters/householdInformation/dependentAnnualIncome';
import dependentEducationExpenses from '../config/chapters/householdInformation/dependentEducationExpenses';
import dependentFinancialSupport from '../config/chapters/householdInformation/dependentFinancialSupport';
import dependentPersonalInformation from '../config/chapters/householdInformation/dependentPersonalInformation';

// define uiSchemas for each page in dependent flow
export const dependentUISchema = {
  basic: dependentPersonalInformation.uiSchema,
  education: dependentEducationExpenses.uiSchema,
  additional: dependentAddtlInformation.uiSchema,
  support: dependentFinancialSupport.uiSchema,
  income: dependentAnnualIncome.uiSchema,
};

// define schemas for each page in dependent flow
export const dependentSchema = {
  basic: dependentPersonalInformation.schema,
  education: dependentEducationExpenses.schema,
  additional: dependentAddtlInformation.schema,
  support: dependentFinancialSupport.schema,
  income: dependentAnnualIncome.schema,
};
