import mapValues from 'lodash/mapValues';
import { endOfDay, isAfter } from 'date-fns';
import vaMedicalFacilities from 'vets-json-schema/dist/vaMedicalFacilities.json';
import set from 'platform/utilities/data/set';
import recordEvent from 'platform/monitoring/record-event';
import {
  stringifyFormReplacer,
  filterViewFields,
  filterInactivePageData,
  getActivePages,
  expandArrayPages,
  createFormPageList,
} from 'platform/forms-system/src/js/helpers';
import { getInactivePages } from 'platform/forms/helpers';
import { HIGH_DISABILITY_MINIMUM } from '../constants';

// map necessary attachment data for submission
export function transformAttachments(data) {
  if (!data.attachments || !(data.attachments instanceof Array)) {
    return data;
  }
  const transformedAttachments = data.attachments.map(attachment => {
    const { name, size, confirmationCode, attachmentId } = attachment;
    return {
      name,
      size,
      confirmationCode,
      dd214: attachmentId === '1',
    };
  });
  return { ...data, attachments: transformedAttachments };
}

// strip, clean and map necessary data for submission
export function transform(formConfig, form) {
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
  let withoutViewFields = filterViewFields(withoutInactivePages);
  const addressesMatch = form.data['view:doesMailingMatchHomeAddress'];

  // add back veteran name, dob & ssn, because it could have been removed in filterInactivePages
  const veteranFields = [
    'veteranFullName',
    'veteranDateOfBirth',
    'veteranSocialSecurityNumber',
  ];
  veteranFields.forEach(field => {
    if (!withoutViewFields[field]) {
      const fieldData =
        form.loadedData.formData[field] ||
        form['view:veteranInformation'][field];
      withoutViewFields = set(field, fieldData, withoutViewFields);
    }
  });

  // add back & double check compensation type because it could have been removed in filterInactivePages
  if (!withoutViewFields.vaCompensationType) {
    const userDisabilityRating = parseInt(
      form.data['view:totalDisabilityRating'],
      10,
    );
    const compensationType =
      userDisabilityRating >= HIGH_DISABILITY_MINIMUM
        ? 'highDisability'
        : form.data.vaCompensationType;
    withoutViewFields = set(
      'vaCompensationType',
      compensationType,
      withoutViewFields,
    );
  }

  // parse dependents list here, because it could have been removed in filterViewFields
  if (withoutViewFields.dependents?.length) {
    const listToSet = withoutViewFields.dependents.map(item => ({
      ...item,
      grossIncome: item.grossIncome || 0,
      netIncome: item.netIncome || 0,
      otherIncome: item.otherIncome || 0,
      dependentEducationExpenses: item.dependentEducationExpenses || 0,
    }));
    withoutViewFields = set('dependents', listToSet, withoutViewFields);
  } else {
    withoutViewFields = set('dependents', [], withoutViewFields);
  }

  // convert `attachmentId` values to a `dd214` boolean
  if (withoutViewFields.attachments) {
    withoutViewFields = transformAttachments(withoutViewFields);
  }

  // duplicate address before submit if they are the same
  if (addressesMatch) {
    withoutViewFields.veteranHomeAddress = withoutViewFields.veteranAddress;
  }

  const formData =
    JSON.stringify(withoutViewFields, (key, value) => {
      // Don’t let dependents be removed in the normal empty object clean up
      if (key === 'dependents') {
        return value;
      }

      return stringifyFormReplacer(key, value);
    }) || '{}';

  let gaClientId;
  try {
    // eslint-disable-next-line no-undef
    gaClientId = ga.getAll()[0].get('clientId');
  } catch (e) {
    // don't want to break submitting because of a weird GA issue
  }

  // use logging to track volume of forms submitted with future discharge dates
  const { lastDischargeDate } = form.data;
  if (
    lastDischargeDate &&
    isAfter(new Date(lastDischargeDate), endOfDay(new Date()))
  ) {
    recordEvent({
      event: 'hca-future-discharge-date-submission',
    });
  }

  // use logging to track volume of forms submitted with SIGI question answered
  if (form.data.sigiGenders && form.data.sigiGenders !== 'NA') {
    recordEvent({
      event: 'hca-submission-with-sigi-value',
    });
  }

  return JSON.stringify({
    gaClientId,
    asyncCompatible: true,
    form: formData,
  });
}

// map the facility list for each state into an array of strings
export const medicalCentersByState = mapValues(vaMedicalFacilities, val =>
  val.map(center => center.value),
);
