import React from 'react';
import { VaMemorableDate } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import vaMemorableDateFieldMapping from './vaMemorableDateFieldMapping';

export default function VaMemorableDateField(props) {
  const mappedProps = vaMemorableDateFieldMapping(props);
  return <VaMemorableDate {...mappedProps} />;
}
