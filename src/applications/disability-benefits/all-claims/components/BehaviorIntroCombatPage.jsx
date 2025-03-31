import {
  VaModal,
  VaRadio,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import React, { useState } from 'react';

import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';
import { scrollToFirstError } from 'platform/utilities/ui';
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
  deleteCombatAnswersModalTitle,
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

  const [hasError, setHasError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const missingSelection = (error, _fieldData, formData) => {
    if (!formData?.['view:answerCombatBehaviorQuestions']) {
      error.addError?.(missingSelectionErrorMessage);
    }
  };

  const checkErrors = (formData = data) => {
    const error = checkValidations([missingSelection], optIn, formData);
    const result = error?.[0] || null;

    setHasError(result);
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
    <div className="vads-u-margin-y--2">
      {titleWithTag(behaviorPageTitle, form0781HeadingTag)}

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

      <form onSubmit={handlers.onSubmit}>
        <div />
        <VaRadio
          class="vads-u-margin-y--2"
          label={combatIntroTitle}
          label-header-level={4}
          error={hasError}
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
