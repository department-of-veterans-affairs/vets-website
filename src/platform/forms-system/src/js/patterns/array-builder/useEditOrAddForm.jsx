import { useState, useEffect, useCallback } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import { updateSchemasAndData } from 'platform/forms-system/src/js/state/helpers';
import {
  replaceItemInFormData,
  META_DATA_KEY,
  checkIfArrayHasDuplicateData,
  getItemDuplicateDismissedName,
} from './helpers';

/**
 * Custom hook for handling form state for edit or add form pages.
 * Uses local state in edit mode, and persist to redux only after
 * continue button is clicked. Otherwise and add/default mode, it
 * uses the redux state directly.
 * @param {{
 *   isEdit: boolean,
 *   schema: SchemaOptions,
 *   uiSchema: UiSchemaOptions,
 *   data: Object, // form data scoped to the field
 *   fullData: Object, // full form data
 *   onChange: Function,
 *   onSubmit: Function
 * }} props
 * @returns {{
 *   data: Object,
 *   schema: SchemaOptions,
 *   uiSchema: UiSchemaOptions,
 *   onChange: Function,
 *   onSubmit: Function
 * }}
 */
export function useEditOrAddForm({
  isEdit,
  schema,
  uiSchema,
  data,
  fullData,
  onChange,
  onSubmit,
  index,
  arrayPath,
  duplicateChecks,
}) {
  // These states are only used in edit mode
  const [localData, setLocalData] = useState(null);
  const [localSchema, setLocalSchema] = useState(null);
  const [localUiSchema, setLocalUiSchema] = useState(null);
  const [duplicateCheckResult, setDuplicateCheckResult] = useState({
    arrayData: [],
    hasDuplicate: false,
    duplicates: [],
  });
  const itemDuplicateDismissedName = getItemDuplicateDismissedName({
    arrayPath,
    duplicateChecks,
    fullData,
    itemIndex: index || 0,
  });

  useEffect(
    () => {
      if (isEdit) {
        // We run updateSchemasAndData before setting data in case
        // there are updateSchema, replaceSchema, updateUiSchema
        // or other dynamic properties
        const {
          data: initialData,
          schema: initialSchema,
          uiSchema: initialUiSchema,
        } = updateSchemasAndData(
          cloneDeep(schema),
          cloneDeep(uiSchema),
          cloneDeep(data),
          false, // preserveHiddenData default
          cloneDeep(fullData),
          index,
        );
        setLocalData(initialData);
        setLocalSchema(initialSchema);
        setLocalUiSchema(initialUiSchema);
      }
    },
    [data, fullData, schema, uiSchema, isEdit, index],
  );

  const handleOnChange = useCallback(
    updatedData => {
      if (isEdit) {
        // We run updateSchemasAndData before setting data in case
        // there are updateSchema, replaceSchema, updateUiSchema,
        // or other dynamic properties

        // array builder will always have an arrayPath, but
        // in case other components use this hook, we need to
        // set full data to the updated data since we're dealing
        // with local data.
        let newFullData = updatedData;

        if (arrayPath) {
          newFullData = replaceItemInFormData({
            formData: fullData,
            newItem: updatedData,
            arrayPath,
            index,
          });
        }

        const {
          data: newData,
          schema: newSchema,
          uiSchema: newUiSchema,
        } = updateSchemasAndData(
          localSchema,
          localUiSchema,
          updatedData,
          false, // preserveHiddenData
          newFullData,
          index,
        );
        setLocalData(newData);
        setLocalSchema(newSchema);
        setLocalUiSchema(newUiSchema);
      } else {
        onChange({
          ...data,
          ...updatedData,
        });
      }
    },
    [
      isEdit,
      localSchema,
      localUiSchema,
      onChange,
      data,
      fullData,
      index,
      arrayPath,
    ],
  );

  const checkForDuplicates = useCallback(
    () => {
      if (
        !duplicateChecks ||
        fullData[META_DATA_KEY]?.[itemDuplicateDismissedName] ||
        !(
          duplicateChecks.externalComparisonData ||
          duplicateChecks.comparisons?.length > 0
        )
      ) {
        return { arrayData: [], hasDuplicate: false, duplicates: [] };
      }
      return checkIfArrayHasDuplicateData({
        arrayPath,
        duplicateChecks,
        fullData,
        index,
      });
    },
    [arrayPath, duplicateChecks, fullData, index, itemDuplicateDismissedName],
  );

  const handleOnSubmit = useCallback(
    newProps => {
      const check = checkForDuplicates();
      setDuplicateCheckResult(check);
      if (check.duplicates.includes(check.arrayData[index])) {
        return;
      }
      if (isEdit) {
        onSubmit({ formData: localData });
      } else {
        onSubmit(newProps);
      }
    },
    [checkForDuplicates, index, isEdit, localData, onSubmit],
  );

  return {
    data: isEdit ? localData : data,
    schema: isEdit ? localSchema : schema,
    uiSchema: isEdit ? localUiSchema : uiSchema,
    onChange: handleOnChange,
    onSubmit: handleOnSubmit,
    duplicateCheckResult,
  };
}
