// @ts-check
import React from 'react';
import { VaComboBox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import vaSelectAndComboBoxFieldMapping from './vaSelectAndComboBoxFieldMapping';
import { renderOptions } from './helpers';

export default function VaComboBoxField(props) {
  const mappedProps = vaSelectAndComboBoxFieldMapping(props);

  const labels = props.uiOptions?.labels || {};

  return (
    <VaComboBox
      {...mappedProps}
      placeholder={props?.uiOptions?.placeholder || null}
      value={
        props.childrenProps.formData ??
        props.childrenProps.schema.default ??
        undefined
      }
    >
      {renderOptions(props.childrenProps.schema, labels)}
    </VaComboBox>
  );
}
