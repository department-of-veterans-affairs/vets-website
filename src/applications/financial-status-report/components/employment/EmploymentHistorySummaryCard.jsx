import React from 'react';
import PropTypes from 'prop-types';
import { connect, useDispatch } from 'react-redux';
import { Link } from 'react-router';
import { setData } from '~/platform/forms-system/src/js/actions';
import { EmptyMiniSummaryCard } from '../shared/MiniSummaryCard';
import DeleteConfirmationModal from '../shared/DeleteConfirmationModal';
import { useDeleteModal } from '../../hooks/useDeleteModal';
import {
  setJobIndex,
  setJobButton,
  jobButtonConstants,
} from '../../utils/session';
import { dateFormatter, firstLetterLowerCase } from '../../utils/helpers';

const EmploymentHistorySummaryCard = ({
  job,
  index,
  isSpouse,
  formData,
  setFormData,
}) => {
  const {
    employerName,
    from,
    to,
    type,
    grossMonthlyIncome,
    deductions,
    isCurrent,
  } = job ?? {};
  const dispatch = useDispatch();

  const editDestination = isSpouse
    ? {
        pathname: `/enhanced-spouse-employment-records`,
      }
    : {
        pathname: `/enhanced-employment-records`,
      };

  const onDelete = deleteIndex => {
    const updatedEmploymentHistory = {
      ...formData.personalData.employmentHistory,
      [isSpouse ? 'spouse' : 'veteran']: {
        ...formData.personalData.employmentHistory[
          isSpouse ? 'spouse' : 'veteran'
        ],
        [isSpouse ? 'spEmploymentRecords' : 'employmentRecords']: isSpouse
          ? formData.personalData.employmentHistory.spouse.spEmploymentRecords.filter(
              (_, i) => i !== deleteIndex,
            )
          : formData.personalData.employmentHistory.veteran.employmentRecords.filter(
              (_, i) => i !== deleteIndex,
            ),
      },
    };

    dispatch(
      setFormData({
        ...formData,
        personalData: {
          ...formData.personalData,
          employmentHistory: updatedEmploymentHistory,
        },
      }),
    );
  };

  const {
    isModalOpen,
    handleModalCancel,
    handleModalConfirm,
    handleDeleteClick,
  } = useDeleteModal(onDelete);

  const employmentCardHeading = `${type} employment at ${employerName}`;

  const StyledParagraph = ({ children }) => (
    <p className="vads-u-margin-y--0">{children}</p>
  );

  StyledParagraph.propTypes = {
    children: PropTypes.node, // PropType for the children prop (can be any renderable content)
  };

  // Reusable functional component to render expense information
  const EmploymentCardBody = ({ label, value }) => (
    <StyledParagraph>
      {label}: <strong>{value}</strong>
    </StyledParagraph>
  );

  const cardBody = (
    <div className="vads-u-margin-y--1">
      {/* Render date information */}
      <EmploymentCardBody
        label="Dates"
        value={`${dateFormatter(from)} - ${
          isCurrent ? 'Present' : dateFormatter(to)
        }`}
      />

      {/* Conditionally render gross monthly income information */}
      {grossMonthlyIncome && (
        <EmploymentCardBody
          label="Gross Monthly Income"
          value={`$${grossMonthlyIncome}`}
        />
      )}

      {/* Render deductions information */}
      {deductions &&
        deductions.map((deduction, i) => (
          <EmploymentCardBody
            key={i}
            label={deduction.name}
            value={`$${deduction.amount}`}
          />
        ))}
    </div>
  );

  EmploymentCardBody.propTypes = {
    label: PropTypes.string, // PropType for the label prop (string)
    value: PropTypes.oneOfType([
      // PropType for the value prop (can be string or number)
      PropTypes.string,
      PropTypes.number,
    ]),
  };
  const emptyPrompt = `Select the ‘add additional job link to add another job. Select the continue button to move on to the next question.`;
  const ariaLabel = `Job ${index + 1} ${employmentCardHeading}`;

  return (
    (!job && <EmptyMiniSummaryCard content={emptyPrompt} />) || (
      <va-card
        show-shadow
        data-testid="mini-summary-card"
        aria-label={ariaLabel}
        class="vads-u-margin-y--3"
        uswds
      >
        <div className="vads-u-display--flex vads-u-flex-direction--column">
          <h4 className="vads-u-margin-y--0">{employmentCardHeading}</h4>
          {cardBody}
        </div>
        <div className="vads-l-row vads-u-justify-content--space-between vads-u-align-items--center vads-u-margin-bottom--neg1">
          <Link
            aria-label={`Edit ${ariaLabel}`}
            to={editDestination}
            onClick={() => {
              setJobIndex(index);
              setJobButton(jobButtonConstants.EDIT_JOB);
            }}
            className="vads-u-padding--0p25 vads-u-padding-x--0p5 vads-u-margin-left--neg0p5"
          >
            <span>
              <strong>Edit</strong>
              <i
                aria-hidden="true"
                role="img"
                className="fas fa-chevron-right vads-u-padding-left--0p5"
              />
            </span>
          </Link>

          <button
            type="button"
            aria-label={`Delete ${ariaLabel}`}
            className="usa-button summary-card-delete-button vads-u-margin--0 vads-u-padding--1 vads-u-margin-right--neg1"
            onClick={() => handleDeleteClick(index)}
          >
            <i
              aria-hidden="true"
              className="fas fa-trash-alt vads-u-padding-right--0p5"
            />
            <span>DELETE</span>
          </button>
          {isModalOpen ? (
            <DeleteConfirmationModal
              isOpen={isModalOpen}
              onClose={handleModalCancel}
              onDelete={handleModalConfirm}
              modalTitle={firstLetterLowerCase(employmentCardHeading)}
            />
          ) : null}
        </div>
      </va-card>
    )
  );
};

EmploymentHistorySummaryCard.propTypes = {
  formData: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  isSpouse: PropTypes.bool.isRequired,
  setFormData: PropTypes.func.isRequired,
  job: PropTypes.shape({
    employerName: PropTypes.string,
    from: PropTypes.string,
    to: PropTypes.string,
    type: PropTypes.string,
    grossMonthlyIncome: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    deductions: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      }),
    ),
    isCurrent: PropTypes.bool,
  }),
};

const mapStateToProps = ({ form }) => {
  return {
    formData: form.data,
  };
};

const mapDispatchToProps = {
  setFormData: setData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EmploymentHistorySummaryCard);
