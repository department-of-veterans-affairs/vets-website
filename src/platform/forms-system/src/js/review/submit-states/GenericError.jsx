// libs
import React from 'react';
import PropTypes from 'prop-types';

// components
import PreSubmitSection from 'platform/forms/components/review/PreSubmitSection';
import FormSaveErrorMessage from 'platform/forms/components/review/FormSaveErrorMessage';
import { Column, Row } from 'platform/forms/components/common/grid';
// const FormSaveErrorMessage = props => props?.children;
export default function GenericError(props) {
  const { formConfig, onSubmit, testId } = props;
  let submitButton;

  const submitMessage = <FormSaveErrorMessage formConfig={formConfig} />;

  if (process.env.NODE_ENV !== 'production') {
    submitButton = (
      <Column classNames="small-6 usa-width-one-half medium-6">
        <a onClick={onSubmit}>Submit again</a>
      </Column>
    );
  }

  return (
    <>
      <Row>
        <Column classNames="small-12 medium-12" role="alert" testId={testId}>
          {submitMessage}
        </Column>
      </Row>
      <PreSubmitSection formConfig={formConfig} />
      <Row classNames="form-progress-buttons schemaform-back-buttons">
        <Column classNames="small-6 usa-width-one-half medium-6">
          <a href="/">
            <button className="usa-button-primary">Go Back to VA.gov</button>
          </a>
        </Column>
        {submitButton}
      </Row>
    </>
  );
}

GenericError.propTypes = {
  appType: PropTypes.string,
  formConfig: PropTypes.object,
  onSubmit: PropTypes.func,
};
