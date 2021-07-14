import { FieldHookConfig } from 'formik';

export type FieldProps<V> = FieldHookConfig<V> & {
  label: string;
  id?: string;
  /**
   * If `required` is true, the default message will be used. If `required` is a
   * string, it will be used as the error message.
   */
  required?: boolean | string;
};
