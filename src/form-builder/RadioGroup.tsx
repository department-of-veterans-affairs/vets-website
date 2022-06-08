import React, { ReactElement } from 'react';
import { RadioGroupProps, RadioItemProps } from './types';
import {
  VaRadio,
  VaRadioOption,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useField, FieldHookConfig, useFormikContext } from 'formik';
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
  const { setFieldValue } = useFormikContext();
  const id = props.id || props.name;

  const stringToBoolean = (value: string) => {
    switch (value.toLowerCase().trim()) {
      case 'true':
      case 'yes':
      case '1':
        return true;
      case 'false':
      case 'no':
      case '0':
      case null:
        return false;
      default:
        return Boolean(value);
    }
  };

  return (
    <VaRadio
      id={id}
      label={props.label}
      required={!!props.required}
      options={options}
      {...field}
      error={(meta.touched && meta.error) || undefined}
      onRadioOptionSelected={handleRadioSelected}
      onVaValueChange={(event: React.ChangeEvent<HTMLInputElement>) => {
        // Typed this as an event when passing into the function for safety, but event does not have property 'detail' on it.
        const e: any = event;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (
          e.detail.value === 'true' ||
          e.detail.value === 'false' ||
          typeof e.detail.value === 'boolean'
        ) {
          setFieldValue(field.name, stringToBoolean(e.detail.value));
        } else {
          helpers.setValue(e.detail.value);
        }
      }}
    >
      {options.map((option: any, index: number) => {
        return (
          <VaRadioOption
            data-testid={`${field.name}-${index}`}
            {...option}
            checked={field.value === option.value}
            key={`${field.name}-${index}`}
          />
        );
      })}
    </VaRadio>
  );
}
