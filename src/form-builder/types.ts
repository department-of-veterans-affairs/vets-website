// Ideally, this would use Formik's FieldProps definition, but I don't know how
// to make that work
export type FieldProps = {
  label: string;
  id?: string;
  validate?: <T>(value: T) => undefined | string | Promise<T>;
  name: string;
};
