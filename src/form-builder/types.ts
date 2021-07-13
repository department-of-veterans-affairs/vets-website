import { FieldHookConfig } from 'formik';

export type FieldProps<V> = FieldHookConfig<V> & {
  label: string;
  id?: string;
};
