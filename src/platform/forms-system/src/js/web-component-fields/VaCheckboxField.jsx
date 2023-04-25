import React from 'react';
import { VaCheckbox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import vaCheckboxFieldMapping from './vaCheckboxFieldMapping';

export default function VaCheckboxField(props) {
  const mappedProps = vaCheckboxFieldMapping(props);
  return <VaCheckbox {...mappedProps} />;
}
