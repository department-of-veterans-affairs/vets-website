import { useState, useEffect, useCallback } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import { updateSchemasAndData } from 'platform/forms-system/src/js/state/helpers';

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
}) {
  // These states are only used in edit mode
  const [localData, setLocalData] = useState(null);
  const [localSchema, setLocalSchema] = useState(null);
  const [localUiSchema, setLocalUiSchema] = useState(null);

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
        const {
          data: newData,
          schema: newSchema,
          uiSchema: newUiSchema,
        } = updateSchemasAndData(
          localSchema,
          localUiSchema,
          updatedData,
          false,
          fullData,
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
    [isEdit, localSchema, localUiSchema, onChange, data, fullData, index],
  );

  const handleOnSubmit = useCallback(
    newProps => {
      if (isEdit) {
        onSubmit({ formData: localData });
      } else {
        onSubmit(newProps);
      }
    },
    [isEdit, localData, onSubmit],
  );

  return {
    data: isEdit ? localData : data,
    schema: isEdit ? localSchema : schema,
    uiSchema: isEdit ? localUiSchema : uiSchema,
    onChange: handleOnChange,
    onSubmit: handleOnSubmit,
  };
}
