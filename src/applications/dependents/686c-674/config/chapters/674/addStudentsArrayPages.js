import React from 'react';
import {
  titleUI,
  textUI,
  textSchema,
  textareaUI,
  textareaSchema,
  addressUI,
  addressSchema,
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  arrayBuilderItemSubsequentPageTitleUI,
  yesNoUI,
  yesNoSchema,
  radioUI,
  radioSchema,
  fullNameNoSuffixUI,
  fullNameNoSuffixSchema,
  ssnUI,
  ssnSchema,
  currentOrPastDateUI,
  currentOrPastDateSchema,
  checkboxUI,
  checkboxSchema,
  checkboxGroupUI,
  checkboxGroupSchema,
  currencyUI,
  currencyStringSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import VaMemorableDateField from 'platform/forms-system/src/js/web-component-fields/VaMemorableDateField';
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
import { validateCurrentOrFutureDate } from 'platform/forms-system/src/js/validation';

import {
  AccreditedSchool,
  AddStudentsIntro,
  benefitSchemaLabels,
  benefitUiLabels,
  ProgramExamples,
  TermDateHint,
  calculateStudentAssetTotal,
  relationshipToStudentLabels,
} from './helpers';
import { CancelButton, generateHelpText } from '../../helpers';
import { getFullName } from '../../../../shared/utils';
import {
  StudentCurrentIncomeContent,
  StudentExpectedIncomeContent,
} from '../../../components/StudentIncomeContent';
import { NO_SSN_REASON_UI_MAPPINGS } from '../../dataMappings';

/** @type {ArrayBuilderOptions} */
export const addStudentsOptions = {
  arrayPath: 'studentInformation',
  nounSingular: 'student',
  nounPlural: 'students',
  required: true,
  isItemIncomplete: item =>
    !item?.fullName?.first ||
    !item?.fullName?.last ||
    !item?.birthDate ||
    (!item?.noSsn && !item?.ssn) ||
    (item?.noSsn && !item?.noSsnReason) ||
    (item?.isParent === true && !item?.isParent) ||
    !item?.address?.country ||
    !item?.address?.street ||
    !item?.address?.city ||
    !item?.address?.state ||
    !item?.address?.postalCode ||
    (item?.wasMarried === true && !item?.marriageDate) ||
    !item?.schoolInformation?.name ||
    (item?.schoolInformation?.studentIsEnrolledFullTime === true &&
      !item?.schoolInformation?.studentIsEnrolledFullTime) ||
    item?.schoolInformation?.isSchoolAccredited == null ||
    !item?.schoolInformation?.currentTermDates?.officialSchoolStartDate ||
    !item?.schoolInformation?.currentTermDates?.expectedStudentStartDate ||
    !item?.schoolInformation?.currentTermDates?.expectedGraduationDate ||
    (item?.schoolInformation?.studentDidAttendSchoolLastTerm === true &&
      !item?.schoolInformation?.studentDidAttendSchoolLastTerm) ||
    (item?.claimsOrReceivesPension !== undefined &&
      ![true, false].includes(item?.claimsOrReceivesPension)) ||
    (item?.schoolInformation?.studentDidAttendSchoolLastTerm === true &&
      (!item?.schoolInformation?.lastTermSchoolInformation?.termBegin ||
        !item?.schoolInformation?.lastTermSchoolInformation?.dateTermEnded)) ||
    (item?.typeOfProgramOrBenefit &&
      ['ch35', 'fry', 'feca'].some(
        key => item?.typeOfProgramOrBenefit?.[key] === true,
      ) &&
      !item?.benefitPaymentDate),
  maxItems: 20,
  text: {
    summaryTitle: 'Review your students',
    getItemName: item => getFullName(item.fullName),
  },
};

export const addStudentsIntroPage = {
  uiSchema: {
    ...titleUI('Your students'),
    'ui:description': () => (
      <>
        {AddStudentsIntro}
        <CancelButton dependentType="students" isAddChapter />
      </>
    ),
  },
  schema: {
    type: 'object',
    properties: {},
  },
};

/** @returns {PageSchema} */
export const addStudentsSummaryPage = {
  uiSchema: {
    'view:completedStudent': arrayBuilderYesNoUI(
      addStudentsOptions,
      {
        title: 'Do you have a student to add?',
        labels: {
          Y: 'Yes',
          N: 'No',
        },
      },
      {
        title: 'Do you have another student to add?',
        labels: {
          Y: 'Yes',
          N: 'No',
        },
      },
    ),
  },
  schema: {
    type: 'object',
    properties: {
      'view:completedStudent': arrayBuilderYesNoSchema,
    },
    required: ['view:completedStudent'],
  },
};

/** @returns {PageSchema} */
export const studentInformationPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Add a student',
      nounSingular: addStudentsOptions.nounSingular,
    }),
    'view:studentNameTitle': {
      'ui:description': <h4>Student’s name</h4>,
    },
    fullName: fullNameNoSuffixUI(title => `Student’s ${title}`),
    birthDate: currentOrPastDateUI({
      title: 'Student’s date of birth',
      labelHeaderLevel: '4',
      dataDogHidden: true,
      required: () => true,
    }),
    'view:studentIdTitle': {
      'ui:description': <h4>Student’s identification information</h4>,
    },
    noSsn: {
      ...checkboxUI({
        title: 'Student doesn’t have a Social Security number',
        required: () => false,
      }),
      'ui:options': {
        hideIf: (_formData, _index, fullData) => !fullData?.vaDependentsNoSsn, // check feature flag
      },
    },
    noSsnReason: radioUI({
      title: 'Why doesn’t your child have a Social Security number?',
      labels: {
        NONRESIDENT_ALIEN: NO_SSN_REASON_UI_MAPPINGS.NONRESIDENT_ALIEN,
        NONE_ASSIGNED: NO_SSN_REASON_UI_MAPPINGS.NONE_ASSIGNED,
      },
      required: (_chapterData, index, formData) =>
        formData?.studentInformation?.[index]?.noSsn === true,
      hideIf: (formData, index) => {
        const addMode = formData?.studentInformation?.[index]?.noSsn;
        const editMode = formData?.noSsn;
        return !(addMode || editMode);
      },
      errorMessages: {
        required: 'Tell us why the child doesn’t have a Social Security number',
      },
    }),
    ssn: {
      ...ssnUI('Child’s Social Security number'),
      'ui:required': (_chapterData, index, formData) =>
        !formData?.studentInformation?.[index]?.noSsn,
      'ui:options': {
        hideIf: (formData, index) => {
          const addMode = formData?.studentInformation?.[index]?.noSsn;
          const editMode = formData?.noSsn;
          return addMode || editMode;
        },
      },
    },
  },
  schema: {
    type: 'object',
    required: ['fullName', 'birthDate'],
    properties: {
      'view:studentNameTitle': { type: 'object', properties: {} },
      fullName: fullNameNoSuffixSchema,
      birthDate: currentOrPastDateSchema,
      'view:studentIdTitle': { type: 'object', properties: {} },
      noSsn: checkboxSchema,
      noSsnReason: radioSchema(['NONRESIDENT_ALIEN', 'NONE_ASSIGNED']),
      ssn: ssnSchema,
    },
  },
};

