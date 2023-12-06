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
  type, // Add this line
}) => {
  return (
    <VaButton
      text={label}
      onClick={onClick}
      submit={isSubmitting}
      continue={isContinueButton}
      secondary={isSecondary}
      back={isBackButton}
      type={type} // Use the type prop here
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
  className: PropTypes.string,
  isBackButton: PropTypes.bool,
  isContinueButton: PropTypes.bool,
  isSecondary: PropTypes.bool,
  isSubmitting: PropTypes.bool,
  secondary: PropTypes.bool,
  submit: PropTypes.bool,
  type: PropTypes.string,
  onClick: PropTypes.func,
};
/**
 * Helper function to generate button classes
 */

const classMap = {
  continueButton: 'small-12 medium-7',
  backButton: 'small-12 medium-5',
  defaultButton: 'small-6 medium-5',
};

const getButtonClasses = (
  index,
  isContinueButton,
  isBackButton,
  hasContinueToReviewButton,
  buttonsLength,
) => {
  let buttonType = 'defaultButton';
  if (hasContinueToReviewButton) {
    buttonType = isContinueButton ? 'continueButton' : 'backButton';
  }

  let buttonClasses = `columns ${classMap[buttonType]}`;
  if (index === buttonsLength - 1) {
    buttonClasses += ' end';
  }

  return buttonClasses;
};

/**
 * ButtonGroup Component
 */
const ButtonGroup = ({ buttons }) => {
  const hasContinueToReviewButton = buttons.some(button =>
    button.label.toLowerCase().includes('continue to review page'),
  );

  return (
    <div className="row form-progress-buttons schemaform-buttons vads-u-margin-y--2">
      {buttons.map((button, index) => {
        const isContinueButton = button.label
          .toLowerCase()
          .includes('continue to review page');
        const isBackButton = button.label.toLowerCase().includes('back');
        const buttonClasses = getButtonClasses(
          index,
          isContinueButton,
          isBackButton,
          hasContinueToReviewButton,
          buttons.length,
        );

        return (
          <div key={`button-group-${index}`} className={buttonClasses}>
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
      type: PropTypes.oneOf(['button', 'submit', 'cancel']),
      onClick: PropTypes.func,
      disabled: PropTypes.bool,
      secondary: PropTypes.bool,
    }),
  ).isRequired,
};

export default ButtonGroup;
