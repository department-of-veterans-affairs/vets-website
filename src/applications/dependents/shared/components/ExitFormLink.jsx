import React from 'react';
import PropTypes from 'prop-types';

import { deleteInProgressForm } from '../utils/api';

/**
 * Exit mid-form and disables window unload warning & deletes the in-progress
 * form, if a formID is provided
 * @param {String} [formId] The form ID to delete from in-progress forms
 * @param {String} href The URL to navigate to when exiting the form
 * @param {String} [text] The text to display for the exit link
 * @param {Function} [exitCallback] Optional callback function to execute after
 * deleting the form and before navigating away
 */
const ExitForm = ({
  formId,
  href,
  text = 'Exit application',
  exitCallback,
  location = window.location,
  useButton = false,
}) => {
  const exitFormHandler = async event => {
    event.preventDefault();
    if (formId) {
      await deleteInProgressForm(formId);
    }
    exitCallback?.();
    location.assign(href);
  };

  return useButton ? (
    <va-button
      onClick={exitFormHandler}
      class="exit-form"
      text={text}
      continue
      full-width
      submit="prevent"
    />
  ) : (
    <div>
      <va-link-action
        onClick={exitFormHandler}
        class="exit-form"
        href={href}
        text={text}
        type="primary"
      />
    </div>
  );
};

ExitForm.propTypes = {
  href: PropTypes.string.isRequired,
  exitCallback: PropTypes.func,
  formId: PropTypes.string,
  location: PropTypes.shape({
    assign: PropTypes.func,
  }),
  text: PropTypes.string,
  useButton: PropTypes.bool,
};

export default ExitForm;
