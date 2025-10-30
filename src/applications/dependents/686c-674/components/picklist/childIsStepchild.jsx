import React from 'react';
import PropTypes from 'prop-types';
import {
  VaRadio,
  VaRadioOption,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { scrollToFirstError } from 'platform/utilities/ui';

import { getValue } from './helpers';
import { CancelButton } from '../../config/helpers';
import { calculateAge } from '../../../shared/utils';

const childIsStepchild = {
  handlers: {
    // Return "DONE" when we're done with this flow
    goForward: (/* { itemData, index, fullData } */) =>
      'child-reason-to-remove',
    // return empty path to go to first child page
    // goBack: (/* { itemData, index, fullData } */) => '',

    onSubmit: ({ /* event, */ itemData, goForward }) => {
      // event.preventDefault(); // executed before this function is called
      if (!itemData.isStepchild) {
        setTimeout(scrollToFirstError);
      } else {
        goForward();
      }
    },
  },

  /**
   * Depedent's data
   * @typedef {object} ItemData
   * @property {string} dateOfBirth Dependent's date of birth
   * @property {string} relationshipToVeteran Dependent's relationship
   * @property {string} endType Dependent's removal reason
   */
  /**
   * handlers object
   * @typedef {object} Handlers
   * @property {function} onChange Change handler
   * @property {function} onSubmit Submit handler
   */
  /**
   * Followup Component parameters
   * @param {ItemData} itemData Dependent's data
   * @param {string} fullName Dependent's full name
   * @param {boolean} formSubmitted Whether the form has been submitted
   * @param {string} firstName Dependent's first name
   * @param {object} handlers The handlers for the component
   * @param {function} goBack Function to go back to the previous page
   * @returns React component
   */
  Component: ({ itemData, fullName, handlers, formSubmitted }) => {
    const onChange = event => {
      const { field, value } = getValue(event);
      handlers.onChange({ ...itemData, [field]: value });
    };
    const { labeledAge } = calculateAge(itemData.dateOfBirth, {
      dateInFormat: 'yyyy-MM-dd',
    });

    // remove ' years' and ' old':
    // 'age 11 years old' -> 'age 11' & 'age 5 months old' -> 'age 5 months'
    const cleanAge = labeledAge.replace(' years', '').replace(' old', '');

    return (
      <>
        <VaRadio
          class="vads-u-margin-bottom--2"
          name="isStepchild"
          error={
            formSubmitted && !itemData.isStepchild ? 'Select an option' : null
          }
          label={`Is ${fullName} (age ${cleanAge}) your stepchild?`}
          labelHeaderLevel="3"
          onVaValueChange={onChange}
          required
        >
          <VaRadioOption
            name="isStepchild"
            label="Yes"
            checked={itemData.isStepchild === 'Y'}
            value="Y"
          />
          <VaRadioOption
            name="isStepchild"
            label="No"
            checked={itemData.isStepchild === 'N'}
            value="N"
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

childIsStepchild.propTypes = {
  Component: PropTypes.func,
};

childIsStepchild.Component.propTypes = {
  firstName: PropTypes.string,
  formSubmitted: PropTypes.bool,
  fullName: PropTypes.string,
  goBack: PropTypes.func,
  handlers: PropTypes.shape({
    onChange: PropTypes.func,
    onSubmit: PropTypes.func,
  }),
  itemData: PropTypes.shape({
    dateOfBirth: PropTypes.string,
    relationshipToVeteran: PropTypes.string,
    isStepchild: PropTypes.string,
  }),
};

export default childIsStepchild;
