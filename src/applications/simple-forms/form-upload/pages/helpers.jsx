import React from 'react';
import { FormNavButtons, SchemaForm } from 'platform/forms-system/exportsFile';

export const CustomAlertPage = props => (
  <>
    {props.alert}
    <SchemaForm {...props}>
      <>
        {props.contentBeforeButtons}
        <FormNavButtons {...props} submitToContinue />
        {props.contentAfterButtons}
      </>
    </SchemaForm>
  </>
);
