/** @param {WebComponentFieldProps} props */
export default function commonFieldMapping(props) {
  const { label, required, error, uiOptions, childrenProps } = props;

  return {
    autocomplete: uiOptions?.autocomplete,
    class: uiOptions?.classNames || '',
    error,
    hint: uiOptions?.hint,
    inputmode: uiOptions?.inputmode,
    label,
    maxlength: childrenProps.schema.maxLength,
    minlength: childrenProps.schema.minLength,
    pattern: childrenProps.schema.pattern,
    name: childrenProps.idSchema.$id,
    required,
    success: uiOptions?.success,
    uswds: uiOptions?.uswds,
  };
}
