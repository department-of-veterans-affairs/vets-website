import React from 'react';
import { VaTextarea } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import vaTextareaFieldMapping from './vaTextareaFieldMapping';

/** @param {WebComponentFieldProps} props */
export default function VaTextAreaField(props) {
  const mappedProps = vaTextareaFieldMapping(props);
  return <VaTextarea {...mappedProps} />;
}
