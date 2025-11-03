import React from 'react';
import { VaMemorableDate } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { scrollToFirstError } from 'platform/utilities/ui';

import { getValue } from './helpers';
import propTypes from './types';

const stepchildLeftHousehold = {
  handlers: {
    goForward: () => 'DONE',

    onSubmit: ({ /* event, */ itemData, goForward }) => {
      // event.preventDefault(); // executed before this function is called
      if (!itemData.dateStepchildLeftHousehold) {
        setTimeout(scrollToFirstError);
      } else {
        goForward();
      }
    },
  },

  /** @type {PicklistComponentProps} */
  Component: ({
    itemData,
    formSubmitted,
    firstName,
    handlers,
    returnToMainPage,
  }) => {
    if (
      !itemData.dateOfBirth ||
      itemData.relationshipToVeteran !== 'Child' ||
      itemData.isStepchild !== 'Y' ||
      itemData.removalReason !== 'stepchildNotMember'
    ) {
      returnToMainPage();
      return null;
    }

    const onChange = event => {
      const { field, value } = getValue(event);
      handlers.onChange({ ...itemData, [field]: value });
    };

    return (
      <>
        <h3 className="vads-u-margin-top--0 vads-u-margin-bottom--2">
          When did {firstName} stop living with you?
        </h3>

        <VaMemorableDate
          name="dateStepchildLeftHousehold"
          label="Date stepchild left your household"
          error={
            formSubmitted && !itemData.dateStepchildLeftHousehold
              ? 'Provide a date'
              : null
          }
          monthSelect
          value={itemData.dateStepchildLeftHousehold || ''}
          // use onDateBlur to ensure month & day are zero-padded
          onDateBlur={onChange}
          required
        />
      </>
    );
  },
};

stepchildLeftHousehold.propTypes = propTypes.Page;
stepchildLeftHousehold.Component.propTypes = propTypes.Component;

export default stepchildLeftHousehold;
