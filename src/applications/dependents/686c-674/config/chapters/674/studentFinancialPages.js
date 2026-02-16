import {
  arrayBuilderItemSubsequentPageTitleUI,
  textareaUI,
  textareaSchema,
  yesNoUI,
  yesNoSchema,
  currencyUI,
  currencyStringSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

import { calculateStudentAssetTotal } from './helpers';
import { generateHelpText } from '../../helpers';
import {
  StudentCurrentIncomeContent,
  StudentExpectedIncomeContent,
} from '../../../components/StudentIncomeContent';

export const claimsOrReceivesPensionPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(() => 'Student\u2019s income'),
    claimsOrReceivesPension: {
      ...yesNoUI(
        'Are you claiming or do you already receive Veterans Pension or Survivors Pension benefits?',
      ),
      'ui:description': generateHelpText(
        'If yes, we\u2019ll ask you questions about the student\u2019s income. If no, we\u2019ll skip questions about the student\u2019s income',
      ),
      'ui:required': () => true,
    },
  },
  schema: {
    type: 'object',
    required: ['claimsOrReceivesPension'],
    properties: {
      claimsOrReceivesPension: yesNoSchema,
    },
  },
};

export const studentEarningsPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      () => 'Student\u2019s income for this school term',
    ),
    'ui:options': {
      updateSchema: (_formData, schema, _uiSchema, index, _path, fullData) => {
        const itemData = fullData?.studentInformation?.[index];
        const { vaDependentsNetWorthAndPension } = fullData;

        const { veteranInformation } = fullData || {};
        const { isInReceiptOfPension } = veteranInformation || {};

        // When flipper is on, reset if api returns isInReceiptOfPension as 0 (no) or -1 (unknown) and
        // the user has not confirmed they are in receipt of pension (view:checkVeteranPension)
        // When flipper is off, reset if claimsOrReceivesPension is false
        const resetItemData = vaDependentsNetWorthAndPension
          ? isInReceiptOfPension === 0 ||
            (isInReceiptOfPension === -1 &&
              !fullData?.['view:checkVeteranPension'])
          : !itemData?.claimsOrReceivesPension;

        if (resetItemData) {
          itemData.studentEarningsFromSchoolYear = undefined;
          itemData.studentExpectedEarningsNextYear = undefined;
          itemData.studentNetworthInformation = undefined;
        }

        return schema;
      },
    },
    studentEarningsFromSchoolYear: {
      'ui:description': StudentCurrentIncomeContent,
      earningsFromAllEmployment: currencyUI('Earnings from employment'),
      annualSocialSecurityPayments: currencyUI('Annual Social Security income'),
      otherAnnuitiesIncome: currencyUI('Other annuity income'),
      allOtherIncome: {
        ...currencyUI('All other income'),
        'ui:description': generateHelpText('Examples: interest or dividends'),
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      studentEarningsFromSchoolYear: {
        type: 'object',
        properties: {
          earningsFromAllEmployment: currencyStringSchema,
          annualSocialSecurityPayments: currencyStringSchema,
          otherAnnuitiesIncome: currencyStringSchema,
          allOtherIncome: currencyStringSchema,
        },
      },
    },
  },
};

export const studentFutureEarningsPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      () => 'Student\u2019s expected income for next year',
    ),
    studentExpectedEarningsNextYear: {
      'ui:description': StudentExpectedIncomeContent,
      earningsFromAllEmployment: currencyUI('Earnings from employment'),
      annualSocialSecurityPayments: currencyUI('Annual Social Security income'),
      otherAnnuitiesIncome: currencyUI('Other annuity income'),
      allOtherIncome: {
        ...currencyUI('All other income'),
        'ui:description': generateHelpText('Examples: interest, dividends'),
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      studentExpectedEarningsNextYear: {
        type: 'object',
        properties: {
          earningsFromAllEmployment: currencyStringSchema,
          annualSocialSecurityPayments: currencyStringSchema,
          otherAnnuitiesIncome: currencyStringSchema,
          allOtherIncome: currencyStringSchema,
        },
      },
    },
  },
};

export const studentAssetsPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(() => 'Value of student assets'),
    studentNetworthInformation: {
      savings: {
        ...currencyUI('Savings'),
        'ui:description': generateHelpText('Include cash'),
      },
      securities: {
        ...currencyUI('Financial accounts'),
        'ui:description': generateHelpText(
          'Examples: stocks, bonds, mutual funds',
        ),
      },
      realEstate: {
        ...currencyUI('Real estate'),
        'ui:description': generateHelpText(
          'Don\u2019t include your primary residence (the home where you live most of the time)',
        ),
      },
      otherAssets: currencyUI('All other assets'),
    },
    'ui:options': {
      updateSchema: (formData, schema, _uiSchema) => {
        const total = calculateStudentAssetTotal(
          formData?.studentNetworthInformation,
        );

        if (formData?.studentNetworthInformation) {
          // eslint-disable-next-line no-param-reassign
          formData.studentNetworthInformation.totalValue = total;
        }

        return schema;
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      studentNetworthInformation: {
        type: 'object',
        properties: {
          savings: currencyStringSchema,
          securities: currencyStringSchema,
          realEstate: currencyStringSchema,
          otherAssets: currencyStringSchema,
        },
      },
    },
  },
};

export const remarksPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      () => 'Additional information about this student',
    ),
    remarks: textareaUI(
      'Is there any other information you\u2019d like to add about this student?',
    ),
  },
  schema: {
    type: 'object',
    properties: {
      remarks: textareaSchema,
    },
  },
};
