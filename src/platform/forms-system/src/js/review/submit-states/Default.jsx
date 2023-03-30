import React from 'react';
import PropTypes from 'prop-types';
import { Column, Row } from 'platform/forms/components/common/grid';
import PreSubmitSection from 'platform/forms/components/review/PreSubmitSection';
import ProgressButton from '../../components/ProgressButton';
import Back from './Back';

export default function Default(props) {
  const { buttonText, formConfig, onBack, onSubmit } = props;
  let ariaDescribedBy = null;
  // If no ariaDescribedBy is passed down from form.js,
  // a null value will properly not render the aria label.
  if (formConfig?.ariaDescribedBySubmit !== null) {
    ariaDescribedBy = formConfig?.ariaDescribedBySubmit;
  } else {
    ariaDescribedBy = null;
  }

  return (
    <>
      <PreSubmitSection formConfig={formConfig} />
      <Row classNames="form-progress-buttons vads-u-display--flex vads-u-margin-y--2">
        <Column classNames="vads-u-flex--1">
          <Back onButtonClick={onBack} />
        </Column>
        <Column classNames="vads-u-flex--1">
          <ProgressButton
            ariaDescribedBy={ariaDescribedBy}
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
