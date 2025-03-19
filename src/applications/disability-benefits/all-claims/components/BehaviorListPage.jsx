import React, { useState } from 'react';
import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';

import {
  VaTextInput,
  VaSelect,
  VaCheckboxGroup,
  VaCheckbox,
  VaDate,
  VaMemorableDate,
  VaModal,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import {
  behaviorListDescription,
  behaviorListNoneLabel,
  behaviorListAdditionalInformation,
  behaviorListPageTitle,
  validateBehaviorSelections,
  behaviorListValidationError,
  showConflictingAlert,
} from '../content/form0781/behaviorListPages';

import {
  BEHAVIOR_LIST_SECTION_SUBTITLES,
  BEHAVIOR_CHANGES_WORK,
  BEHAVIOR_CHANGES_HEALTH,
  BEHAVIOR_CHANGES_OTHER,
} from '../constants';

const BehaviorListPage = ({ goBack }) => {
  return (
    <>
      <div className="vads-u-margin-y--2">
        <>
          <h3 className="vads-u-font-family--sans vads-u-font-size--base vads-u-font-weight--normal vads-u-margin--0">
            VA FORM 21-0781
          </h3>
          <h3 className="vads-u-font-size--h3 vads-u-color--base vads-u-margin--0">
            CUSTOM FORM! Types of behavioral changes. CUSTOM FORM!! ~~
          </h3>
        </>
      </div>
      <FormNavButtons goBack={goBack} goForward={() => { }} />
    </>
  );
};
export default BehaviorListPage;
