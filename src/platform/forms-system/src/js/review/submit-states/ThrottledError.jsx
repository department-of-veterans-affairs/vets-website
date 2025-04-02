import React from 'react';

import PropTypes from 'prop-types';
import { Column, Row } from 'platform/forms/components/common/grid';
import ErrorMessage from 'platform/forms/components/common/alerts/ErrorMessage';
import PreSubmitSection from 'platform/forms/components/review/PreSubmitSection';
import ProgressButton from '../../components/ProgressButton';
import Back from './Back';
import { timeFromNow } from '../../../../../utilities/date';

export default function ThrottledError(props) {
  const { buttonText, when, formConfig, onBack, onSubmit, testId } = props;
  let ariaDescribedBy = null;
  // If no ariaDescribedBy is passed down from form.js,
  // a null value will properly not render the aria label.
  if (formConfig?.ariaDescribedBySubmit !== null) {
    ariaDescribedBy = formConfig?.ariaDescribedBySubmit;
  } else {
    ariaDescribedBy = null;
  }
  const hideBackButton = formConfig?.useTopBackLink || false;

  return (
    <>
      <Row>
        <Column role="alert" testId={testId}>
          <ErrorMessage
            active
            title="We’ve run into a problem"
            message={`We’re sorry. Your submission didn’t go through because we received
              too many requests from you. Please wait
              ${timeFromNow(new Date(when * 1000))} and submit your request
              again.`}
          />
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
              />
            </Column>
          </>
        ) : (
          <>
            <Column classNames="small-6 medium-5">
              <Back onButtonClick={onBack} />
            </Column>
            <Column classNames="small-6 medium-5">
              <ProgressButton
                ariaDescribedBy={ariaDescribedBy}
                onButtonClick={onSubmit}
                buttonText={buttonText}
                buttonClass="usa-button-primary"
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

ThrottledError.propTypes = {
  buttonText: PropTypes.string,
  formConfig: PropTypes.object,
  when: PropTypes.object,
  onBack: PropTypes.func,
  onSubmit: PropTypes.func,
};
