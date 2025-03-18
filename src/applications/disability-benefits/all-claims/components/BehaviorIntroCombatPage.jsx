import {
  VaModal,
  VaRadio,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import React, { useState } from 'react';

import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';
import { mentalHealthSupportAlert } from '../content/form0781';
import { checkValidations } from '../../../appeals/shared/validations';
import { scrollToFirstError } from 'platform/utilities/ui';
import { hasSelectedBehaviors } from '../content/form0781/behaviorListPages';
import {
  ALL_BEHAVIOR_CHANGE_DESCRIPTIONS,
  BEHAVIOR_LIST_SECTION_SUBTITLES,
} from '../constants';

const DELETABLE_FORM_DATA_KEYS = [
  'workBehaviors',
  'healthBehaviors',
  'otherBehaviors',
  'behaviorsDetails',
];

const BehaviorIntroCombatPage = ({ goBack, goForward, data, setFormData }) => {
  // TODO: MOVE TO CONTENT FILE
  const combatIntroTitle =
    'Do you want to answer the optional questions about behavorial changes?';

  const combatIntroDescription =
    "We'll now ask you a few questions about the behavioral changes you experienced after combat events. You can choose to answer these questions or skip them. If we need more information, we'll contact you.";

  const answerCombatQuestionsChoice = 'Yes, I want to answer these questions.';
  const optOutOfCombatQuestionsChoice = 'No, I want to skip these questions.';

  const missingSelectionErrorMessage =
    'A response is needed for this question. If you don’t wish to answer optional questions about behavioral changes, you may select ‘no’ and continue.';

  const selectionField = 'view:answerCombatBehaviorQuestions';

  const deleteCombatAnswersModalTitle =
    'Change to skip questions about behavioral changes?';

  const [optIn, setOptIn] = useState(
    data?.['view:answerCombatBehaviorQuestions'],
    null,
  );

  const [hasError, setHasError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const missingSelection = (error, _fieldData, formData) => {
    if (!formData?.[selectionField]) {
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
    const deepClone = structuredClone(data);

    DELETABLE_FORM_DATA_KEYS.forEach(key => {
      deepClone[key] = {};
    });

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

  const modalContent = () => {
    const allBehaviorTypes = {
      ...data.workBehaviors,
      ...data.healthBehaviors,
      ...data.otherBehaviors,
    };

    const allSelectedBehaviorTypes = Object.entries(allBehaviorTypes)
      .filter(([, value]) => value === true)
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});

    const behaviors = Object.keys(ALL_BEHAVIOR_CHANGE_DESCRIPTIONS).map(
      behaviorType => {
        if (behaviorType in allSelectedBehaviorTypes) {
          return behaviorType === 'unlisted'
            ? BEHAVIOR_LIST_SECTION_SUBTITLES.other
          : ALL_BEHAVIOR_CHANGE_DESCRIPTIONS[behaviorType];
        }
    });

    // Some of these are undefined for whatever reason. Why?
    const describedBehaviors = behaviors.filter(
      element => element !== undefined,
    );

    const describedBehaviorsCount = describedBehaviors.length;
    const firstThreeBehaviors = describedBehaviors.slice(0, 2);
    const remainingBehaviors = describedBehaviorsCount - 3;

    return (
      <>
        <h4 className="vads-u-font-size--h4 vads-u-color--base vads-u-margin--0">
          {deleteCombatAnswersModalTitle}
        </h4>
        <p>
          <b>What to know:</b>
          If you change to skip questions about behavioral changes, we’ll remove
          information you provided about these behavioral changes:
        </p>
        <ul>
          {firstThreeBehaviors.map((behaviorDescription, i) => (
            <li key={i}>{behaviorDescription}</li>
          ))}
          {remainingBehaviors > 0 && (
            <li>
              And, <b>{remainingBehaviors} other behavioral changes</b>{' '}
            </li>
          )}
        </ul>
        <p>
          <b>Do you want to skip questions about behavioral challenges?</b>
        </p>
      </>
    );
  };

  return (
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
        // modalTitle={deleteCombatAnswersModalTitle}
        // Temporary to see the modal on load:
        visible={showModal}
        onPrimaryButtonClick={handlers.onConfirmDeleteBehavioralAnswers}
        onSecondaryButtonClick={handlers.onCancelDeleteBehavioralAnswers}
        onCloseEvent={handlers.onCancelDeleteBehavioralAnswers}
        primaryButtonText={'Change my response'}
        secondaryButtonText={'Cancel and return to claim'}
        status="warning"
      >
        {/* TODO: is function call correct way to do this? */}
        {modalContent()}
      </VaModal>

      {/* Do we need to register the handler in both the onSubmit and the go forward? */}
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
        <FormNavButtons goBack={goBack} goForward={handlers.onSubmit} />
      </form>
    </div>
  );
};

// TODO: PROPS VALIDATION
export default BehaviorIntroCombatPage;
