import React from 'react';
import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
import ProgressButton from 'platform/forms-system/src/js/components/ProgressButton';

export const CustomPage = props => (
  <SchemaForm
    name={props.name}
    title={props.title}
    data={props.data}
    appStateData={props.appStateData}
    schema={props.schema}
    uiSchema={props.uiSchema}
    pagePerItemIndex={props.pagePerItemIndex}
    formContext={props.formContext}
    trackingPrefix={props.trackingPrefix}
    uploadFile={props.uploadFile}
    onChange={props.onChange}
    onSubmit={props.onSubmit}
  >
    {props.contentBeforeButtons}
    <div className="row form-progress-buttons schemaform-buttons vads-u-margin-top--4 vads-u-margin-bottom--2">
      <div className="small-12 medium-5 end columns">
        <ProgressButton
          submitButton
          onButtonClick={props.callOnContinue}
          buttonText="Continue"
          buttonClass="usa-button-primary"
          afterText="»"
        />
      </div>
    </div>
    {props.contentAfterButtons}
  </SchemaForm>
);
