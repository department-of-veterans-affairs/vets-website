import { FieldProps } from '../form-builder/types';
import { getMessage } from './i18n';

export type ValidationFunctionResult<T> =
  | void
  | undefined
  | string
  | Promise<unknown>
  | T;

export type ValidationFunction<T> = (
  value: T,
  props: FieldProps<T>
) => ValidationFunctionResult<T>;

export const chainValidations = <T>(
  props: FieldProps<T>,
  validations: ValidationFunction<T>[]
): ((value: T) => ValidationFunctionResult<T>) => {
  return (value: T) => {
    // Return the error message from the first validation function that fails.
    const errorMessage = validations
      .map((v) => v(value, props))
      .filter((m) => m)[0];
    if (errorMessage) return errorMessage;

    // None of the built-in validation functions failed; run the validate
    // function passed to the component.
    return props.validate ? props.validate(value) : undefined;
  };
};

export const required = <T>(
  value: T,
  props: FieldProps<T>
): ValidationFunctionResult<T> => {
  if (props.required && !value) {
    const errorMessage =
      typeof props.required === 'string'
        ? props.required
        : getMessage('required.default');
    return errorMessage;
  }

  return props.validate ? props.validate(value) : undefined;
};

export const isValidEmail = <T>(
  emailString: T,
  props: FieldProps<T>
): ValidationFunctionResult<T> => {
  if (typeof emailString !== 'string') {
    console.log(props);
    return 'Error: Email is not the correct type'; // This shouldn't happen
  }

  // Comes from StackOverflow: http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
  const isValid =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      emailString
    );

  return isValid ? '' : 'Error validating your email';
};