/** @returns {PageSchema} */
export const studentRelationshipPage = {
  uiSchema: {
    relationshipToStudent: radioUI({
      title: 'What’s your relationship to this child?',
      labels: relationshipToStudentLabels,
      labelHeaderLevel: 3,
    }),
  },
  schema: {
    type: 'object',
    required: ['relationshipToStudent'],
    properties: {
      relationshipToStudent: radioSchema(
        Object.keys(relationshipToStudentLabels),
      ),
    },
  },
};

/** @returns {PageSchema} */
export const studentIncomePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(() => 'Student’s income'),
    studentIncome: radioUI({
      title: 'Did this student have an income in the last 365 days?',
      hint:
        'Answer this question only if you are adding this dependent to your pension.',
      labels: {
        Y: 'Yes',
        N: 'No',
        NA: 'This question doesn’t apply to me',
      },
      required: (_chapterData, _index, formData) =>
        formData?.vaDependentsNetWorthAndPension,
      updateUiSchema: () => ({
        'ui:options': {
          hint: '',
        },
      }),
      updateSchema: (formData = {}, formSchema) => {
        const { vaDependentsNetWorthAndPension } = formData;

        if (!vaDependentsNetWorthAndPension) {
          return formSchema;
        }

        return {
          ...radioSchema(['Y', 'N']),
        };
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      studentIncome: radioSchema(['Y', 'N', 'NA']),
    },
  },
};

