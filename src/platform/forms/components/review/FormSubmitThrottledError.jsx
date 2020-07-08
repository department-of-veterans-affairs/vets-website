// libs
import React from 'react';
import moment from 'moment';

// platform - forms components
import Column from 'platform/forms/components/common/grid/Column';
import ErrorMessage from 'platform/forms/components/common/alerts/ErrorMessage';
import Row from 'platform/forms/components/common/grid/Row';

// platform - forms containers
import PreSubmitSection from 'platform/forms/containers/review/PreSubmitSection';

// platform - forms-system components
import ProgressButton from 'platform/forms-system/src/js/components/ProgressButton';

// utils
import { timeFromNow } from 'platform/utilities/date';

function FormSubmitThrottledError(props) {
  const { formConfig, formSubmission, goBack, onSubmit } = props;

  return (
    <>
      <Row>
        <Column>
          <ErrorMessage
            active
            message={`We’re sorry. Your submission didn’t go through because we received
              too many requests from you. Please wait ${timeFromNow(
                moment.unix(formSubmission.extra),
              )} 
              and submit your request again.`}
            title="We’ve run into a problem"
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

export default FormSubmitThrottledError;
