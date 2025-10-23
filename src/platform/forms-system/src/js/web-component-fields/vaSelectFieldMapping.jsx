import commonFieldMapping from './commonFieldMapping';

/** @param {WebComponentFieldProps} props */
export default function vaSelectFieldMapping(props) {
  const { childrenProps } = props;

  return {
    ...commonFieldMapping(props),
    value:
      typeof childrenProps.formData === 'undefined'
        ? ''
        : childrenProps.formData,
    onVaSelect: (event, value) => {
      const newVal = value || event.target.value || undefined;
      childrenProps.onChange(newVal);
    },
    onBlur: () => childrenProps.onBlur(childrenProps.idSchema.$id),
  };
}
