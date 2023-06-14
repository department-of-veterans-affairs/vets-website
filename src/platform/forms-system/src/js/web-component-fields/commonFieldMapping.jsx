/** @param {WebComponentFieldProps} props */
export default function commonFieldMapping(props) {
  const { label, required, error, uiOptions, childrenProps } = props;

  return {
    autocomplete: uiOptions?.autocomplete,
    class: uiOptions?.classNames || '',
    error,
    hint: uiOptions?.hint,
    inert: uiOptions?.inert,
    inputmode: uiOptions?.inputmode,
    label,
    maxlength: childrenProps.schema.maxLength,
    minlength: childrenProps.schema.minLength,
    pattern: childrenProps.schema.pattern,
    name: childrenProps.idSchema.$id,
    required,
    success: uiOptions?.success,
    // returning false results in bugs, so use undefined or true instead
    // default uswds to true (v3 web component)
    uswds: uiOptions?.uswds === false ? undefined : true,
  };
}
