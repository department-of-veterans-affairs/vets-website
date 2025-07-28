import React from 'react';
import PropTypes from 'prop-types';

export default function EditPageButtons(props) {
  return (
    <div className="row form-progress-buttons schemaform-buttons vads-u-margin-y--3">
      <div className="small-6 medium-5 columns">
        <va-button
          text="Update"
          message-aria-describedby={`Update ${props.pageName.toLowerCase()}`}
          submit="prevent"
        />
      </div>
      <div className="small-6 medium-5 end columns">
        <va-button
          text="Cancel"
          message-aria-describedby={`Cancel updating ${props.pageName.toLowerCase()}`}
          onClick={props.handlers.onCancel}
          secondary
          submit="prevent"
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
