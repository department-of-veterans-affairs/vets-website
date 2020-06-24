// libs
import React from 'react';

// platform - forms components
import Column from 'platform/forms/components/common/grid/Column';
import Row from 'platform/forms/components/common/grid/Row';

// platform - forms containers
import PreSubmitSection from 'platform/forms/containers/review/PreSubmitSection';

// platform - forms-system components
import ProgressButton from 'platform/forms-system/src/js/components/ProgressButton';

function SubmitPending(props) {
  const { formConfig, goBack, onSubmit } = props;

  return (
    <>
      <Row>
        <Column className="columns" />
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

export default SubmitPending;
