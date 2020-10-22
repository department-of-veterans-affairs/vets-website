import React from 'react';
import Back from './Back';
import ProgressButton from '../../components/ProgressButton';
import PropTypes from 'prop-types';
import { Column, Row } from 'platform/forms/components/common/grid';
import PreSubmitSection from 'platform/forms/components/review/PreSubmitSection';

export default function Default(props) {
  const { buttonText, formConfig, onBack, onSubmit } = props;
  const buttonSize = formConfig.reviewPage?.buttonSize || '5';
  return (
    <>
      <PreSubmitSection formConfig={formConfig} />
      <Row classNames="form-progress-buttons">
        <Column classNames={`small-6 medium-${buttonSize}`}>
          <Back onButtonClick={onBack} />
        </Column>
        <Column classNames={`small-6 medium-${buttonSize}`}>
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

Default.propTypes = {
  buttonText: PropTypes.string,
  formConfig: PropTypes.object,
  onBack: PropTypes.func,
  onSubmit: PropTypes.func,
};
