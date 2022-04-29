import { FieldHookConfig } from 'formik';

export type FieldProps<V> = Omit<FieldHookConfig<V>, 'required'> & {
  label: string;
  id?: string;
  /**
   * If `required` is true, the default message will be used. If `required` is a
   * string, it will be used as the error message.
   */
  required?: boolean | string;
};

export type CheckboxProps = FieldProps<string> & {
  checked?: boolean;
  content?: string;
  onValueChange?: any;
  value?: boolean;
};

export type RadioGroupProps = FieldProps<string> & {
  name: string;
  options: React.ReactElement<RadioItemProps>[];
  onChange: (v: string) => void;
};

export type RadioItemProps = {
  'aria-describedby': string;
  checked: boolean;
  label: string;
  name: string;
  value: string;
  radioOptionSelected: () => void;
};

export type CheckboxGroupProps = FieldProps<string> & {
  options: CheckboxProps[];
};

/**
 *
 * @remarks
 * The `name` prop must be passed in FullNameField component as it is used as object name.
 * @example
 * Here's a simple example:
 * ```
 * // <FullNameField name="fullName">
 * {
 *    fullName: {
 *      // fields
 *    }
 * }
 * ```
 * 
*/
export type FullNameProps = FieldProps<string>