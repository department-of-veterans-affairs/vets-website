import React from 'react';
import { useField, FieldHookConfig } from 'formik';

import { FieldProps } from './types';
import { chainValidations, required } from '../utils/validation';

import { VaSelect } from 'web-components/react-bindings';

type SelectProps = FieldProps<string> & {
  onVaSelect: (e: CustomEvent) => void;
  children: HTMLOptionElement[];
};

const SelectField = (props: SelectProps): JSX.Element => {
  const withValidation = {
    ...props,
    validate: chainValidations(props, [required]),
  };
  const [field, meta] = useField(withValidation as FieldHookConfig<string>);
  const id = props.id || props.name;

  return (
    <VaSelect
      id={id}
      label={props.label}
      required={!!props.required}
      {...field}
      onVaSelect={field.onChange}
      error={(meta.touched && meta.error) || undefined}
    >
      {props.children}
    </VaSelect>
  );
};

export default SelectField;
