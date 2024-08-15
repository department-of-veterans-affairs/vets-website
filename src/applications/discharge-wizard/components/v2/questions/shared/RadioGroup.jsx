import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  VaButtonPair,
  VaRadio,
  VaRadioOption,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { forkableQuestions } from '../../../../constants';
import {
  navigateBackward,
  navigateForward,
} from '../../../../utilities/page-navigation';
import { applyFocus, applyErrorFocus } from '../../../../utilities/page-setup';
import { cleanUpAnswers } from '../../../../utilities/answer-cleanup';
import {
  updateEditMode,
  updateFormStore,
  updateQuestionFlowChanged,
  updateRouteMap,
} from '../../../../actions';
import { determineErrorMessage } from '../../../../utilities/shared';

const RadioGroup = ({
  formError,
  formResponses,
  formValue,
  hint,
  H1,
  responses,
  router,
  setFormError,
  shortName,
  testId,
  valueSetter,
  updateCleanedFormStore,
  editMode,
  toggleEditMode,
  toggleQuestionsFlowChanged,
  routeMap,
  setRouteMap,
  questionFlowChanged,
}) => {
  const [headerHasFocused, setHeaderHasFocused] = useState(false);
  const [valueHasChanged, setValueHasChanged] = useState(false);

  const isForkableQuestion = forkableQuestions.includes(shortName);

  const onContinueClick = () => {
    if (!formValue) {
      setFormError(true);
      applyErrorFocus('duw-radio');
    } else {
      if (valueHasChanged) {
        // Remove answers from the Redux store if the display path ahead has changed
        cleanUpAnswers(formResponses, updateCleanedFormStore, shortName);

        // Set the question flow changed flag to true for review page alert for forkable questions.
        if (isForkableQuestion && editMode) {
          toggleQuestionsFlowChanged(true);
        }
      }

      toggleEditMode(false);
      setFormError(false);
      navigateForward(
        shortName,
        formResponses,
        router,
        editMode,
        setRouteMap,
        routeMap,
        questionFlowChanged,
      );
    }
  };

  const onBackClick = () => {
    if (valueHasChanged && editMode && isForkableQuestion) {
      cleanUpAnswers(formResponses, updateCleanedFormStore, shortName);
    }
    toggleEditMode(false);
    navigateBackward(
      router,
      setRouteMap,
      routeMap,
      shortName,
      editMode,
      isForkableQuestion,
      valueHasChanged,
    );
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
        class="xsmall-screen:vads-u-margin-top--0"
        data-testid={testId}
        form-heading={H1}
        form-heading-level={1}
        error={formError ? determineErrorMessage(shortName) : null}
        id="duw-radio"
        onVaValueChange={e => onValueChange(e.detail.value)}
        onLoad={applyFocus('duw-radio', headerHasFocused, setHeaderHasFocused)}
        use-forms-pattern="single"
      >
        {renderRadioOptions()}
        {hint && (
          <div slot="form-description">
            <p>{hint}</p>
          </div>
        )}
      </VaRadio>
      {editMode &&
        forkableQuestions.includes(shortName) && (
          <va-alert-expandable
            class="vads-u-margin-top--4"
            status="info"
            trigger="Changing your answer may lead to a new set of questions."
          >
            If you change your answer to this question, you may be asked for
            more information to ensure that we provide you with the best
            results.
          </va-alert-expandable>
        )}
      <VaButtonPair
        class="vads-u-margin-top--3 small-screen:vads-u-margin-x--0p5"
        data-testid="duw-buttonPair"
        onPrimaryClick={onContinueClick}
        onSecondaryClick={onBackClick}
        continue
      />
    </>
  );
};

RadioGroup.propTypes = {
  editMode: PropTypes.bool.isRequired,
  formError: PropTypes.bool.isRequired,
  formResponses: PropTypes.object.isRequired,
  H1: PropTypes.string.isRequired,
  questionFlowChanged: PropTypes.bool.isRequired,
  responses: PropTypes.arrayOf(PropTypes.string).isRequired,
  routeMap: PropTypes.array.isRequired,
  router: PropTypes.object.isRequired,
  setFormError: PropTypes.func.isRequired,
  setRouteMap: PropTypes.func.isRequired,
  shortName: PropTypes.string.isRequired,
  testId: PropTypes.string.isRequired,
  toggleEditMode: PropTypes.func.isRequired,
  toggleQuestionsFlowChanged: PropTypes.func.isRequired,
  updateCleanedFormStore: PropTypes.func.isRequired,
  valueSetter: PropTypes.func.isRequired,
  formValue: PropTypes.string,
  hint: PropTypes.string,
};

const mapDispatchToProps = {
  updateCleanedFormStore: updateFormStore,
  toggleEditMode: updateEditMode,
  toggleQuestionsFlowChanged: updateQuestionFlowChanged,
  setRouteMap: updateRouteMap,
};

const mapStateToProps = state => ({
  editMode: state?.dischargeUpgradeWizard?.duwForm?.editMode,
  routeMap: state?.dischargeUpgradeWizard?.duwForm?.routeMap,
  questionFlowChanged:
    state?.dischargeUpgradeWizard?.duwForm?.questionFlowChanged,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RadioGroup);
