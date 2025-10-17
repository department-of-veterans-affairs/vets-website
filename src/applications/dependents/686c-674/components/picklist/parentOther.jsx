import React from 'react';
import PropTypes from 'prop-types';

const parentOther = {
  handlers: {
    goForward: () => 'DONE',

    onSubmit: ({ goForward }) => {
      goForward();
    },
  },

  /**
   * Depedent's data
   * @typedef {object} ItemData
   * @property {string} dateOfBirth Dependent's date of birth
   * @property {string} relationshipToVeteran Dependent's relationship
   * @property {string} removalReason Dependent's removal reason
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
   * @param {function} returnToMainPage Function to return to the main remove
   * dependents page
   * @returns React component
   */
  Component: ({ firstName }) => (
    <>
      <h3 className="vads-u-margin-top--0 vads-u-margin-bottom--2">
        Changes to {firstName}
      </h3>

      <p>
        Since you can only remove a parent if they have died,{' '}
        <strong>
          we will not apply any changes to {firstName} and will remain on your
          benefits.
        </strong>
      </p>

      <va-additional-info trigger="Why can I only remove a parent dependent if they have died?">
        <p>
          The only removal option for a parent allowed in this form is due to
          death. If your parent is still living and you need to make changes to
          your benefits, call us at <va-telephone contact="8008271000" /> (
          <va-telephone contact="711" tty />
          ).
        </p>
      </va-additional-info>

      {/* <CancelButton
        dependentType={itemData.relationshipToVeteran?.toLowerCase()}
        removePath="options-selection/remove-active-dependents"
      /> */}
    </>
  ),
};

parentOther.propTypes = {
  Component: PropTypes.func,
};

parentOther.Component.propTypes = {
  firstName: PropTypes.string,
  formSubmitted: PropTypes.bool,
  fullName: PropTypes.string,
  handlers: PropTypes.shape({
    onChange: PropTypes.func,
    onSubmit: PropTypes.func,
  }),
  itemData: PropTypes.shape({
    dateOfBirth: PropTypes.string,
    relationshipToVeteran: PropTypes.string,
    removalReason: PropTypes.string,
  }),
  returnToMainPage: PropTypes.func,
};

export default parentOther;
