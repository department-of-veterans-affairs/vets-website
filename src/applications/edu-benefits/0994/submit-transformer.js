import _ from 'lodash/fp';
import { transformForSubmit as usFormsTransformForSubmit } from 'us-forms-system/lib/js/helpers';
import removeDeeplyEmptyObjects from '../../../platform/utilities/data/removeDeeplyEmptyObjects';

/**
 * This is mostly copied from us-forms' own stringifyFormReplacer, but with
 * the incomplete / empty address check removed, since we don't need this
 * for any of the 3 addresses (mailing, forwarding, treatment facility) in our
 * form. Leaving it in breaks treatment facility addresses because by design
 * they don't have street / line 1 addresses, so would get incorrectly filtered
 * out. Trivia: this check is also gone in the latest us-forms replacer.
 */
export function customReplacer(key, value) {
  // clean up empty objects, which we have no reason to send
  if (typeof value === 'object') {
    const fields = Object.keys(value);
    if (
      fields.length === 0 ||
      fields.every(field => value[field] === undefined)
    ) {
      return undefined;
    }

    // autosuggest widgets save value and label info, but we should just return the value
    if (value.widget === 'autosuggest') {
      return value.id;
    }

    // Exclude file data
    if (value.confirmationCode && value.file) {
      return _.omit('file', value);
    }
  }

  // Clean up empty objects in arrays
  if (Array.isArray(value)) {
    const newValues = value.filter(v => !!customReplacer(key, v));
    // If every item in the array is cleared, remove the whole array
    return newValues.length > 0 ? newValues : undefined;
  }

  return value;
}

export function transformForSubmit(formConfig, form) {
  // Define the transformations
  const filterEmptyObjects = formData =>
    removeDeeplyEmptyObjects(
      JSON.parse(
        usFormsTransformForSubmit(
          formConfig,
          { ...form, data: formData },
          customReplacer,
        ),
      ),
    );

  // End transformation definitions

  // Apply the transformations
  const transformedData = [filterEmptyObjects].reduce(
    (formData, transformer) => transformer(formData),
    form.data,
  );

  return JSON.stringify({
    educationBenefitsClaim: {
      form: transformedData,
    },
  });
}
