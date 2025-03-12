import { VaRadio } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import React from 'react';

import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';
// import { mentalHealthSupportAlert, mentalHealthSupportAlertInlineImportable } from '../content/form0781';

const BehaviorIntroCombatPage = ({ goBack }) => {
  // TODO: MOVE TO CONTENT FILE
  const combatIntroTitle =
    'Do you want to answer the optional questions about behavorial changes?';

  const answerCombatQuestionsChoice = 'Yes, I want to answer these questions.';
  const optOutOfCombatQuestionsChoice = 'No, I want to skip these questions.';

  return (
    <div className="vads-u-margin-y--2">
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
        {/* This is borokeies */}
        {/* <>{mentalHealthSupportAlertInlineImportable}</> */}
        <FormNavButtons goBack={goBack} goForward={() => {}} />
      </form>
    </div>
  );
};

export default BehaviorIntroCombatPage;
