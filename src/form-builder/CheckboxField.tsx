import React from 'react';
import { useField, FieldHookConfig } from 'formik';

import { FieldProps } from './types';
import { chainValidations, required } from '../utils/validation';
import { VaCheckbox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

type CheckboxProps = FieldProps<string> & { checked: boolean };

const CheckboxField = (props: CheckboxProps): JSX.Element => {
  const withValidation = {
    ...props,
    validate: chainValidations(props, [required]),
  };
  const [field, meta, helpers] = useField(
    withValidation as FieldHookConfig<boolean>
  );
  const id = props.id || props.name;

  return (
    <VaCheckbox
      id={id}
      label={props.label}
      required={!!props.required}
      {...field}
      checked={field.value}
      onVaChange={(e: CustomEvent) => {
        helpers.setValue((e?.target as HTMLInputElement).checked);
      }}
      error={(meta.touched && meta.error) || undefined}
    />
  );
};

export default CheckboxField;
