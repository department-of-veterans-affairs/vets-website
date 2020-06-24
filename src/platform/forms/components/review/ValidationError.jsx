// libs
import React from 'react';

// platform - forms components
import Column from 'platform/forms/components/common/grid/Column';
import ErrorMessage from 'platform/forms/components/common/alerts/ErrorMessage';
import Row from 'platform/forms/components/common/grid/Row';

// platform - forms containers
import PreSubmitSection from 'platform/forms/containers/review/PreSubmitSection';

// platform - forms-system components
import ProgressButton from 'platform/forms-system/src/js/components/ProgressButton';

function ValidationError(props) {
  const { formConfig, goBack, onSubmit } = props;

  return (
    <>
      <Row>
        <Column>
          <ErrorMessage
            active
            message="Please check each section of your application to make sure you’ve
              filled out all the information that is required."
            title="We’re sorry. Some information in your application is 
              missing or not valid."
          />
        </Column>
      </Row>
      <PreSubmitSection formConfig={formConfig} />
      <Row classNames="form-progress-buttons">
        <Column classNames="small-6 medium-5">
          <ProgressButton
            onButtonClick={goBack}
            buttonText="Back"
            buttonClass="usa-button-secondary"
            beforeText="«"
          />
        </Column>
        <Column classNames="small-6 medium-5">
          <ProgressButton
            onButtonClick={onSubmit}
            buttonText="Submit application"
            buttonClass="usa-button-primary"
          />
        </Column>
        <Column classNames="small-1 medium-1 end">
          <div className="hidden">&nbsp;</div>
        </Column>
      </Row>
    </>
  );
}

export default ValidationError;
