import React from 'react';
import { useField, FieldHookConfig } from 'formik';

import { chainValidations, requiredValue } from '../utils/validation';

import { CheckboxGroupProps, CheckboxProps } from './types';

import { VaCheckboxGroup } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import CheckboxField from './CheckboxField';

const CheckboxFieldGroup = (props: CheckboxGroupProps): JSX.Element => {
  // component re-renders these values per form input inside the form
  const withValidation = {
    ...props,
    validate: chainValidations(props, [requiredValue]),
  };
  const [field, meta] = useField(withValidation as FieldHookConfig<string[]>);
  return (
    <>
      <VaCheckboxGroup
        id={props.id}
        label={props.label}
        required={!!props.required}
        name={props.name}
        options={props.options}
        error={(meta.touched && meta.error) || undefined}
      >
        {props.options.map((option: CheckboxProps, index: number) => (
          <CheckboxField key={`va-checkbox-field-${field.name}-${index}`}
                         {...option}
                         required={false}
                         name={option.name}
          />
        ))}
      </VaCheckboxGroup>
    </>
  );
};

export default CheckboxFieldGroup;
