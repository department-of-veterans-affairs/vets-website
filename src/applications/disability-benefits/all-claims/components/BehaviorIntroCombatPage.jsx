import { VaRadio } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import React from 'react';

import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';
import { mentalHealthSupportAlert } from '../content/form0781';

const BehaviorIntroCombatPage = ({ goBack }) => {
  // TODO: MOVE TO CONTENT FILE
  const combatIntroTitle =
    'Do you want to answer the optional questions about behavorial changes?';

  const combatIntroDescription =
    "We'll now ask you a few questions about the behavioral changes you experienced after combat events. You can choose to answer these questions or skip them. If we need more information, we'll contact you.";

  const answerCombatQuestionsChoice = 'Yes, I want to answer these questions.';
  const optOutOfCombatQuestionsChoice = 'No, I want to skip these questions.';

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
          onVaValueChange={{}}
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
            // checked={true}
            uswds
          />

          <va-radio-option
            key={'no-choice'}
            // id={'no-choice'}
            label={optOutOfCombatQuestionsChoice}
            value={'false'}
            // checked={true}
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

export default BehaviorIntroCombatPage;
