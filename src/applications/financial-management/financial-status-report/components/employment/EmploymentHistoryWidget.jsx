import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { useSelector, connect } from 'react-redux';
import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';
import EmploymentHistorySummaryCard from './EmploymentHistorySummaryCard';
import { EmptyMiniSummaryCard } from '../shared/MiniSummaryCard';
import {
  clearJobIndex,
  clearJobButton,
  setJobButton,
  jobButtonConstants,
} from '../../utils/session';

const EmploymentHistoryWidget = props => {
  const {
    goToPath,
    goForward,
    contentBeforeButtons,
    contentAfterButtons,
  } = props;

  const formData = useSelector(state => state.form.data);
  const employmentHistory =
    formData.personalData.employmentHistory.veteran.employmentRecords || [];

  useEffect(() => {
    clearJobIndex();
    clearJobButton();
  }, []);

  const handlers = {
    onBackClick: event => {
      event.preventDefault();
      goToPath('/employment-question');
    },
  };

  const navButtons = (
    <FormNavButtons
      goBack={handlers.onBackClick}
      goForward={goForward}
      useWebComponents={props.formOptions?.useWebComponentForNavigation}
    />
  );

  return (
    <form onSubmit={handlers.onSubmit}>
      <fieldset className="vads-u-margin-y--2">
        <legend className="schemaform-block-title">
          <h3 className="vads-u-margin--0">Your work history</h3>
        </legend>
        <div className="vads-u-margin-y--3" data-testid="debt-list">
          {employmentHistory.length === 0 ? (
            <EmptyMiniSummaryCard content="No employment history provided" />
          ) : (
            employmentHistory.map((job, index) => (
              <EmploymentHistorySummaryCard
                key={`${index}-${job.employername}`}
                job={job}
                index={index}
                isSpouse={false}
              />
            ))
          )}
        </div>
        <Link
          className="vads-c-action-link--green"
          to="/enhanced-employment-records"
          onClick={() => {
            setJobButton(jobButtonConstants.ADD_ANOTHER);
          }}
        >
          Add another job from the last 2 years
        </Link>
      </fieldset>
      {contentBeforeButtons}
      {navButtons}
      {contentAfterButtons}{' '}
    </form>
  );
};
EmploymentHistoryWidget.propTypes = {
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

export default connect(mapStateToProps)(EmploymentHistoryWidget);
