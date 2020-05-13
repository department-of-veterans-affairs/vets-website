import fullSchema from 'vets-json-schema/dist/686C-674-schema.json';
import { validateWhiteSpace } from 'platform/forms/validations';
import {
  filterInactivePageData,
  getActivePages,
  getInactivePages,
  stringifyFormReplacer,
  expandArrayPages,
  createFormPageList,
} from 'platform/forms-system/src/js/helpers';

const validateName = (errors, pageData) => {
  const { first, last } = pageData;
  validateWhiteSpace(errors.first, first);
  validateWhiteSpace(errors.last, last);
};

const {
  optionSelection,
  veteranInformation,
  addChild,
  addSpouse,
  reportDivorce,
  deceasedDependents,
  reportChildMarriage,
  reportChildStoppedAttendingSchool,
  reportStepchildNotInHousehold,
  report674,
} = fullSchema.properties;

export {
  validateName,
  optionSelection,
  veteranInformation,
  addChild,
  addSpouse,
  reportDivorce,
  deceasedDependents,
  reportChildMarriage,
  reportChildStoppedAttendingSchool,
  reportStepchildNotInHousehold,
  report674,
};

export function customTransformForSubmit(
  formConfig,
  form,
  replacer = stringifyFormReplacer,
) {
  const expandedPages = expandArrayPages(
    createFormPageList(formConfig),
    form.data,
  );
  const activePages = getActivePages(expandedPages, form.data);
  const inactivePages = getInactivePages(expandedPages, form.data);
  const withoutInactivePages = filterInactivePageData(
    inactivePages,
    activePages,
    form,
  );
  return JSON.stringify(withoutInactivePages, replacer) || '{}';
}
