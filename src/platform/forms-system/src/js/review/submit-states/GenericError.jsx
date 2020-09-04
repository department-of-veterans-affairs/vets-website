import React from 'react';
import PropTypes from 'prop-types';
import { Column, Row } from 'platform/forms/components/common/grid';
import ErrorMessage from 'platform/forms/components/common/alerts/ErrorMessage';
import PreSubmitSection from 'platform/forms/components/review/PreSubmitSection';

export default function GenericError(props) {
  const { appType, formConfig, renderErrorMessage, onSubmit, testId } = props;
  let submitButton;
  let submitMessage;

  if (renderErrorMessage) {
    submitMessage = renderErrorMessage();
  } else {
    submitMessage = (
      <ErrorMessage
        active
        title={`We’re sorry, the ${appType} didn’t go through.`}
        message="You’ll have to start over. We suggest you wait 1 day while we fix
        this problem."
      />
    );
  }

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
  renderErrorMessage: PropTypes.func,
  onSubmit: PropTypes.func,
};
