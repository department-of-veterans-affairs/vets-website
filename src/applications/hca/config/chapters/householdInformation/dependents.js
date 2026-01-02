import { differenceInYears } from 'date-fns';
import { capitalize } from 'lodash';
import {
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderItemSubsequentPageTitleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';
import { validateDependent } from '../../../utils/validation';
import {
  includeHouseholdInformation,
  LAST_YEAR,
  normalizeFullName,
  replaceStrValues,
} from '../../../utils/helpers';
import {
  dependentSchema,
  dependentUISchema,
  summaryPage,
} from '../../../definitions/dependent';

import content from '../../../locales/en/content.json';

/**
 * Declare attributes for array builder pattern
 * @type {ArrayBuilderOptions}
 */
const options = {
  arrayPath: 'dependents',
  nounPlural: content['dependent-info--array-noun-plural'],
  nounSingular: content['dependent-info--array-noun-singular'],
  required: false,
  isItemIncomplete: validateDependent,
  text: {
    getItemName: item => normalizeFullName(item?.fullName, true),
    cardDescription: item => item?.dependentRelation,
    cancelAddDescription: props =>
      replaceStrValues(content['array-builder--cancel-add-description'], [
        props.nounSingular,
        props.nounPlural,
      ]),
    cancelAddYes: content['array-builder--cancel-add-yes-label'],
    cancelAddNo: content['array-builder--cancel-add-no-label'],
    cancelEditDescription: props =>
      replaceStrValues(content['array-builder--cancel-edit-description'], [
        props.nounSingular,
        props.nounPlural,
      ]),
    cancelEditYes: content['array-builder--cancel-edit-yes-label'],
    cancelEditNo: content['array-builder--cancel-edit-no-label'],
    deleteNo: content['array-builder--delete-no-label'],
  },
};

// build schemas based on declared options
const summaryPageSchemas = summaryPage(options);

/**
 * build list of pages to populate in the form config
 * @returns {ArrayBuilderPages}
 */
const DependentsPages = arrayBuilderPages(options, pagebuilder => ({
  dependentsSummary: pagebuilder.summaryPage({
    title: content['dependent-info--summary-title'],
    path: 'household-information/dependents',
    uiSchema: summaryPageSchemas.uiSchema,
    schema: summaryPageSchemas.schema,
    depends: includeHouseholdInformation,
  }),
  dependentsBasicInfo: pagebuilder.itemPage({
    title: content['dependent-info--basic-title'],
    path: 'household-information/dependents/:index/basic-information',
    uiSchema: {
      ...arrayBuilderItemFirstPageTitleUI({
        title: capitalize(
          replaceStrValues(
            content['dependent-info--basic-title'],
            options.nounSingular,
          ),
        ),
        showEditExplanationText: false,
      }),
      ...dependentUISchema.basic,
    },
    schema: dependentSchema.basic,
    depends: includeHouseholdInformation,
  }),
  dependentAddtlInfo: pagebuilder.itemPage({
    title: content['dependent-info--addtl-title'],
    path: 'household-information/dependents/:index/additional-information',
    uiSchema: {
      ...arrayBuilderItemSubsequentPageTitleUI(
        ({ formData }) =>
          replaceStrValues(
            content['dependent-info--addtl-title'],
            normalizeFullName(formData.fullName, true),
          ),
        null,
        false,
      ),
      ...dependentUISchema.additional,
    },
    schema: dependentSchema.additional,
    depends: includeHouseholdInformation,
  }),
  dependentSupport: pagebuilder.itemPage({
    title: content['dependent-info--support-title'],
    path: 'household-information/dependents/:index/financial-support',
    uiSchema: {
      ...arrayBuilderItemSubsequentPageTitleUI(
        ({ formData }) =>
          replaceStrValues(
            content['dependent-info--support-title'],
            normalizeFullName(formData.fullName, true),
          ),
        null,
        false,
      ),
      ...dependentUISchema.support,
    },
    schema: dependentSchema.support,
    depends: (formData, index) =>
      includeHouseholdInformation(formData) &&
      !formData.dependents[index]?.cohabitedLastYear,
  }),
  dependentIncome: pagebuilder.itemPage({
    title: content['dependent-info--income-title'],
    path: 'household-information/dependents/:index/annual-income',
    uiSchema: {
      ...arrayBuilderItemSubsequentPageTitleUI(
        ({ formData }) =>
          replaceStrValues(content['dependent-info--income-title'], [
            normalizeFullName(formData.fullName, true),
            LAST_YEAR,
          ]),
        null,
        false,
      ),
      ...dependentUISchema.income,
    },
    schema: dependentSchema.income,
    depends: (formData, index) =>
      includeHouseholdInformation(formData) &&
      formData.dependents[index]?.['view:dependentIncome'],
  }),
  dependentEducation: pagebuilder.itemPage({
    title: content['dependent-info--education-title'],
    path: 'household-information/dependents/:index/education-expenses',
    uiSchema: {
      ...arrayBuilderItemSubsequentPageTitleUI(
        ({ formData }) =>
          replaceStrValues(
            content['dependent-info--education-title'],
            normalizeFullName(formData.fullName, true),
          ),
        null,
        false,
      ),
      ...dependentUISchema.education,
    },
    schema: dependentSchema.education,
    depends: (formData, index) => {
      if (!includeHouseholdInformation(formData)) return false;
      const birthdate = formData.dependents[index]?.dateOfBirth;
      const { grossIncome = 0 } =
        formData.dependents[index]['view:grossIncome'] || {};
      const age = differenceInYears(new Date(), new Date(birthdate));
      const hasGrossIncome = parseFloat(grossIncome) > 0;
      return age >= 18 && age <= 23 && hasGrossIncome;
    },
  }),
}));

export default DependentsPages;
