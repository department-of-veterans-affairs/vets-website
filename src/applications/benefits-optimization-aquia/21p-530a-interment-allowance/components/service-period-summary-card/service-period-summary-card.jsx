import React from 'react';
import PropTypes from 'prop-types';
import constants from 'vets-json-schema/dist/constants.json';
import { Link } from 'react-router';
// import { VaLink } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import DeleteConfirmationModal from '../delete-modal/delete-confirmation-modal';
import { useDeleteModal } from '../delete-modal/use-delete-modal';

/**
 * Service Period Summary Card component
 * Displays a service period with edit and delete functionality
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.servicePeriod - Service period data
 * @param {number} props.index - Index in the array
 * @param {Function} props.onEdit - Function to call when editing
 * @param {Function} props.onDelete - Function to call when deleting
 * @returns {JSX.Element} Service period summary card
 */
export const ServicePeriodSummaryCard = ({
  servicePeriod,
  index,
  onEdit,
  onDelete,
}) => {
  // Find matching branch label from constants
  const branchOption = constants.branchesServed.find(
    branch => branch.value === servicePeriod.branchOfService,
  );
  const branchLabel = branchOption
    ? branchOption.label
    : servicePeriod.branchOfService || '';

  // Format dates
  const formatDate = dateString => {
    if (!dateString) return 'Unknown';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (e) {
      return 'Unknown';
    }
  };

  const fromDate = formatDate(servicePeriod.dateFrom);
  const toDate = formatDate(servicePeriod.dateTo);

  const {
    isModalOpen,
    handleModalCancel,
    handleModalConfirm,
    handleDeleteClick,
  } = useDeleteModal(onDelete);

  const cardHeading = `${branchLabel}`;
  const ariaLabel = `Service period ${index + 1}: ${branchLabel}`;

  return (
    <>
      <va-card
        show-shadow
        data-testid="service-period-card"
        aria-label={ariaLabel}
        class="vads-u-margin-y--3"
        uswds
      >
        <div className="vads-u-display--flex vads-u-flex-direction--column">
          <h4
            className="vads-u-margin-y--0"
            data-testid="service-period-card-header"
          >
            {cardHeading}
          </h4>
          <div
            className="vads-u-margin-y--1"
            data-testid="service-period-card-content"
          >
            <p className="vads-u-margin-y--0">
              Entry date {`(${fromDate})`} - Exit date {`(${toDate})`}
            </p>
          </div>
        </div>
        <div className="vads-l-row vads-u-justify-content--space-between vads-u-align-items--center vads-u-margin-bottom--neg1">
          <Link
            aria-label={`Edit ${ariaLabel}`}
            to="/service-branch"
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
          modalTitle={cardHeading}
        />
      ) : null}
    </>
  );
};

ServicePeriodSummaryCard.propTypes = {
  index: PropTypes.number.isRequired,
  servicePeriod: PropTypes.shape({
    branchOfService: PropTypes.string,
    dateFrom: PropTypes.string,
    dateTo: PropTypes.string,
    placeOfEntry: PropTypes.string,
    placeOfSeparation: PropTypes.string,
    rank: PropTypes.string,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};
