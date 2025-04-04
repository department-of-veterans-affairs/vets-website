import {
  VaAlert,
  VaModal,
  VaRadio,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import React, { useRef, useEffect, useState } from 'react';

import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';
import { scrollToFirstError, scrollAndFocus } from 'platform/utilities/ui';
import cloneDeep from 'platform/utilities/data/cloneDeep';
import PropTypes from 'prop-types';
import {
  form0781HeadingTag,
  mentalHealthSupportAlert,
  titleWithTag,
} from '../content/form0781';
import {
  behaviorPageTitle,
  hasSelectedBehaviors,
} from '../content/form0781/behaviorListPages';
import { checkValidations } from '../../../appeals/shared/validations';

import { BehaviorIntroCombatPageModalContent } from './BehaviorIntroCombatPageModalContent';
import {
  answerCombatQuestionsChoice,
  combatIntroDescription,
  combatIntroTitle,
  // deleteCombatAnswersModalTitle,
  missingSelectionErrorMessage,
  optOutOfCombatQuestionsChoice,
} from '../content/form0781/behaviorIntroCombatPage';

const DELETABLE_FORM_DATA_KEYS = [
  'workBehaviors',
  'healthBehaviors',
  'otherBehaviors',
  'behaviorsDetails',
];

/**
 * Opt-in/out page to share information on how a condition affected a veteran's behaviors
 *
 * A modal will display on this page if a user:
 * 1. Selects the option to share information about how the condition affected their behavior
 * 2. Starts filling in information about behavioral changes in the next few pages
 * 3. Changes their mind, goes back to this page and changes their answer to "opt out"
 *
 * The modal tells the Veteran that if they opt out after already answering behavioral questions, this will also delete their answers to those questions. Confirming they want to take this action will delete their behavioral question answers and display an alert indicating the answers were deleted.
 */
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

  const [hasValidationError, setHasValidationError] = useState(null);
  const [showDeleteAnswersModal, setShowDeleteAnswersModal] = useState(false);
  const [
    showDeletedAnswerConfirmation,
    setShowDeletedAnswerConfirmation,
  ] = useState(false);

  const deletedAnswerConfirmationRef = useRef(null);

  useEffect(
    () => {
      if (
        showDeletedAnswerConfirmation &&
        deletedAnswerConfirmationRef.current
      ) {
        deletedAnswerConfirmationRef.current.focus();
      }
    },
    [showDeletedAnswerConfirmation],
  );

  const modalRef = useRef(null);
  useEffect(
    () => {
      if (showDeleteAnswersModal && modalRef.current) {
        const modalHeading = document.querySelector('h4');
        scrollAndFocus(modalHeading);
      }
    },
    [showDeleteAnswersModal],
  );

  const missingSelection = (error, _fieldData, formData) => {
    if (!formData?.['view:answerCombatBehaviorQuestions']) {
      error.addError?.(missingSelectionErrorMessage);
    }
  };

  const checkErrors = (formData = data) => {
    const error = checkValidations([missingSelection], optIn, formData);
    const result = error?.[0] || null;

    setHasValidationError(result);
    return result;
  };

  const deleteBehavioralAnswers = () => {
    const deepClone = cloneDeep(data);

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
        // setFormData lags a little, so check updated data
        checkErrors(formData);
      }
    },
    onSubmit: event => {
      event.preventDefault();
      if (checkErrors()) {
        scrollToFirstError({ focusOnAlertRole: true });
        // hasSelectedBehaviors returns true if user selected behaviors already on the succeeding page, BehaviorListPage
      } else if (optIn === 'false' && hasSelectedBehaviors(data)) {
        setShowDeleteAnswersModal(true);
      } else if (optIn) {
        goForward(data);
      }
    },
    onCloseModal: () => {
      setShowDeleteAnswersModal(false);
    },
    onConfirmDeleteBehavioralAnswers: () => {
      deleteBehavioralAnswers();
      handlers.onCloseModal();
      setShowDeletedAnswerConfirmation(true);
    },
    onCancelDeleteBehavioralAnswers: () => {
      handlers.onCloseModal();
    },
    onCloseDeletedAnswersAlert: () => {
      setShowDeletedAnswerConfirmation(false);
    },
    onClickConfirmationLink: () => {
      goForward(data);
    },
  };

  return (
    <div className="vads-u-margin-y--2">
      <div className="vads-u-margin-bottom--1">
        <VaAlert
          ref={deletedAnswerConfirmationRef}
          closeBtnAriaLabel="Deleted answers confirmation"
          closeable
          onCloseEvent={handlers.onCloseDeletedAnswersAlert}
          fullWidth="false"
          slim
          status="success"
          visible={showDeletedAnswerConfirmation}
          uswds
          tabIndex="-1"
        >
          <p className="vads-u-margin-y--0">
            We’ve removed information about your behavioral changes.
          </p>
          <p>
            <button
              type="button"
              className="va-button-link"
              onClick={() => goForward(data)}
            >
              Continue with your claim
            </button>{' '}
          </p>
        </VaAlert>
      </div>

      {titleWithTag(behaviorPageTitle, form0781HeadingTag)}

      <p>{combatIntroDescription}</p>

      <VaModal
        visible={showDeleteAnswersModal}
        onPrimaryButtonClick={handlers.onConfirmDeleteBehavioralAnswers}
        onSecondaryButtonClick={handlers.onCancelDeleteBehavioralAnswers}
        onCloseEvent={handlers.onCancelDeleteBehavioralAnswers}
        primaryButtonText="Yes, skip these questions"
        secondaryButtonText="No, return to claim"
        status="warning"
      >
        <BehaviorIntroCombatPageModalContent formData={data} ref={modalRef} />
      </VaModal>

      <form onSubmit={handlers.onSubmit}>
        <div />
        <VaRadio
          class="vads-u-margin-y--2"
          label={combatIntroTitle}
          label-header-level={4}
          error={hasValidationError}
          onVaValueChange={handlers.onSelection}
          required
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

BehaviorIntroCombatPage.propTypes = {
  contentAfterButtons: PropTypes.element,
  contentBeforeButtons: PropTypes.element,
  data: PropTypes.object,
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  goToPath: PropTypes.func,
  setFormData: PropTypes.func,
};

export default BehaviorIntroCombatPage;
