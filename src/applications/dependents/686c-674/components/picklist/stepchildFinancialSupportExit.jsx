import React from 'react';
import PropTypes from 'prop-types';

import { VA_FORM_IDS } from 'platform/forms/constants';

import ExitForm from '../../../shared/components/ExitFormLink';

const stepchildFinancialSupportExit = {
  handlers: {
    // Define goForward so the routing code doesn't break
    goForward: () => 'DONE',

    // Submit shouldn't do anything; we're directing the user to exit the form
    onSubmit: () => {},
  },

  // Flag to hide form navigation continue button
  hasExitLink: true,

  /**
   * Dependent's data
   * @typedef {object} ItemData
   * @property {string} dateOfBirth Dependent's date of birth
   * @property {string} relationshipToVeteran Dependent's relationship
   * @property {string} isStepchild Whether the child is a stepchild
   * @property {string} removalReason Dependent's removal reason
   * @property {string} stepchildFinancialSupport Whether veteran provides financial support
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
        {firstName} still qualifies as your dependent
      </h3>

      <p>
        Because you provide at least half of {firstName}
        's financial support, {firstName} is an eligible dependent.
      </p>

      <p>{firstName} will remain on your benefits.</p>

      <p>If you exit now, we’ll cancel the application you started.</p>

      <div className="vads-u-margin-top--4">
        <ExitForm
          formId={VA_FORM_IDS.FORM_21_686CV2}
          href="/manage-dependents/view"
        />
      </div>
    </>
  ),
};

stepchildFinancialSupportExit.propTypes = {
  Component: PropTypes.func,
};

stepchildFinancialSupportExit.Component.propTypes = {
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
    isStepchild: PropTypes.string,
    removalReason: PropTypes.string,
    stepchildFinancialSupport: PropTypes.string,
  }),
  returnToMainPage: PropTypes.func,
};

export default stepchildFinancialSupportExit;
