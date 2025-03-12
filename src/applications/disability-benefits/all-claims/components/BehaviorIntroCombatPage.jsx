import { VaRadio } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import React, { useState } from 'react';

import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';
import { mentalHealthSupportAlert } from '../content/form0781';

const BehaviorIntroCombatPage = ({ goBack, data, setFormData }) => {
  // TODO: MOVE TO CONTENT FILE
  const combatIntroTitle =
    'Do you want to answer the optional questions about behavorial changes?';

  const combatIntroDescription =
    "We'll now ask you a few questions about the behavioral changes you experienced after combat events. You can choose to answer these questions or skip them. If we need more information, we'll contact you.";

  const answerCombatQuestionsChoice = 'Yes, I want to answer these questions.';
  const optOutOfCombatQuestionsChoice = 'No, I want to skip these questions.';

  const [optIn, setOptIn] = useState(
    data?.['view:answerCombatBehaviorQuestions'],
    null,
  );

  const handlers = {
    onSelection: event => {
      const { selection } = event?.detail || {};
      if (selection) {
        setOptIn(selection);

        const formData = {
          ...data,
          'view:answerCombatBehaviorQuestions': event.detail?.value,
        };
        setFormData(formData);
        // ?????? setFormData lags a little, so check updated data
        // checkErrors(formData);

        // Think this is DOMO stuff:
        // recordEvent({
        //   event: 'int-radio-button-option-click',
        //   'radio-button-label': content.label,
        //   'radio-button-optionLabel': content[`${value}Label`],
        //   'radio-button-required': false,
        // });
      }
    },
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

      <form>
        <div />
        <VaRadio
          class="vads-u-margin-y--2"
          label={combatIntroTitle}
          label-header-level={4}
          // error={}
          onVaValueChange={handlers.onSelection}
          required
          // Think we need this but not sure why:
          uswds
        >
          <va-radio-option
            key={'yes-choice'}
            label={answerCombatQuestionsChoice}
            // id={'yes-choice'}
            // These are strings in the existing implementation:
            value={'true'}
            checked={optIn === 'true'}
            uswds
          />

          <va-radio-option
            key={'no-choice'}
            // id={'no-choice'}
            label={optOutOfCombatQuestionsChoice}
            value={'false'}
            checked={optIn === 'false'}
            uswds
          />
        </VaRadio>
        {/* This works but this cannot be kosher (function call): */}
        <>{mentalHealthSupportAlert()}</>
        <FormNavButtons goBack={goBack} goForward={() => {}} />
      </form>
    </div>
  );
};

// TODO: PROPS VALIDATION

export default BehaviorIntroCombatPage;
