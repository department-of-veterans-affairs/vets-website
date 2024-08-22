import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  VaSelect,
  VaButtonPair,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { waitForRenderThenFocus } from '@department-of-veterans-affairs/platform-utilities/ui';
import { forkableQuestions } from '../../../../constants';
import {
  navigateBackward,
  navigateForward,
} from '../../../../utilities/page-navigation';
import { cleanUpAnswers } from '../../../../utilities/answer-cleanup';
import {
  updateEditMode,
  updateFormStore,
  updateQuestionFlowChanged,
  updateRouteMap,
} from '../../../../actions';
import {
  determineErrorMessage,
  determineLabel,
} from '../../../../utilities/shared';
import { applyErrorFocus } from '../../../../utilities/page-setup';

const Dropdown = ({
  shortName,
  router,
  formResponses,
  formValue,
  formError,
  options,
  H1,
  valueSetter,
  setFormError,
  testId,
  updateCleanedFormStore,
  editMode,
  toggleEditMode,
  toggleQuestionsFlowChanged,
  setRouteMap,
  routeMap,
  questionFlowChanged,
}) => {
  const [valueHasChanged, setValueHasChanged] = useState(false);
  const isForkableQuestion = forkableQuestions.includes(shortName);

  useEffect(() => {
    waitForRenderThenFocus('h1');
  }, []);

  const onValueChange = value => {
    valueSetter(value);

    if (formValue) {
      setValueHasChanged(true);
    }

    if (value) {
      setFormError(false);
    }
  };

  const onContinueClick = () => {
    if (!formValue) {
      setFormError(true);
      applyErrorFocus('duw-dropdown');
    } else {
      if (valueHasChanged) {
        // Remove answers from the Redux store if the display path ahead will change.
        cleanUpAnswers(formResponses, updateCleanedFormStore, shortName);

        if (forkableQuestions.includes(shortName) && editMode) {
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
    navigateBackward(router, setRouteMap, routeMap, editMode);
  };

  return (
    <>
      <h1>{H1}</h1>
      <VaSelect
        autocomplete="false"
        className="vads-u-margin-top--6"
        id="duw-dropdown"
        data-testid={testId}
        enable-analytics={false}
        label={determineLabel(shortName)}
        error={formError ? determineErrorMessage(shortName) : null}
        name={`${shortName}_dropdown`}
        value={formValue || ''}
        onVaSelect={e => onValueChange(e.detail.value)}
      >
        {options}
      </VaSelect>
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

Dropdown.propTypes = {
  formError: PropTypes.bool.isRequired,
  formResponses: PropTypes.object.isRequired,
  H1: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  router: PropTypes.object.isRequired,
  setFormError: PropTypes.func.isRequired,
  shortName: PropTypes.string.isRequired,
  testId: PropTypes.string.isRequired,
  updateCleanedFormStore: PropTypes.func.isRequired,
  valueSetter: PropTypes.func.isRequired,
  editMode: PropTypes.bool.isRequired,
  questionFlowChanged: PropTypes.bool.isRequired,
  toggleEditMode: PropTypes.func.isRequired,
  routeMap: PropTypes.array.isRequired,
  toggleQuestionsFlowChanged: PropTypes.func.isRequired,
  setRouteMap: PropTypes.func.isRequired,
  formValue: PropTypes.string,
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
)(Dropdown);
