import React, { useState } from 'react';
// import React, { useState } from 'react';

import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useDispatch, useSelector } from 'react-redux';
import { setData } from '~/platform/forms-system/src/js/actions';

const behavioralAnswerFormDataKeys = [
  'workBehaviors',
  'healthBehaviors',
  'otherBehaviors',
  'unlistedBehaviors',
  'behaviorsDetails',
];

function checkAnsweredBehavioralQuestions(formData) {
  return behavioralAnswerFormDataKeys.some(
    key => key in formData && formData[key],
  );
}

// This appears to be working correctly
function handleDeleteBehaviorQuestions(deepFormData, setFormData) {
  const deepClone = structuredClone(deepFormData);

  behavioralAnswerFormDataKeys.forEach(key => {
    delete deepClone[key];
  });

  // Isn't this effectively updating the entire Redux store?
  // Is there a risk of deleting all of a user's progress?
  setFormData(deepClone);
}

// onContinue callback
export function checkShowDeleteBehavioralAnswersModal(formData, setFormData) {
  console.log("On continue callback fired")

  if (
    formData['view:answerCombatBehaviorQuestions'] === 'false' &&
    checkAnsweredBehavioralQuestions(formData)
  ) {
    console.log("Yes answered behavior questions")
    setFormData({ ...formData, optyOutieOnContinue: true });
  }
}

// Validation callback, prevents advancing to next page
export function checkOptingOut(errors, formData) {
  console.log("Validation callback fired")
  if (
    formData['view:answerCombatBehaviorQuestions'] === 'false' &&
    checkAnsweredBehavioralQuestions(formData)
  ) {
    console.log("Error added")
    errors.addError('Show modal');
  }
}

export function DeleteAnswersModal() {
  console.log("Render fired")
  // Need to use useSelector to get access to optyOutieOnContinue
  // formData is empty so we have to go tto the Redux store
  const deepFormData = useSelector(state => state.form.data);
  console.log("optyOutieOnContinue", deepFormData.optyOutieOnContinue)

  const optingOut =
    checkAnsweredBehavioralQuestions(deepFormData) &&
    // This appears to be getting reset to true automatically even before continue is clicked:
    deepFormData.optyOutieOnContinue === true;

  console.log("opting out value", optingOut)


  const [showModal, setShowModal] = useState(optingOut);

  console.log("show modal state", showModal)

  // Will get passed to handleDeleteBehaviorQuestions
  const dispatch = useDispatch();
  const setFormData = data => dispatch(setData(data));

  const closeModal = () => {
    setFormData({ ...deepFormData, optyOutieOnContinue: false });
    setShowModal(false);
  };

  const handlers = {
    confirmDeleteBehavioralQuestions: () => {
      handleDeleteBehaviorQuestions(deepFormData, setFormData);
      closeModal();
    },
    cancelDeleteBehavioralQuestions: () => {
      closeModal();
    },
  };

  return (
    <>
      <VaModal
        modalTitle={'My Modal'}
        visible={showModal}
        onPrimaryButtonClick={handlers.confirmDeleteBehavioralQuestions}
        onSecondaryButtonClick={handlers.cancelDeleteBehavioralQuestions}
        onCloseEvent={handlers.cancelDeleteBehavioralQuestions}
        primaryButtonText={'Change my response'}
        secondaryButtonText={'Cancel and return to claim'}
      >
        {/* TODO: list existing answers  */}
        <p>Stuff</p>
      </VaModal>
    </>
  );
}
