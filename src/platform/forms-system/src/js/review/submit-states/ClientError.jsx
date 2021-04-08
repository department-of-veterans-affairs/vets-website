import React, { useEffect } from 'react';
import { focusElement } from 'platform/utilities/ui';
import Scroll from 'react-scroll';
import Back from './Back';
import ProgressButton from '../../components/ProgressButton';
import PropTypes from 'prop-types';
import { Column, Row } from 'platform/forms/components/common/grid';
import ErrorMessage from 'platform/forms/components/common/alerts/ErrorMessage';
import PreSubmitSection from 'platform/forms/components/review/PreSubmitSection';

export default function ClientError(props) {
  const { buttonText, formConfig, onBack, onSubmit, testId } = props;
  const Element = Scroll.Element;
  const scroller = Scroll.scroller;
  const scrollToError = () => {
    scroller.scrollTo(
      'errorScrollElement',
      window.VetsGov?.scroll || {
        duration: 500,
        delay: 0,
        smooth: true,
      },
    );
  };

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
      <Row classNames="form-progress-buttons">
        <Column classNames="small-6 medium-5">
          <Back onButtonClick={onBack} />
        </Column>
        <Column classNames="small-6 medium-5">
          <ProgressButton
            onButtonClick={onSubmit}
            buttonText={buttonText}
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

ClientError.propTypes = {
  buttonText: PropTypes.string,
  formConfig: PropTypes.object,
  onBack: PropTypes.func,
  onSubmit: PropTypes.func,
};
