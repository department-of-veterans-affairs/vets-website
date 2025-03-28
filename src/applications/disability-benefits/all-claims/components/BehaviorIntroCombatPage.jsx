import {
  VaModal,
  VaRadio,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import React, { useState } from 'react';

import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';
import { scrollToFirstError } from 'platform/utilities/ui';
import cloneDeep from 'platform/utilities/data/cloneDeep';
import { mentalHealthSupportAlert } from '../content/form0781';
import { hasSelectedBehaviors } from '../content/form0781/behaviorListPages';
import { checkValidations } from '../utils/submit';
import { BehaviorIntroCombatPageModalContent } from './BehaviorIntroCombatPageModalContent';
import {
  answerCombatQuestionsChoice,
  combatIntroDescription,
  combatIntroTitle,
  deleteCombatAnswersModalTitle,
  optOutOfCombatQuestionsChoice,
} from '../content/form0781/behaviorIntroCombatPage';

const DELETABLE_FORM_DATA_KEYS = [
  'workBehaviors',
  'healthBehaviors',
  'otherBehaviors',
  'behaviorsDetails',
];

export const missingSelectionErrorMessage =
  'A response is needed for this question. If you don’t wish to answer optional questions about behavioral changes, you may select ‘no’ and continue.';

const BehaviorIntroCombatPage = ({
  goBack,
  goForward,
  data,
  setFormData,
  contentBeforeButtons,
  contentAfterButtons,
}) => {
  const [optIn, setOptIn] = useState(
    data?.['view:answerCombatBehaviorQuestions'],
    null,
  );

  const [hasError, setHasError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const missingSelection = (error, _fieldData, formData) => {
    if (!formData?.['view:answerCombatBehaviorQuestions']) {
      error.addError?.(missingSelectionErrorMessage);
    }
  };

  // NOTE: this and checkValidaitons is lifted from appeals
  const checkErrors = (formData = data) => {
    const error = checkValidations([missingSelection], optIn, formData);
    const result = error?.[0] || null;

    setHasError(result);
    return result;
  };

  const deleteBehavioralAnswers = () => {
    // Ask roibin about lodash support or look at my notes
    const deepClone = cloneDeep(data);

    DELETABLE_FORM_DATA_KEYS.forEach(key => {
      // Careful about this: JR ran through each key and check data type if string
      // If keys are missing might cause problems
      // Shared funciton: JR has some code we cmnight be able to use
      // DONT DO THIS RESET ALL TO FALSE
      deepClone[key] = {};
    });

    // what happens when you go back? Set this to false when you choose opt in?
    deepClone['view:deletedBehavioralQuestionAnswers'] = true;

    setFormData(deepClone);
  };

  const handlers = {
    onSelection: event => {
      const { value } = event?.detail || {};

      if (value) {
        setOptIn(value);
        const formData = {
          ...data,
          'view:answerCombatBehaviorQuestions': value,
        };
        setFormData(formData);
        // ?????? setFormData lags a little, so check updated data
        checkErrors(formData);
      }
    },
    onSubmit: event => {
      event.preventDefault();
      if (checkErrors()) {
        scrollToFirstError({ focusOnAlertRole: true });
        // hasSelectedBehaviors indicates they checked behavior changes boxes
        // on the next page, behaviorListPage
      } else if (optIn === 'false' && hasSelectedBehaviors(data)) {
        setShowModal(true);
      } else if (optIn) {
        goForward(data);
      }
    },
    onCloseModal: () => {
      setShowModal(false);
    },
    onConfirmDeleteBehavioralAnswers: () => {
      deleteBehavioralAnswers();
      handlers.onCloseModal();
      goForward(data);
    },
    onCancelDeleteBehavioralAnswers: () => {
      handlers.onCloseModal();
    },
  };

  return (
    // TODO: CHECK IF CAN USE HELPER FUNCTION TO RENDER THESE INSTEAD OF INLINE
    <div className="vads-u-margin-y--2">
      <>
        <h3 className="vads-u-font-family--sans vads-u-font-size--base vads-u-font-weight--normal vads-u-margin--0">
          VA FORM 21-0781
        </h3>
        <h3 className="vads-u-font-size--h3 vads-u-color--base vads-u-margin--0">
          Behavioral Changes
        </h3>
      </>

      <p>{combatIntroDescription}</p>

      <VaModal
        modalTitle={deleteCombatAnswersModalTitle}
        visible={showModal}
        onPrimaryButtonClick={handlers.onConfirmDeleteBehavioralAnswers}
        onSecondaryButtonClick={handlers.onCancelDeleteBehavioralAnswers}
        onCloseEvent={handlers.onCancelDeleteBehavioralAnswers}
        primaryButtonText="Skip questions about behavioral changes"
        secondaryButtonText="Cancel and return to claim"
        status="warning"
      >
        <BehaviorIntroCombatPageModalContent formData={data} />
      </VaModal>

      {/* Do we need to register the handler in both the onSubmit and the go forward? */}
      {/* Scott and Allison also noticed it doesn't seem to matter */}
      <form onSubmit={handlers.onSubmit}>
        <div />
        <VaRadio
          class="vads-u-margin-y--2"
          label={combatIntroTitle}
          label-header-level={4}
          error={hasError}
          onVaValueChange={handlers.onSelection}
          required
          // Think we need this but not sure why:
          uswds
        >
          <va-radio-option
            key="yes-choice"
            label={answerCombatQuestionsChoice}
            value="true"
            checked={optIn === 'true'}
            uswds
          />

          <va-radio-option
            key="no-choice"
            label={optOutOfCombatQuestionsChoice}
            value="false"
            checked={optIn === 'false'}
            uswds
          />
        </VaRadio>
        <>{mentalHealthSupportAlert()}</>
        {contentBeforeButtons}
        <FormNavButtons
          goBack={goBack}
          goForward={handlers.onSubmit}
          submitToContinue
        />
        {contentAfterButtons}
      </form>
    </div>
  );
};

// Proptypes validation?
// Look at JR's example

export default BehaviorIntroCombatPage;
