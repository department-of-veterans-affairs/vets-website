import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { useSelector, connect } from 'react-redux';
import EmploymentHistorySummaryCard from '../../../components/EmploymentHistorySummaryCard';
import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';
import { clearJobIndex } from '../../../utils/session';

const EmploymentHistoryWidget = props => {
  const { goToPath, goBack, onReviewPage } = props;

  const formData = useSelector(state => state.form.data);
  const employmentHistory =
    formData.personalData.employmentHistory.veteran.employmentRecords || [];
  const efsrFeatureFlag = formData['view:enhancedFinancialStatusReport'];
  useEffect(() => {
    clearJobIndex();
  }, []);

  const handlers = {
    onSubmit: event => {
      event.preventDefault();
      let path = '/benefits';
      if (efsrFeatureFlag) {
        path = '/your-benefits';
      }
      goToPath(path);
    },
  };

  const navButtons = <FormNavButtons goBack={goBack} submitToContinue />;
  const updateButton = <button type="submit">Review update button</button>;

  return (
    <form onSubmit={handlers.onSubmit}>
      <legend className="schemaform-block-title">Your work history</legend>
      <div className="vads-u-margin-top--3" data-testid="debt-list">
        {employmentHistory.map((job, index) => (
          <EmploymentHistorySummaryCard
            key={`${index}-${job.employername}`}
            job={job}
            index={index}
            isSpouse={false}
          />
        ))}
      </div>
      <Link
        className="vads-c-action-link--green"
        to="/enhanced-employment-records"
      >
        Add another job from the last 2 years
      </Link>
      {onReviewPage ? updateButton : navButtons}
    </form>
  );
};
EmploymentHistoryWidget.propTypes = {
  goBack: PropTypes.func.isRequired,
  goToPath: PropTypes.func.isRequired,
  onReviewPage: PropTypes.bool,
};
const mapStateToProps = ({ form }) => {
  return {
    formData: form.data,
    employmentHistory: form.data.personalData.employmentHistory,
  };
};

export default connect(mapStateToProps)(EmploymentHistoryWidget);
