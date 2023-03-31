import React from 'react';
import FormFieldVaTextInput from './web-components/FormFieldVaTextInput';

export default function WebComponent(props) {
  const { webComponent } = props;

  switch (webComponent) {
    case 'VaTextInput':
      return <FormFieldVaTextInput {...props} />;
    case 'VaCheckbox':
    default:
      return <></>;
  }
}