/** @returns {PageSchema} */
export const studentAddressPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(() => 'Student’s address'),
    address: {
      ...addressUI({
        title: '',
        labels: {
          militaryCheckbox:
            'The student receives mail outside of the United States on a U.S. military base.',
        },
      }),
      city: {
        ...addressUI().city,
        'ui:validations': [
          (errors, city, formData) => {
            const address = formData?.address;
            const cityStr = city?.trim().toUpperCase();

            if (city?.length > 30) {
              errors.addError('City must be 30 characters or less');
            }

            if (
              address &&
              ['APO', 'FPO', 'DPO'].includes(cityStr) &&
              address.isMilitary !== true
            ) {
              errors.addError('Enter a valid city name');
            }
          },
        ],
      },
    },
  },
  schema: {
    type: 'object',
    required: ['address'],
    properties: {
      address: addressSchema(),
    },
  },
};

/** @returns {PageSchema} */
export const studentMaritalStatusPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(() => 'Student’s marital status'),
    wasMarried: {
      ...yesNoUI('Has this student ever been married?'),
      'ui:required': () => true,
    },
  },
  schema: {
    type: 'object',
    required: ['wasMarried'],
    properties: {
      wasMarried: yesNoSchema,
    },
  },
};

/** @returns {PageSchema} */
export const studentMarriageDatePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(() => 'Student’s marriage date'),
    marriageDate: currentOrPastDateUI({
      title: 'Date of marriage',
      required: () => true,
    }),
    'ui:options': {
      updateSchema: (formData, schema, _uiSchema, index) => {
        const itemData = formData?.studentInformation?.[index] || {};

        if (itemData?.wasMarried !== true) {
          itemData.marriageDate = undefined;
          return schema;
        }

        return {
          ...schema,
          required: ['marriageDate'],
        };
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      marriageDate: currentOrPastDateSchema,
    },
  },
};

/** @returns {PageSchema} */
export const studentEducationBenefitsPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      () => 'Student’s education benefits',
    ),
    typeOfProgramOrBenefit: {
      ...checkboxGroupUI({
        title:
          'Does the student currently receive education benefits from any of these programs?',
        labels: benefitUiLabels,
        required: () => false, // must be set for checkboxGroupUI
        description: generateHelpText('Check all that the student receives'),
      }),
    },
    otherProgramOrBenefit: {
      'ui:title':
        'Briefly list any other programs the student receives education benefits from',
      'ui:webComponentField': VaTextInputField,
      'ui:options': {
        expandUnder: 'typeOfProgramOrBenefit',
        expandUnderCondition: formData => formData?.other,
        expandedContentFocus: true,
        preserveHiddenData: true,
      },
    },
    tuitionIsPaidByGovAgency: {
      ...yesNoUI({
        title:
          'Is the student enrolled in a program or school that’s entirely funded by the federal government?',
        required: () => true,
      }),
    },
    'view:programExamples': {
      'ui:description': ProgramExamples,
      'ui:options': {
        hideOnReview: true,
      },
    },
    'ui:options': {
      updateSchema: (formData, formSchema, _uiSchema, index) => {
        const isOtherChecked =
          !!formData?.studentInformation?.[index]?.typeOfProgramOrBenefit
            ?.other || !!formData?.typeOfProgramOrBenefit?.other;
        const required = ['tuitionIsPaidByGovAgency'];
        if (isOtherChecked) required.push('otherProgramOrBenefit');
        return { ...formSchema, required };
      },
    },
  },
  schema: {
    type: 'object',
    required: ['tuitionIsPaidByGovAgency'],
    properties: {
      typeOfProgramOrBenefit: checkboxGroupSchema(benefitSchemaLabels),
      otherProgramOrBenefit: {
        type: 'string',
      },
      tuitionIsPaidByGovAgency: yesNoSchema,
      'view:programExamples': {
        type: 'object',
        properties: {},
      },
    },
  },
};

