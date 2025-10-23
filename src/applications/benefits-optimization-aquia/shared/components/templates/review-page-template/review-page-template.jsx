import PropTypes from 'prop-types';
import React from 'react';

/**
 * Review page template component for displaying form data in review mode.
 * Follows the VA.gov platform review page patterns and styling.
 *
 * This component provides:
 * - Consistent header with title and edit button
 * - Responsive layout (mobile-first)
 * - Platform-standard review styling
 * - Integration with CustomPageReview pattern
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} props.title - Page title displayed in review section
 * @param {Function} props.editPage - Callback function to enter edit mode
 * @param {Object} props.data - Form data to display (full form data object)
 * @param {string} [props.sectionName] - Name of the data section to extract from data
 * @param {React.ReactNode|Function} props.children - Content to render (can be render props)
 * @param {string} [props.className] - Additional CSS classes
 * @param {boolean} [props.hideEditButton=false] - Hide the edit button
 * @param {string} [props.editButtonAriaLabel] - Custom aria-label for edit button
 * @returns {JSX.Element} Review page structure
 *
 * @example
 * // Simple usage with children
 * <ReviewPageTemplate
 *   title="Personal Information"
 *   data={formData}
 *   sectionName="veteranPersonalInformation"
 *   editPage={handleEdit}
 * >
 *   <ReviewField label="Full Name" value={data.fullName} />
 *   <ReviewField label="SSN" value={data.ssn} />
 * </ReviewPageTemplate>
 *
 * @example
 * // With render props for complex logic
 * <ReviewPageTemplate
 *   title="Personal Information"
 *   data={formData}
 *   sectionName="veteranPersonalInformation"
 *   editPage={handleEdit}
 * >
 *   {(sectionData) => (
 *     <>
 *       <ReviewFullnameField value={sectionData.fullName} />
 *       {sectionData.ssn && <ReviewField label="SSN" value={sectionData.ssn} />}
 *     </>
 *   )}
 * </ReviewPageTemplate>
 */
export const ReviewPageTemplate = ({
  title,
  editPage,
  data,
  sectionName,
  children,
  className = '',
  hideEditButton = false,
  editButtonAriaLabel,
}) => {
  // Extract section data if sectionName is provided
  const sectionData = sectionName && data ? data[sectionName] : data;

  // Render children with section data if it's a function
  const renderChildren = () => {
    if (typeof children === 'function') {
      return children(sectionData || {});
    }
    return children;
  };

  const classes = ['form-review-panel-page', className]
    .filter(Boolean)
    .join(' ');

  const ariaLabel = editButtonAriaLabel || `Edit ${title}`;

  return (
    <div className={classes}>
      {/* Title and Edit Button Row */}
      <div
        className="form-review-panel-page-header-row"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h4 className="form-review-panel-page-header vads-u-font-size--h5">
          {title}
        </h4>
        {!hideEditButton && (
          <va-button
            uswds
            aria-label={ariaLabel}
            secondary
            text="Edit"
            onClick={editPage}
          />
        )}
      </div>

      {/* Review Content */}
      <dl className="review">{renderChildren()}</dl>
    </div>
  );
};

ReviewPageTemplate.propTypes = {
  data: PropTypes.object.isRequired,
  editPage: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  className: PropTypes.string,
  editButtonAriaLabel: PropTypes.string,
  hideEditButton: PropTypes.bool,
  sectionName: PropTypes.string,
};
