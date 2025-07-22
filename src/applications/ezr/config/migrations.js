import { wrapInSingleArray } from '../utils/helpers/array-builder';

export default [
  // 0 -> 1, we implemented the 'confirmation flow'/V2 for the household chapter. By using ArrayBuilder (List and Loop) for the spouse and financial information sections, affected fields are no longer at the root level of the form data object, but rather nested in an array.
  // This migration moves the fields from the root level to the array level.
  ({ formData, metadata, formId }) => {
    const normalizedData = wrapInSingleArray(formData);
    return {
      formData: normalizedData,
      metadata,
      formId,
    };
  },
];