/** @returns {PageSchema} */
export const studentEducationBenefitsStartDatePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      () => 'Student’s education benefit payments',
    ),
    benefitPaymentDate: {
      ...currentOrPastDateUI(
        'When did the student start receiving education benefit payments?',
      ),
      'ui:required': () => true,
      'ui:options': {
        updateSchema: (formData, schema, _uiSchema, index) => {
          const itemData = formData?.studentInformation?.[index];

          const values = Object.values(itemData?.typeOfProgramOrBenefit || {});
          const typeOfProgramOrBenefit =
            values.includes(false) && !values.some(value => value === true);

          if (typeOfProgramOrBenefit) {
            itemData.benefitPaymentDate = undefined;
            return schema;
          }

          return {
            ...schema,
            required: ['benefitPaymentDate'],
          };
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      benefitPaymentDate: currentOrPastDateSchema,
    },
  },
};

/** @returns {PageSchema} */
export const studentProgramInfoPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      () => 'Student’s education program or school',
    ),
    schoolInformation: {
      name: {
        ...textUI({
          title:
            'What’s the name of the school or trade program the student attends?',
          errorMessages: {
            required: 'Enter the name of the school or trade program',
          },
        }),
        'ui:required': () => true,
        'ui:options': {
          width: 'xl',
        },
        'ui:validations': [
          (errors, schoolName) => {
            if (schoolName?.length > 80) {
              errors.addError('School name must be 80 characters or less');
            }
          },
        ],
      },
    },
  },
  schema: {
    type: 'object',
    required: ['schoolInformation'],
    properties: {
      schoolInformation: {
        type: 'object',
        properties: {
          name: textSchema,
        },
      },
    },
  },
};

export const studentAttendancePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      () => 'Student’s school attendance history',
    ),
    schoolInformation: {
      studentIsEnrolledFullTime: yesNoUI({
        title:
          'Has the student attended school continuously since they started school?',
        required: () => true,
        description: generateHelpText(
          'Attending school continuously means they didn’t stop attending school, except for normal breaks during the school year like winter break or summer break',
        ),
      }),
    },
  },
  schema: {
    type: 'object',
    properties: {
      schoolInformation: {
        type: 'object',
        required: ['studentIsEnrolledFullTime'],
        properties: {
          studentIsEnrolledFullTime: yesNoSchema,
        },
      },
    },
  },
};

export const studentStoppedAttendingDatePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      () => 'Date student stopped attending school',
    ),
    schoolInformation: {
      dateFullTimeEnded: {
        ...currentOrPastDateUI(
          'When did the student stop attending school continuously?',
        ),
        'ui:options': {
          updateSchema: (formData, schema, _uiSchema, index) => {
            const itemData = formData?.studentInformation?.[index];

            if (itemData?.schoolInformation?.studentIsEnrolledFullTime) {
              itemData.schoolInformation.dateFullTimeEnded = undefined;
            }

            return schema;
          },
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      schoolInformation: {
        type: 'object',
        properties: {
          dateFullTimeEnded: currentOrPastDateSchema,
        },
      },
    },
  },
};

export const schoolAccreditationPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      () => 'School accreditation status',
    ),
    schoolInformation: {
      isSchoolAccredited: yesNoUI({
        title: 'Is the student’s school accredited?',
      }),
      'view:accredited': {
        'ui:description': AccreditedSchool,
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      schoolInformation: {
        type: 'object',
        required: ['isSchoolAccredited'],
        properties: {
          isSchoolAccredited: yesNoSchema,
          'view:accredited': {
            type: 'object',
            properties: {},
          },
        },
      },
    },
  },
};

