import React from 'react';
import { connect, useDispatch } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import PropTypes from 'prop-types';
import {
  EmptyMiniSummaryCard,
  MiniSummaryCard,
} from './shared/MiniSummaryCard';
import { setJobIndex } from '../utils/session';
import { dateFormatter } from '../utils/helpers';

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

  const handleClick = jobIndex => () => {
    setJobIndex(jobIndex);
    return isSpouse
      ? {
          pathname: `/enhanced-spouse-employment-records`,
        }
      : {
          pathname: `/enhanced-employment-records`,
        };
  };

  const onDelete = deleteIndex => {
    const updatedEmploymentHistory = {
      ...formData.personalData.employmentHistory,
      [isSpouse ? 'spouse' : 'veteran']: {
        ...formData.personalData.employmentHistory[
          isSpouse ? 'spouse' : 'veteran'
        ],
        employmentRecords: formData.personalData.employmentHistory[
          isSpouse ? 'spouse' : 'veteran'
        ].employmentRecords.filter((_, i) => i !== deleteIndex),
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

  return (
    (!job && <EmptyMiniSummaryCard content={emptyPrompt} />) || (
      <MiniSummaryCard
        ariaLabel={`Job ${index + 1} ${employmentCardHeading}`}
        editDestination={handleClick(index)}
        heading={employmentCardHeading}
        body={cardBody}
        onDelete={() => onDelete(index)}
        showDelete
      />
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
