import React from 'react';
import PropTypes from 'prop-types';

/**
 * ButtonGroup
 * @param {Array} buttons - An array of button configurations for the button group.
 *   @param {String} label - The text to be displayed on the button.
 *   @param {Function} onClick - The callback function to be called when the button is clicked.
 *   @param {Boolean} [disabled] - Optional. Indicates whether the button should be disabled or not. Defaults to false.
 *   @param {Boolean} [secondary] - Optional. Indicates whether the button should have a secondary style. Defaults to false.
 *   @param {String} [type] - Optional. The type of button. Defaults to 'button'.
 *   @param {String} [iconLeft] - Optional. The icon to be displayed to the left of the button label.
 *   @param {String} [iconRight] - Optional. The icon to be displayed to the right of the button label.
 * @return {React Component}
 */

const ButtonGroup = ({ buttons }) => {
  return (
    <div className="row form-progress-buttons schemaform-buttons vads-u-margin-y--2">
      {buttons.map((button, index) => (
        <div
          key={`button-group-${index}`}
          className={`small-6 medium-5${
            index === buttons.length - 1 ? ' end' : ''
          } columns`}
        >
          <button
            type={button.type ? button.type : 'button'}
            className={
              button.secondary ? 'usa-button-secondary' : 'usa-button-primary'
            }
            onClick={button.onClick}
            disabled={button.disabled}
          >
            {button.iconLeft && (
              <span className="button-icon" aria-hidden="true">
                {button.iconLeft}
                &nbsp;
              </span>
            )}
            {button.label}
            {button.iconRight && (
              <span className="button-icon" aria-hidden="true">
                &nbsp;
                {button.iconRight}
              </span>
            )}
          </button>
        </div>
      ))}
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
      iconLeft: PropTypes.string,
      iconRight: PropTypes.string,
    }),
  ).isRequired,
};

export default ButtonGroup;

/**
 * Usage Example:
 *
 * import ButtonGroup from 'path/to/ButtonGroup';
 *
 *       <ButtonGroup
 *         buttons={[
 *           {
 *             label: 'Cancel',
 *             onClick: onCancel,
 *             secondary: true,
 *             iconLeft: '«',
 *           },
 *           {
 *             label: 'Update',
 *             onClick: onUpdate,
 *             disabled: !!error,
 *             iconRight: '»',
 *           },
 *         ]}
 *       />
 */
