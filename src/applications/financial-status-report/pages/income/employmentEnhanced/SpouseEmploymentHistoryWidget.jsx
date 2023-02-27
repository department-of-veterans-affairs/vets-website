import React, { useEffect, useState } from 'react';
import { useSelector, connect } from 'react-redux';
import { VaRadio } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import EmploymentHistorySummaryCard from '../../../components/EmploymentHistorySummaryCard';
import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';
import { clearJobIndex } from '../../../utils/session';

const SpouseEmploymentHistoryWidget = props => {
  const { goToPath, goBack, onReviewPage } = props;
  const [hasAdditionalJobToAdd, setHasAdditionalJobToAdd] = useState('false');

  const formData = useSelector(state => state.form.data);
  const employmentHistory =
    formData.personalData.employmentHistory.spouse.employmentRecords || [];
  const efsrFeatureFlag = formData['view:enhancedFinancialStatusReport'];
  useEffect(() => {
    clearJobIndex();
  }, []);

  const handlers = {
    onSubmit: event => {
      event.preventDefault();
      if (hasAdditionalJobToAdd === 'true' && efsrFeatureFlag) {
        goToPath(`/enhanced-spouse-employment-records`);
      } else if (hasAdditionalJobToAdd === 'false' && efsrFeatureFlag) {
        goToPath(`/dependents-count`);
      } else {
        goToPath(`/dependents`);
      }
    },
    onSelection: event => {
      const { value } = event?.detail || {};
      if (value) {
        setHasAdditionalJobToAdd(value);
      }
    },
  };

  const navButtons = <FormNavButtons goBack={goBack} submitToContinue />;
  const updateButton = <button type="submit">Review update button</button>;

  return (
    <form onSubmit={handlers.onSubmit}>
      <div className="vads-u-margin-top--3" data-testid="debt-list">
        {employmentHistory.map((job, index) => (
          <EmploymentHistorySummaryCard
            key={`${index}-${job.employername}`}
            job={job}
            index={index}
            isSpouse
          />
        ))}
      </div>
      <VaRadio
        class="vads-u-margin-y--2"
        label="Has your spouse had another job in the last 2 years?"
        onVaValueChange={handlers.onSelection}
        required
      >
        <va-radio-option
          id="has-additional-job"
          label="Yes"
          value="true"
          checked={hasAdditionalJobToAdd === 'true'}
        />
        <va-radio-option
          id="has-no-additional-job"
          label="No"
          value="false"
          checked={hasAdditionalJobToAdd === 'false'}
        />
      </VaRadio>
      {onReviewPage ? updateButton : navButtons}
    </form>
  );
};

const mapStateToProps = ({ form }) => {
  return {
    formData: form.data,
    employmentHistory: form.data.personalData.employmentHistory,
  };
};

export default connect(mapStateToProps)(SpouseEmploymentHistoryWidget);
