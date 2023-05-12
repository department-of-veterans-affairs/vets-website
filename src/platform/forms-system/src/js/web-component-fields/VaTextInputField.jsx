import React from 'react';
import { VaTextInput } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import vaTextInputFieldMapping from './vaTextInputFieldMapping';

/** @param {WebComponentFieldProps} props */
export default function VaTextInputField(props) {
  const mappedProps = vaTextInputFieldMapping(props);
  return <VaTextInput {...mappedProps} />;
}
