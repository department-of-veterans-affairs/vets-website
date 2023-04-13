import React from 'react';
import { connect, useDispatch } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import PropTypes from 'prop-types';
import { MiniSummaryCard } from './shared/MiniSummaryCard';
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

  const cardBody = (
    <div>
      <p className="vads-u-margin-y--2 vads-u-font-weight--normal">
        Dates:
        <span className="vads-u-margin-x--1">
          <strong>
            {dateFormatter(from)} - {isCurrent ? 'Present' : dateFormatter(to)}
          </strong>
        </span>
      </p>
      {grossMonthlyIncome && (
        <p>
          Gross Monthly Income: <strong> ${grossMonthlyIncome}</strong>
        </p>
      )}
      {deductions && (
        <div>
          {deductions.map((deduction, i) => (
            <p key={i}>
              {deduction.name}: <strong>${deduction.amount}</strong>
            </p>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <MiniSummaryCard
      editDestination={handleClick(index)}
      heading={employmentCardHeading}
      body={cardBody}
      onDelete={() => onDelete(index)}
      showDelete
    />
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
