import React from 'react';
import PropTypes from 'prop-types';
import { VaMemorableDate } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { scrollToFirstError } from 'platform/utilities/ui';

import { getValue } from './helpers';

const childMarried = {
  handlers: {
    // Return "DONE" when we're done with this flow
    goForward: (/* { _itemData, _index, _fullData } */) => 'DONE',

    onSubmit: ({ /* event, */ itemData, goForward }) => {
      // event.preventDefault(); // executed before this function is called
      if (!itemData.endDate) {
        setTimeout(scrollToFirstError);
      } else {
        goForward();
      }
    },
  },

  /**
   * Depedent's data
   * @typedef {object} ItemData
   * @property {string} dateOfBirth - Dependent's date of birth
   * @property {string} relationshipToVeteran - Dependent's relationship
   * @property {string} endDate - child's marriage date (end of unmarried status)
   */
  /**
   * handlers object
   * @typedef {object} Handlers
   * @property {function} onChange - Change handler
   * @property {function} onSubmit - Submit handler
   */
  /**
   * Followup Component parameters
   * @param {ItemData} itemData - Dependent's data
   * @param {string} fullName - Dependent's full name
   * @param {boolean} formSubmitted - Whether the form has been submitted
   * @param {string} firstName - Dependent's first name
   * @param {object} handlers - The handlers for the component
   * @param {function} goBack - Function to go back to the previous page
   * @returns React component
   */
  Component: ({ itemData, firstName, handlers, formSubmitted }) => {
    const onChange = event => {
      const { field, value } = getValue(event);
      handlers.onChange({ ...itemData, [field]: value });
    };

    return (
      <>
        <h3 className="vads-u-margin-top--0 vads-u-margin-bottom--2">
          {`When did ${firstName} get married?`}
        </h3>

        <VaMemorableDate
          name="marriageDate"
          label="Date of marriage"
          error={formSubmitted && !itemData.endDate ? 'Enter a date' : null}
          monthSelect
          value={itemData.endDate || ''}
          // use onDateBlur to ensure month & day are zero-padded
          onDateBlur={onChange}
          required
        />
      </>
    );
  },
};

childMarried.propTypes = {
  Component: PropTypes.func,
};

childMarried.Component.propTypes = {
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
    endDate: PropTypes.string,
  }),
};

export default childMarried;
