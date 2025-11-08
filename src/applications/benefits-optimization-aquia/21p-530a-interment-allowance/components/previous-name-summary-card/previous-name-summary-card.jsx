import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

import DeleteConfirmationModal from '../delete-modal/delete-confirmation-modal';
import { useDeleteModal } from '../delete-modal/use-delete-modal';

/**
 * Previous Name Summary Card component
 * Displays a previous name with edit and delete functionality
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.previousName - Previous name data
 * @param {number} props.index - Index in the array
 * @param {Function} props.onEdit - Function to call when editing
 * @param {Function} props.onDelete - Function to call when deleting
 * @returns {JSX.Element} Previous name summary card
 */
export const PreviousNameSummaryCard = ({
  previousName,
  index,
  onEdit,
  onDelete,
}) => {
  // Format the name for display
  const formatName = name => {
    const parts = [name.first, name.middle, name.last, name.suffix].filter(
      Boolean,
    );
    return parts.join(' ');
  };

  const displayName = formatName(previousName);

  const {
    isModalOpen,
    handleModalCancel,
    handleModalConfirm,
    handleDeleteClick,
  } = useDeleteModal(onDelete);

  const cardHeading = displayName;
  const ariaLabel = `Previous name ${index + 1}: ${displayName}`;

  return (
    <>
      <va-card
        show-shadow
        data-testid="previous-name-card"
        aria-label={ariaLabel}
        class="vads-u-margin-y--3"
        uswds
      >
        <div className="vads-u-display--flex vads-u-flex-direction--column">
          <h4
            className="vads-u-margin-y--0"
            data-testid="previous-name-card-header"
          >
            {cardHeading}
          </h4>
        </div>
        <div className="vads-l-row vads-u-justify-content--space-between vads-u-align-items--center vads-u-margin-bottom--neg1">
          <Link
            aria-label={`Edit ${ariaLabel}`}
            to="/previous-name-entry"
            onClick={() => {
              onEdit(index);
            }}
            className="vads-u-padding--0p25 vads-u-padding-x--0p5 vads-u-margin-left--neg0p5"
          >
            <span>
              <strong>Edit</strong>
              <va-icon
                icon="navigate_next"
                size={3}
                className="vads-u-padding-left--0p5"
              />
            </span>
          </Link>

          <va-button-icon
            button-type="delete"
            class="vads-u-margin-right--neg1 mobile-lg:vads-u-margin-right--neg2 summary-card-delete-button"
            onClick={() => handleDeleteClick(index)}
          />
        </div>
      </va-card>

      {isModalOpen ? (
        <DeleteConfirmationModal
          isOpen={isModalOpen}
          onClose={handleModalCancel}
          onDelete={handleModalConfirm}
          modalTitle={`${cardHeading}`}
        />
      ) : null}
    </>
  );
};

PreviousNameSummaryCard.propTypes = {
  index: PropTypes.number.isRequired,
  previousName: PropTypes.shape({
    first: PropTypes.string,
    middle: PropTypes.string,
    last: PropTypes.string,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};
