import React from 'react';
import Back from './Back';
import ProgressButton from '../../components/ProgressButton';
import PropTypes from 'prop-types';
import { Column, Row } from 'platform/forms/components/common/grid';
import PreSubmitSection from 'platform/forms/components/review/PreSubmitSection';

export default function Default(props) {
  const { buttonText, formConfig, onBack, onSubmit } = props;
  return (
    <>
      <PreSubmitSection formConfig={formConfig} />
      <Row classNames="form-progress-buttons vads-u-display--flex">
        <Column classNames={`vads-u-flex--1`}>
          <Back onButtonClick={onBack} />
        </Column>
        <Column classNames={`vads-u-flex--1`}>
          <ProgressButton
            onButtonClick={onSubmit}
            buttonText={buttonText}
            buttonClass="usa-button-primary"
          />
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
