import React from 'react';
import {
  VaRadio,
  VaRadioOption,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { scrollToFirstError } from 'platform/utilities/ui';

import { CancelButton } from '../../config/helpers';

import { labels } from './utils';
import propTypes from './types';

const spouseReasonToRemove = {
  handlers: {
    goForward: ({ itemData /* , _index, _fullData */ }) =>
      itemData.removalReason === 'marriageEnded'
        ? 'spouse-marriage-ended'
        : 'spouse-death',

    onSubmit: ({ /* event, */ itemData, goForward }) => {
      // event.preventDefault(); // executed before this function is called
      if (!itemData.removalReason) {
        setTimeout(scrollToFirstError);
      } else {
        goForward();
      }
    },
  },

  /** @type {PicklistComponentProps} */
  Component: ({
    itemData,
    fullName,
    formSubmitted,
    handlers,
    isEditing,
    returnToMainPage,
  }) => {
    if (!itemData.dateOfBirth || itemData.relationshipToVeteran !== 'Spouse') {
      returnToMainPage();
      return null;
    }

    const onChange = event => {
      const { value } = event.detail;
      // Pass updated itemData to handler.onChange
      handlers.onChange({ ...itemData, removalReason: value });
    };

    return (
      <>
        <h3 className="vads-u-margin-top--0 vads-u-margin-bottom--2">
          {labels.Spouse.removalReasonTitle(fullName, isEditing)}
        </h3>
        <VaRadio
          class="vads-u-margin-bottom--2"
          error={
            formSubmitted && !itemData.removalReason
              ? labels.Spouse.removalReasonError
              : null
          }
          label={labels.Spouse.removalReason}
          hint={labels.Spouse.removalReasonHint}
          onVaValueChange={onChange}
          required
        >
          <VaRadioOption
            name="removalReason"
            label={labels.Spouse.marriageEnded}
            checked={itemData.removalReason === 'marriageEnded'}
            value="marriageEnded"
          />
          <VaRadioOption
            name="removalReason"
            label={labels.Spouse.death}
            checked={itemData.removalReason === 'death'}
            value="death"
          />
        </VaRadio>

        <CancelButton
          dependentType={itemData.relationshipToVeteran?.toLowerCase()}
          removePath="options-selection/remove-active-dependents"
        />
      </>
    );
  },
};

spouseReasonToRemove.propTypes = propTypes.Page;
spouseReasonToRemove.Component.propTypes = propTypes.Component;

export default spouseReasonToRemove;
