import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router';
import EmploymentHistorySummaryCard from '../../../components/EmploymentHistorySummaryCard';

const EmploymentHistoryWidget = () => {
  const formData = useSelector(state => state.form.data);
  const employmentHistory =
    formData.personalData.employmentHistory.veteran.employmentRecords || [];

  return (
    <>
      <div className="vads-u-margin-top--3" data-testid="debt-list">
        {employmentHistory.map((job, index) => (
          <EmploymentHistorySummaryCard
            key={`${index}-${job.employername}`}
            job={job}
          />
        ))}
      </div>
      <Link
        className="add-additional-job"
        to={{
          pathname: '/enhanced-employment-records',
          search: `?index=0`,
        }}
      >
        Add additional job
      </Link>
      <Link
        className="add-additional-job"
        to={{
          pathname: '/enhanced-employment-records',
        }}
      >
        Add additional job
      </Link>
    </>
  );
};

export default EmploymentHistoryWidget;
