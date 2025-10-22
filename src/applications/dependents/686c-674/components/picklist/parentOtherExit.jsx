import React from 'react';
import PropTypes from 'prop-types';

import { VA_FORM_IDS } from 'platform/forms/constants';

import ExitForm from '../../../shared/components/ExitFormLink';

const parentOtherExit = {
  handlers: {
    // Define goForward so the routing code doesn't break
    goForward: () => 'DONE',

    // Submit shouldn't do anything; we're directing the user to exit the form
    onSubmit: () => {},
  },

  // Flag to hide form navigation continue button
  hasExitLink: true,

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

      <div className="vads-u-margin-top--4">
        <ExitForm
          formId={VA_FORM_IDS.FORM_21_686CV2}
          href="/manage-dependents/view"
        />
      </div>
    </>
  ),
};

parentOtherExit.propTypes = {
  Component: PropTypes.func,
};

parentOtherExit.Component.propTypes = {
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

export default parentOtherExit;
