import React from 'react';
import PropTypes from 'prop-types';
import { Column, Row } from 'platform/forms/components/common/grid';
import PreSubmitSection from 'platform/forms/components/review/PreSubmitSection';
import { useDispatch, useSelector } from 'react-redux';
import ProgressButton from '../../components/ProgressButton';
// import Back from './Back';
import { handleFinishLater } from '../../components/FormNavButtons';

export default function Default({ buttonText, formConfig = {}, onSubmit }) {
  const ariaDescribedBy = formConfig?.ariaDescribedBySubmit ?? null;
  const form = useSelector(state => state.form);
  const dispatch = useDispatch();

  const finishLater = event => {
    event.preventDefault();
    handleFinishLater({
      form,
      dispatch,
    });
  };
  return (
    <>
      <PreSubmitSection formConfig={formConfig} />
      <Row classNames="form-progress-buttons vads-u-display--flex vads-u-margin-y--2">
        <Column classNames="vads-u-flex--1">
          <ProgressButton
            ariaDescribedBy={ariaDescribedBy}
            onButtonClick={finishLater}
            buttonText="Finish later"
            buttonClass="usa-button-secondary"
          />
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
