import React from 'react';
import Back from './Back';
import ProgressButton from '../../components/ProgressButton';
import PropTypes from 'prop-types';
import { Column, Row } from 'platform/forms/components/common/grid';
import PreSubmitSection from 'platform/forms/components/review/PreSubmitSection';

export default function Pending(props) {
  const { formConfig, onBack, onSubmit } = props;
  let ariaDescribedBy = null;
  // If no ariaDescribedBy is passed down from form.js,
  // a null value will properly not render the aria label.
  if (formConfig.ariaDescribedBySubmit !== null) {
    ariaDescribedBy = formConfig.ariaDescribedBySubmit;
  } else {
    ariaDescribedBy = null;
  }

  return (
    <>
      <PreSubmitSection formConfig={formConfig} />
      <Row classNames="form-progress-buttons">
        <Column classNames="small-6 medium-5">
          <Back onButtonClick={onBack} />
        </Column>
        <Column classNames="small-6 medium-5">
          <ProgressButton
            ariaDescribedBy={ariaDescribedBy}
            onButtonClick={onSubmit}
            buttonText="Sending..."
            disabled
            buttonClass="usa-button-disabled"
          />
        </Column>
        <Column classNames="small-1 medium-1 end">
          <div className="hidden">&nbsp;</div>
        </Column>
      </Row>
    </>
  );
}

Pending.propTypes = {
  formConfig: PropTypes.object,
  onBack: PropTypes.func,
  onSubmit: PropTypes.func,
};
