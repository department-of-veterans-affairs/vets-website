import React, { ReactElement } from 'react';
import { RadioGroupProps, RadioItemProps } from './types';
import {
  VaRadio,
  VaRadioOption,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useField, FieldHookConfig } from 'formik';
import { chainValidations, required } from '../utils/validation';



export function RadioGroup(props: RadioGroupProps): JSX.Element {
  const options = props.options;
  const withValidation = {
    ...props,
    validate: chainValidations(props, [required]),
  };
  const [field, meta, helpers] = useField(
    withValidation as FieldHookConfig<string>
  );

  const handleRadioSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    helpers.setValue(event.target.value);
  };
  const id = props.id || props.name;
  return (
    <VaRadio
      id={id}
      label={props.label}
      required={!!props.required}
      options={options}
      {...field}
      error={(meta.touched && meta.error) || undefined}
      onRadioOptionSelected={handleRadioSelected}
    >
      {options.map((option: ReactElement<RadioItemProps>, index: number) => {
           <VaRadioOption {...option} key={`${field.name}-${index}`} />
      })}
    </VaRadio>
  );
}
