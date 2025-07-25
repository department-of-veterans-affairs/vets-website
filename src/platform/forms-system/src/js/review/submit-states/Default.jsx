import React from 'react';
import PropTypes from 'prop-types';
import { Column, Row } from 'platform/forms/components/common/grid';
import PreSubmitSection from 'platform/forms/components/review/PreSubmitSection';
import ProgressButton from '../../components/ProgressButton';
import Back from './Back';

export default function Default({
  buttonText,
  formConfig = {},
  onBack,
  onSubmit,
}) {
  const ariaDescribedBy = formConfig?.ariaDescribedBySubmit ?? null;
  const hideBackButton = formConfig?.useTopBackLink || false;
  const useWebComponents =
    formConfig?.formOptions?.useWebComponentForNavigation;

  return (
    <>
      <PreSubmitSection formConfig={formConfig} />
      <Row classNames="form-progress-buttons vads-u-display--flex vads-u-margin-y--2">
        {hideBackButton ? (
          <>
            <Column classNames="vads-u-flex--1">
              <ProgressButton
                ariaDescribedBy={ariaDescribedBy}
                onButtonClick={onSubmit}
                buttonText={buttonText}
                buttonClass="usa-button-primary"
                useWebComponents={useWebComponents}
              />
            </Column>
            <Column classNames="vads-u-flex--1" />
          </>
        ) : (
          <>
            <Column classNames="vads-u-flex--1">
              <Back
                onButtonClick={onBack}
                useWebComponents={useWebComponents}
              />
            </Column>
            <Column classNames="vads-u-flex--1">
              <ProgressButton
                ariaDescribedBy={ariaDescribedBy}
                onButtonClick={onSubmit}
                buttonText={buttonText}
                buttonClass="usa-button-primary"
                useWebComponents={useWebComponents}
              />
            </Column>
          </>
        )}
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
