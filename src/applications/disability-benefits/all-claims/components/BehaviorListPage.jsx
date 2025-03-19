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
  BEHAVIOR_LIST_HINTS,
} from '../constants';
import {
  form0781HeadingTag,
  mentalHealthSupportAlert,
} from '../content/form0781';

const BehaviorListPage = ({ goBack }) => {
  return (
    <>
      <div className="vads-u-margin-y--2">
        <>
          <h3 className="vads-u-font-family--sans vads-u-font-size--base vads-u-font-weight--normal vads-u-margin--0">
            {form0781HeadingTag}
          </h3>
          <h3 className="vads-u-font-size--h3 vads-u-color--base vads-u-margin--0">
            {behaviorListPageTitle}
          </h3>
        </>
        {behaviorListDescription}

        <VaCheckboxGroup
          label={BEHAVIOR_LIST_SECTION_SUBTITLES.work}
          label-header-level={4}
          name="workBehaviors"
          hint={BEHAVIOR_LIST_HINTS.work}
          // onVaChange={handlers.onIssueChange}
          // onBlur={handlers.onBlur}
          // error={showError('issues')}
          // required
          uswds
        >
          {Object.entries(BEHAVIOR_CHANGES_WORK).map(([key, value, index]) => (
            <va-checkbox
              key={key}
              name="workBehaviors"
              // class="dd-privacy-hidden"
              // data-dd-action-name="issue name"
              label={value}
              value={key}
              checked={false}
              // TODO checked={(formData?.workBehaviors || []).includes(behavior)}
              uswds
            />
          ))}
        </VaCheckboxGroup>
        <VaCheckboxGroup
          label={BEHAVIOR_LIST_SECTION_SUBTITLES.health}
          label-header-level={4}
          name="healthBehaviors"
          hint={BEHAVIOR_LIST_HINTS.health}
          // onVaChange={handlers.onIssueChange}
          // onBlur={handlers.onBlur}
          // error={showError('issues')}
          // required
          uswds
        >
          {Object.entries(BEHAVIOR_CHANGES_HEALTH).map(
            ([key, value, index]) => (
              <va-checkbox
                key={key}
                name="healthBehaviors"
                // class="dd-privacy-hidden"
                // data-dd-action-name="issue name"
                label={value}
                value={key}
                checked={false}
                // TODO checked={(formData?.workBehaviors || []).includes(behavior)}
                uswds
              />
            ),
          )}
        </VaCheckboxGroup>
        <VaCheckboxGroup
          label={BEHAVIOR_LIST_SECTION_SUBTITLES.other}
          label-header-level={4}
          name="otherBehaviors"
          form-heading-level={4}
          hint={BEHAVIOR_LIST_HINTS.other}
          // onVaChange={handlers.onIssueChange}
          // onBlur={handlers.onBlur}
          // error={showError('issues')}
          // required
          uswds
        >
          {Object.entries(BEHAVIOR_CHANGES_OTHER).map(
            ([key, value, index]) => (
              <va-checkbox
                key={key}
                name="otherBehaviors"
                // class="dd-privacy-hidden"
                // data-dd-action-name="issue name"
                label={value}
                value={key}
                checked={false}
                // TODO checked={(formData?.workBehaviors || []).includes(behavior)}
                uswds
              />
            ),
          )}
        </VaCheckboxGroup>
        <VaCheckboxGroup
          label={BEHAVIOR_LIST_SECTION_SUBTITLES.none}
          label-header-level={4}
          name="noBehaviors"
          hint={BEHAVIOR_LIST_HINTS.none}
          // onVaChange={handlers.onIssueChange}
          // onBlur={handlers.onBlur}
          // error={showError('issues')}
          // required
          uswds
        >
          <va-checkbox
            key="TODOkey"
            name="noBehaviorChanges"
            // class="dd-privacy-hidden"
            // data-dd-action-name="issue name"
            label={behaviorListNoneLabel}
            value="none"
            checked={false}
            // TODO checked={(formData?.workBehaviors || []).includes(behavior)}
            uswds
          />
        </VaCheckboxGroup>

        {behaviorListAdditionalInformation}
        <>{mentalHealthSupportAlert()}</>
      </div>
      <FormNavButtons goBack={goBack} goForward={() => { }} />
    </>
  );
};
export default BehaviorListPage;
