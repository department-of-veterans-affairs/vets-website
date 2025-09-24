// libs
import React from 'react';
import PropTypes from 'prop-types';

// components
import ErrorMessage from 'platform/forms/components/common/alerts/ErrorMessage';
import PreSubmitSection from 'platform/forms/components/review/PreSubmitSection';
import FormSaveErrorMessage from 'platform/forms/components/review/FormSaveErrorMessage';
import { Column, Row } from 'platform/forms/components/common/grid';

export default function GenericError(props) {
  const { appType, formConfig, onSubmit, testId } = props;
  let submitButton;
  let submitMessage;

  if (!formConfig.disableSave) {
    submitMessage = <FormSaveErrorMessage formConfig={formConfig} />;
  } else if (formConfig.submissionError) {
    const SubmissionError = formConfig.submissionError;

    submitMessage = <SubmissionError form={formConfig} />;
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
      <va-button
        secondary
        class="vads-u-margin--0"
        onClick={onSubmit}
        text="Submit again"
      />
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
      <div className="vads-u-display--flex vads-u-margin-y--4">
        <va-link-action
          type="primary"
          href="/"
          class="vads-u-margin-right--2"
          text="Go Back to VA.gov"
        />
        {submitButton}
      </div>
    </>
  );
}

GenericError.propTypes = {
  appType: PropTypes.string,
  formConfig: PropTypes.object,
  testId: PropTypes.string,
  onSubmit: PropTypes.func,
};
