export default function vaSelectFieldMapping(props) {
  const { label, required, error, uiOptions, childrenProps } = props;

  return {
    ...uiOptions,
    name: childrenProps.idSchema.$id,
    label,
    required,
    error,
    maxlength: childrenProps.schema.maxLength,
    minlength: childrenProps.schema.minLength,
    labels: uiOptions?.labels || {},
    value:
      typeof childrenProps.formData === 'undefined'
        ? ''
        : childrenProps.formData,
    onVaSelect: (event, value) => {
      const newVal = value ?? event.target.value ?? undefined;
      childrenProps.onChange(newVal);
    },
    onBlur: () => childrenProps.onBlur(childrenProps.idSchema.$id),
  };
}
