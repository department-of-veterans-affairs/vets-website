import React from 'react';
import PropTypes from 'prop-types';

import { Column, Row } from 'platform/forms/components/common/grid';
import ErrorMessage from 'platform/forms/components/common/alerts/ErrorMessage';
import PreSubmitSection from 'platform/forms/components/review/PreSubmitSection';
import ProgressButton from '../../components/ProgressButton';
import Back from './Back';
import ErrorLinks from './ErrorLinks';

function ValidationError(props) {
  const { appType, buttonText, formConfig, onBack, onSubmit, testId } = props;
  let ariaDescribedBy = null;
  // If no ariaDescribedBy is passed down from form.js,
  // a null value will properly not render the aria label.
  if (formConfig?.ariaDescribedBySubmit !== null) {
    ariaDescribedBy = formConfig?.ariaDescribedBySubmit;
  } else {
    ariaDescribedBy = null;
  }
  const hideBackButton = formConfig?.useTopBackLink || false;
  const useWebComponents =
    formConfig?.formOptions?.useWebComponentForNavigation;

  const alert = formConfig.showReviewErrors ? (
    <ErrorLinks appType={appType} testId={testId} formConfig={formConfig} />
  ) : (
    <ErrorMessage
      active
      title={`We’re sorry. Some information in your ${appType} is missing or not valid.`}
    >
      <p>
        Please check each section of your {appType} to make sure you’ve filled
        out all the information that is required.
      </p>
    </ErrorMessage>
  );

  return (
    <>
      <Row>
        <Column role="alert" testId={testId}>
          {alert}
        </Column>
      </Row>
      <PreSubmitSection formConfig={formConfig} />
      <Row classNames="form-progress-buttons vads-u-margin-y--2">
        {hideBackButton ? (
          <>
            <Column classNames="small-6 medium-5">
              <ProgressButton
                ariaDescribedBy={ariaDescribedBy}
                onButtonClick={onSubmit}
                buttonText={buttonText}
                buttonClass="usa-button-primary"
                useWebComponents={useWebComponents}
              />
            </Column>
          </>
        ) : (
          <>
            <Column classNames="small-6 medium-5">
              <Back
                onButtonClick={onBack}
                useWebComponents={useWebComponents}
              />
            </Column>
            <Column classNames="small-6 medium-5">
              <ProgressButton
                ariaDescribedBy={ariaDescribedBy}
                onButtonClick={onSubmit}
                buttonText={buttonText}
                buttonClass="usa-button-primary"
                useWebComponents={useWebComponents}
              />
            </Column>
            <Column classNames="small-1 medium-1 end">
              <div className="hidden">&nbsp;</div>
            </Column>
          </>
        )}
      </Row>
    </>
  );
}

ValidationError.propTypes = {
  appType: PropTypes.string,
  buttonText: PropTypes.string,
  formConfig: PropTypes.object,
  onBack: PropTypes.func,
  onSubmit: PropTypes.func,
};

export default ValidationError;
