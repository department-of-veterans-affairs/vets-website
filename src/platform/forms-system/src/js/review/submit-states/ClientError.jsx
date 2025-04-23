import React, { useEffect } from 'react';
import { focusElement, getScrollOptions } from 'platform/utilities/ui';
import PropTypes from 'prop-types';

import { Element } from 'platform/utilities/scroll';
import { Column, Row } from 'platform/forms/components/common/grid';
import ErrorMessage from 'platform/forms/components/common/alerts/ErrorMessage';
import PreSubmitSection from 'platform/forms/components/review/PreSubmitSection';
import scrollTo from 'platform/utilities/ui/scrollTo';
import ProgressButton from '../../components/ProgressButton';
import Back from './Back';

export default function ClientError(props) {
  const { buttonText, formConfig, onBack, onSubmit, testId } = props;
  const scrollToError = () => {
    scrollTo('errorScrollElement', getScrollOptions());
  };
  let ariaDescribedBy = null;
  // If no ariaDescribedBy is passed down from form.js,
  // a null value will properly not render the aria label.
  if (formConfig?.ariaDescribedBySubmit !== null) {
    ariaDescribedBy = formConfig?.ariaDescribedBySubmit;
  } else {
    ariaDescribedBy = null;
  }
  const hideBackButton = formConfig?.useTopBackLink || false;

  useEffect(() => {
    focusElement('.schemaform-failure-alert');
    scrollToError();
  }, []);

  return (
    <>
      <Row>
        <Column role="alert" testId={testId}>
          <Element name="errorScrollElement" />
          <ErrorMessage
            active
            title="We’re sorry, there was an error connecting to VA.gov."
            message="Please check your Internet connection and try again."
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

ClientError.propTypes = {
  buttonText: PropTypes.string,
  formConfig: PropTypes.object,
  onBack: PropTypes.func,
  onSubmit: PropTypes.func,
};
