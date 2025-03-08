import React from 'react';

/**
 * Displays a custom alert based on the current `certifierRole` value.
 * Used to alert the user when we automatically fill in some portions
 * of the form based on their previous answers, e.g., adding an applicant
 * with the certifier's information if the certifier specified that they
 * were applying for themselves.
 * @param {object} formData Standard formdata object
 * @param {string} role Value we expect certifierRole to have if we are to display this message
 * @param {string} msg Optional custom text to display in our alert
 * @returns
 */
export default function CustomPrefillMessage(formData, role, msg) {
  const text =
    msg ||
    'We’ve prefilled some details based on information you provided earlier in this form. If you need to make changes, you can edit on this screen.';
  const certifierRole =
    formData.certifierRole ?? formData['view:certifierRole'];
  if (certifierRole && certifierRole === role)
    return (
      <va-alert status="info">
        <p className="vads-u-margin-y--0">
          <strong>Note:</strong> {text}
        </p>
      </va-alert>
    );
  return <></>;
}
