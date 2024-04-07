import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  VaButtonPair,
  VaRadio,
  VaRadioOption,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  navigateBackward,
  navigateForward,
} from '../../../../utilities/page-navigation';
import { applyFocus, applyErrorFocus } from '../../../../utilities/page-setup';
import { cleanUpAnswers } from '../../../../utilities/answer-cleanup';
import { updateFormStore } from '../../../../actions';
import { determineErrorMessage } from '../../../../utilities/shared';

const RadioGroup = ({
  formError,
  formResponses,
  formValue,
  H1,
  responses,
  router,
  setFormError,
  shortName,
  testId,
  valueSetter,
  updateCleanedFormStore,
}) => {
  const [headerHasFocused, setHeaderHasFocused] = useState(false);
  const [valueHasChanged, setValueHasChanged] = useState(false);

  const onContinueClick = () => {
    if (!formValue) {
      setFormError(true);
      applyErrorFocus('duw-radio');
    } else {
      if (valueHasChanged) {
        // Remove answers from the Redux store if the display path ahead has changed
        cleanUpAnswers(formResponses, updateCleanedFormStore, shortName);
      }

      setFormError(false);
      navigateForward(shortName, formValue, router, formResponses);
    }
  };

  const onBackClick = () => {
    navigateBackward(router);
  };

  const onValueChange = value => {
    valueSetter(value);
    if (formValue) {
      setValueHasChanged(true);
    }

    if (value) {
      setFormError(false);
    }
  };

  const renderRadioOptions = () => {
    return responses.map((response, index) => {
      return (
        <VaRadioOption
          key={index}
          checked={formValue === response}
          data-testid="va-radio-option"
          label={response}
          name="group"
          value={response}
          uswds
        />
      );
    });
  };

  return (
    <>
      <VaRadio
        class="vads-u-margin-top--6"
        data-testid={testId}
        form-heading={H1}
        form-heading-level={1}
        error={formError ? determineErrorMessage(shortName) : null}
        id="duw-radio"
        onVaValueChange={e => onValueChange(e.detail.value)}
        onLoad={applyFocus('duw-radio', headerHasFocused, setHeaderHasFocused)}
        use-forms-pattern="single"
        uswds
      >
        {renderRadioOptions()}
      </VaRadio>
      <VaButtonPair
        class="vads-u-margin-top--3"
        data-testid="duw-buttonPair"
        onPrimaryClick={onContinueClick}
        onSecondaryClick={onBackClick}
        continue
        uswds
      />
    </>
  );
};

RadioGroup.propTypes = {
  formError: PropTypes.bool.isRequired,
  formResponses: PropTypes.object.isRequired,
  H1: PropTypes.string.isRequired,
  responses: PropTypes.arrayOf(PropTypes.string).isRequired,
  router: PropTypes.object.isRequired,
  setFormError: PropTypes.func.isRequired,
  shortName: PropTypes.string.isRequired,
  testId: PropTypes.string.isRequired,
  updateCleanedFormStore: PropTypes.func.isRequired,
  valueSetter: PropTypes.func.isRequired,
  formValue: PropTypes.string,
};

const mapDispatchToProps = {
  updateCleanedFormStore: updateFormStore,
};

export default connect(
  null,
  mapDispatchToProps,
)(RadioGroup);