export const studentTermDatesPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(() => 'Student’s term dates'),
    schoolInformation: {
      currentTermDates: {
        officialSchoolStartDate: {
          ...currentOrPastDateUI({
            title:
              'When did the student’s regular school term or course officially start?',
            required: () => true,
          }),
          'ui:description': TermDateHint,
        },
        expectedStudentStartDate: currentOrPastDateUI({
          title: 'When did the student start or expect to start their course?',
          required: () => true,
          errorMessages: {
            pattern: 'Enter a valid date',
          },
        }),
        expectedGraduationDate: {
          'ui:title': 'When does the student expect to graduate?',
          'ui:webComponentField': VaMemorableDateField,
          'ui:required': () => true,
          'ui:validations': [validateCurrentOrFutureDate],
          'ui:errorMessages': {
            required: 'Enter a valid current or future date',
            pattern: 'Enter a valid current or future date',
          },
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      schoolInformation: {
        type: 'object',
        properties: {
          currentTermDates: {
            required: [
              'officialSchoolStartDate',
              'expectedStudentStartDate',
              'expectedGraduationDate',
            ],
            type: 'object',
            properties: {
              officialSchoolStartDate: currentOrPastDateSchema,
              expectedStudentStartDate: currentOrPastDateSchema,
              expectedGraduationDate: {
                type: 'string',
                pattern: '^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$',
              },
            },
          },
        },
      },
    },
  },
};

export const previousTermQuestionPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      () => 'Student’s last term attendance',
    ),
    schoolInformation: {
      studentDidAttendSchoolLastTerm: yesNoUI({
        title: 'Did the student attend school last term?',
        description: generateHelpText(
          'This includes any type of school or training, including high school.',
        ),
        required: () => true,
      }),
    },
  },
  schema: {
    type: 'object',
    properties: {
      schoolInformation: {
        type: 'object',
        required: ['studentDidAttendSchoolLastTerm'],
        properties: {
          studentDidAttendSchoolLastTerm: yesNoSchema,
        },
      },
    },
  },
};

export const previousTermDatesPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      () => 'Student’s previous term dates',
    ),
    schoolInformation: {
      lastTermSchoolInformation: {
        'ui:options': {
          updateSchema: (formData, schema, _uiSchema, index) => {
            const itemData = formData?.studentInformation?.[index];

            if (
              itemData?.schoolInformation?.studentDidAttendSchoolLastTerm ===
              false
            ) {
              itemData.schoolInformation.lastTermSchoolInformation = undefined;
              return schema;
            }

            return {
              ...schema,
              required: ['termBegin', 'dateTermEnded'],
            };
          },
        },
        termBegin: {
          ...currentOrPastDateUI('When did the previous school term start?'),
        },
        dateTermEnded: {
          ...currentOrPastDateUI('When did the previous school term end?'),
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      schoolInformation: {
        type: 'object',
        properties: {
          lastTermSchoolInformation: {
            type: 'object',
            properties: {
              termBegin: currentOrPastDateSchema,
              dateTermEnded: currentOrPastDateSchema,
            },
          },
        },
      },
    },
  },
};

export const claimsOrReceivesPensionPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(() => 'Student’s income'),
    claimsOrReceivesPension: {
      ...yesNoUI(
        'Are you claiming or do you already receive Veterans Pension or Survivors Pension benefits?',
      ),
      'ui:description': generateHelpText(
        'If yes, we’ll ask you questions about the student’s income. If no, we’ll skip questions about the student’s income',
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
      () => 'Student’s income for this school term',
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
      () => 'Student’s expected income for next year',
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
          'Don’t include your primary residence (the home where you live most of the time)',
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
      'Is there any other information you’d like to add about this student?',
    ),
  },
  schema: {
    type: 'object',
    properties: {
      remarks: textareaSchema,
    },
  },
};
