import React from 'react';
import PropTypes from 'prop-types';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

/**
 * Individual Button component
 */

const Button = ({ label, onClick, isSubmitting, isSecondary }) => {
  return (
    <VaButton
      text={label}
      onClick={onClick}
      submit={isSubmitting}
      secondary={isSecondary}
      uswds
    />
  );
};

Button.defaultProps = {
  isSubmitting: false,
  isSecondary: false,
};

Button.propTypes = {
  label: PropTypes.string.isRequired,
  isSecondary: PropTypes.bool,
  isSubmitting: PropTypes.bool,
  onClick: PropTypes.func,
};

/**
 * ButtonGroup Component
 */
const ButtonGroup = ({ buttons }) => {
  return (
    <div className="va-button-override form-progress-buttons schemaform-buttons fsr-buttons vads-u-margin-y--2 ">
      {buttons.map((button, index) => {
        return (
          <div key={`button-group-${index}`}>
            <Button {...button} />
          </div>
        );
      })}
    </div>
  );
};

ButtonGroup.propTypes = {
  buttons: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
      isSubmitting: PropTypes.bool,
      isSecondary: PropTypes.bool,
    }),
  ).isRequired,
};

export default ButtonGroup;
