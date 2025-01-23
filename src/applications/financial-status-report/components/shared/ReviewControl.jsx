import React from 'react';
import PropTypes from 'prop-types';

/**
 * ReviewControl - A reusable component for rendering "Edit" and "Update" buttons.
 * The component can be used as a header or footer based on the value of the "position" prop.
 * The header mode renders the "Edit" button, while the footer mode renders the "Update" button.
 *
 * @param {String} [title] - Optional title for the header.
 * @param {Boolean} isEditing - Whether the component is in editing mode.
 * @param {'header' | 'footer'} position - Position of the control bar, either "header" or "footer".
 * @param {Function} [onEditClick] - Optional. Callback function for the "Edit" button click (used when position is 'header').
 * @param {Function} [onUpdateClick] - Optional. Callback function for the "Update" button click (used when position is 'footer').
 * @param {String} [ariaLabel] - Optional. ARIA label for the button.
 * @param {String} [buttonText] - Optional. Text for the button.
 * @param {Boolean} [readOnly] - Optional. Whether the component is in read-only mode.
 * @return {React Component}
 */
const ReviewControl = ({
  title,
  isEditing,
  position,
  onEditClick,
  onUpdateClick,
  ariaLabel,
  buttonText,
  readOnly = false,
}) => {
  // Determine whether to render the button and its type based on the position and editing state
  const renderButton =
    (position === 'header' && !isEditing) ||
    (position === 'footer' && isEditing);

  return (
    <>
      {renderButton && (
        <div className={`form-review-panel-page-${position}-row`}>
          {title && (
            <h4 className="form-review-panel-page-header vads-u-font-size--h5">
              {title}
            </h4>
          )}
          {!readOnly && (
            <va-button
              className={`edit-btn ${
                position === 'header' ? 'primary-outline' : ''
              }`}
              text={buttonText}
              onClick={position === 'header' ? onEditClick : onUpdateClick}
              aria-label={ariaLabel}
              readOnly={readOnly}
            />
          )}
        </div>
      )}
    </>
  );
};
ReviewControl.propTypes = {
  ariaLabel: PropTypes.string.isRequired, // ARIA label for the button
  isEditing: PropTypes.bool.isRequired, // Whether the component is in editing mode
  position: PropTypes.oneOf(['header', 'footer']).isRequired, // Position of the control bar, either "header" or "footer"
  buttonText: PropTypes.string, // Text for the button
  readOnly: PropTypes.bool, // Whether the component is in read only mode
  title: PropTypes.string, // Optional title for the header
  onEditClick: PropTypes.func, // Callback function for the "Edit" button click (optional if used as footer)
  onUpdateClick: PropTypes.func, // Callback function for the "Update" button click (optional if used as header)
};

ReviewControl.defaultProps = {
  onEditClick: () => {}, // Default no-op function for the optional onEditClick prop
  onUpdateClick: () => {}, // Default no-op function for the optional onUpdateClick prop
  title: null, // Default value for the optional title prop
};

export default ReviewControl;

// Usage example:
// <ReviewControlBar title="Your Dependents" position="header" ariaLabel="edit" isEditing={false} onEditClick={handleEditClick} />
// <ReviewControlBar position="footer" isEditing={true} ariaLabel="update"  onUpdateClick={() => setIsEditing(false)} />
