import React from 'react';
import PropTypes from 'prop-types';

/**
 * Edit Page Buttons Component
 * @typedef {object} EditPageButtonsProps
 * @property {object} handlers - handlers for button actions
 * @property {function} handlers.onUpdate - update handler
 * @property {function} handlers.onCancel - cancel handler
 * @property {string} pageName - name of the page being edited
 *
 * @param {EditPageButtonsProps} props - Component props
 * @returns {React.Component} - Edit page buttons
 */
export default function EditPageButtons(props) {
  return (
    <div className="row form-progress-buttons schemaform-buttons vads-u-margin-y--3 ">
      <div className="small-6 medium-5 columns">
        <va-button
          text="Update"
          message-aria-describedby={`Update ${props.pageName.toLowerCase()}`}
          submit="prevent"
          full-width
        />
      </div>
      <div className="small-6 medium-5 end columns">
        <va-button
          text="Cancel"
          message-aria-describedby={`Cancel updating ${props.pageName.toLowerCase()}`}
          onClick={props.handlers.onCancel}
          secondary
          full-width
        />
      </div>
    </div>
  );
}

EditPageButtons.propTypes = {
  handlers: PropTypes.shape({
    onUpdate: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
  }).isRequired,
  pageName: PropTypes.string.isRequired,
};
