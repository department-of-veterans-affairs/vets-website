import React from 'react';
import moment from 'moment';
import { timeFromNow } from '../../utilities/date';

import Back from './Back';
import ProgressButton from '../../components/ProgressButton';
import PropTypes from 'prop-types';
import { Column, Row } from 'platform/forms/components/common/grid';
import ErrorMessage from 'platform/forms/components/common/alerts/ErrorMessage';
import PreSubmitSection from 'platform/forms/components/review/PreSubmitSection';

export default function ThrottledError(props) {
  const { buttonText, when, formConfig, onBack, onSubmit, testId } = props;

  return (
    <>
      <Row>
        <Column role="alert" testId={testId}>
          <ErrorMessage
            active
            title="We’ve run into a problem"
            message={`We’re sorry. Your submission didn’t go through because we received
              too many requests from you. Please wait
              ${timeFromNow(moment.unix(when))} and submit your request
              again.`}
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

ThrottledError.propTypes = {
  buttonText: PropTypes.string,
  formConfig: PropTypes.object,
  when: PropTypes.object,
  onBack: PropTypes.func,
  onSubmit: PropTypes.func,
};
