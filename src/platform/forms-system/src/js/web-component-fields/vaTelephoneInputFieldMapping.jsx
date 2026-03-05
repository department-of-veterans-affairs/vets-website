/* eslint-disable no-console */
import commonFieldMapping from './commonFieldMapping';

/** @param {WebComponentFieldProps} props */
export default function VaTelephoneInputFieldMapping(props) {
  const { childrenProps } = props;
  const commonFieldProps = commonFieldMapping(props);
  return {
    ...commonFieldProps,
    contact: childrenProps?.formData?.contact || '',
    country: childrenProps?.formData?.countryCode || 'US',
    // onBlur: () => childrenProps.onBlur(childrenProps.idSchema.$id),
  };
}
