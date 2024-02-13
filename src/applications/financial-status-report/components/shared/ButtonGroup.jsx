import React from 'react';
import PropTypes from 'prop-types';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

/**
 * Individual Button component
 */

const Button = ({
  label,
  onClick,
  isSubmitting,
  isSecondary,
  isContinueButton,
  isBackButton,
}) => {
  return (
    <VaButton
      text={label}
      onClick={onClick}
      submit={isSubmitting}
      continue={isContinueButton}
      secondary={isSecondary}
      back={isBackButton}
    />
  );
};

Button.defaultProps = {
  isSubmitting: false,
  isSecondary: false,
  isContinueButton: false,
  isBackButton: false,
};

Button.propTypes = {
  label: PropTypes.string.isRequired,
  isBackButton: PropTypes.bool,
  isContinueButton: PropTypes.bool,
  isSecondary: PropTypes.bool,
  isSubmitting: PropTypes.bool,
  onClick: PropTypes.func,
};

/**
 * ButtonGroup Component
 */
const ButtonGroup = ({ buttons }) => {
  return (
    <div className="form-progress-buttons schemaform-buttons fsr-buttons vads-u-margin-y--2">
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
      isContinueButton: PropTypes.bool,
      isBackButton: PropTypes.bool,
    }),
  ).isRequired,
};

export default ButtonGroup;
