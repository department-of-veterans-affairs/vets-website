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

export type CheckboxGroupProps = FieldProps<string> & {
  options: CheckboxProps[];
};
