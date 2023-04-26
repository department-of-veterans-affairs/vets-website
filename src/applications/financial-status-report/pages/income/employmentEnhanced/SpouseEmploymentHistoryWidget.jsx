import React, { useEffect } from 'react';
import { useSelector, connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import EmploymentHistorySummaryCard from '../../../components/EmploymentHistorySummaryCard';
import { EmptyMiniSummaryCard } from '../../../components/shared/MiniSummaryCard';
import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';
import { clearJobIndex } from '../../../utils/session';

const SpouseEmploymentHistoryWidget = props => {
  const { goToPath, goForward, onReviewPage } = props;

  const formData = useSelector(state => state.form.data);
  const employmentHistory =
    formData.personalData.employmentHistory.spouse.employmentRecords || [];
  const efsrFeatureFlag = formData['view:enhancedFinancialStatusReport'];
  useEffect(() => {
    clearJobIndex();
  }, []);

  const handlers = {
    onBackClick: event => {
      event.preventDefault();
      goToPath('/enhanced-spouse-employment-question');
    },
  };

  const navButtons = (
    <FormNavButtons
      goBack={handlers.onBackClick}
      goForward={goForward}
      submitToContinue
    />
  );
  const updateButton = <button type="submit">Review update button</button>;

  return (
    <form>
      <legend className="schemaform-block-title">
        Your spouse’s work history
      </legend>
      <div className="vads-u-margin-top--3" data-testid="debt-list">
        {employmentHistory.length === 0 ? (
          <EmptyMiniSummaryCard content="No employment history provided" />
        ) : (
          employmentHistory.map((job, index) => (
            <EmploymentHistorySummaryCard
              key={`${index}-${job.employername}`}
              job={job}
              index={index}
              isSpouse
            />
          ))
        )}
      </div>
      <Link
        className="vads-c-action-link--green"
        to={
          efsrFeatureFlag
            ? '/enhanced-spouse-employment-records'
            : '/spouse-employment-records'
        }
      >
        Add another job from the last 2 years
      </Link>

      {onReviewPage ? updateButton : navButtons}
    </form>
  );
};

SpouseEmploymentHistoryWidget.propTypes = {
  goBack: PropTypes.func.isRequired,
  goForward: PropTypes.func.isRequired,
  goToPath: PropTypes.func.isRequired,
  onReviewPage: PropTypes.bool,
};

const mapStateToProps = ({ form }) => {
  return {
    formData: form.data,
    employmentHistory: form.data.personalData.employmentHistory,
  };
};

export default connect(mapStateToProps)(SpouseEmploymentHistoryWidget);
