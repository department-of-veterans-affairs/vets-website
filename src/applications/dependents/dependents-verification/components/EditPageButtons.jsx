import React from 'react';
import PropTypes from 'prop-types';

export default function EditPageButtons(props) {
  return (
    <div className="vads-u-margin-y--3">
      <div className="vads-u-margin-bottom--2">
        <va-button
          text="Update"
          message-aria-describedby={`Update ${props.pageName.toLowerCase()}`}
          click={props.handlers.onUpdate}
          submit="prevent"
          full-width
        />
      </div>
      <div>
        <va-button
          text="Cancel"
          message-aria-describedby={`Cancel updating ${props.pageName.toLowerCase()}`}
          click={props.handlers.onCancel}
          secondary
          submit="prevent"
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
