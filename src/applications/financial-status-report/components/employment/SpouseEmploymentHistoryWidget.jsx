import React, { useEffect } from 'react';
import { useSelector, connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import EmploymentHistorySummaryCard from './EmploymentHistorySummaryCard';
import { EmptyMiniSummaryCard } from '../shared/MiniSummaryCard';
import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';
import {
  clearJobIndex,
  setJobButton,
  jobButtonConstants,
} from '../../utils/session';

const SpouseEmploymentHistoryWidget = props => {
  const {
    goToPath,
    goForward,
    contentBeforeButtons,
    contentAfterButtons,
  } = props;

  const formData = useSelector(state => state.form.data);
  const employmentHistory =
    formData.personalData.employmentHistory.spouse.spEmploymentRecords || [];
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
    <FormNavButtons goBack={handlers.onBackClick} goForward={goForward} />
  );

  const emptyPrompt = `Select the ‘add additional job link to add another job. Select the continue button to move on to the next question.`;

  return (
    <form>
      <fieldset className="vads-u-margin-y--2">
        <legend className="schemaform-block-title">
          <h3 className="vads-u-margin--0">Your spouse’s work history</h3>
        </legend>
        <div className="vads-u-margin-y--3" data-testid="debt-list">
          {employmentHistory.length === 0 ? (
            <EmptyMiniSummaryCard content={emptyPrompt} />
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
          onClick={() => {
            setJobButton(jobButtonConstants.ADD_ANOTHER);
          }}
        >
          Add another job from the last 2 years
        </Link>
      </fieldset>
      {contentBeforeButtons}
      {navButtons}
      {contentAfterButtons}
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
