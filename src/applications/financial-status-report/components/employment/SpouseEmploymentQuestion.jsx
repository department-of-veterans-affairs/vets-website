import React, { useEffect, useState } from 'react';
import { VaRadio } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';
import {
  clearJobIndex,
  setJobButton,
  clearJobButton,
  jobButtonConstants,
} from '../../utils/session';

const SpouseEmploymentQuestion = props => {
  const {
    data,
    goBack,
    goToPath,
    setFormData,
    contentBeforeButtons,
    contentAfterButtons,
  } = props;

  const [hasJobToAdd, setHasJobToAdd] = useState(
    data.questions?.spouseIsEmployed ?? false,
  );

  const hasJobs =
    data.personalData?.employmentHistory?.spouse?.spEmploymentRecords;

  useEffect(() => {
    clearJobIndex();
    clearJobButton();
  }, []);

  useEffect(
    () => {
      setFormData({
        ...data,
        questions: {
          ...data?.questions,
          spouseIsEmployed: hasJobToAdd,
        },
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hasJobToAdd],
  );

  const goForward = () => {
    if (hasJobToAdd) {
      if (!hasJobs?.length) {
        setJobButton(jobButtonConstants.FIRST_JOB);
      }

      const path = hasJobs
        ? '/spouse-employment-history'
        : '/enhanced-spouse-employment-records';
      goToPath(path);
    } else {
      goToPath('/spouse-benefits');
    }
  };

  const onSelection = event => {
    event.preventDefault();
    const { value } = event?.detail || {};
    if (value === undefined) return;
    setHasJobToAdd(value === 'true');
    if (!hasJobs) {
      setJobButton(jobButtonConstants.FIRST_JOB);
    }
  };

  return (
    <form>
      <fieldset className="vads-u-margin-y--2">
        <legend className="schemaform-block-title">
          <h3 className="vads-u-margin--0">Your spouse’s work history</h3>
        </legend>
        <VaRadio
          class="vads-u-margin-y--2"
          label="Has your spouse had any jobs in the last 2 years? "
          onVaValueChange={onSelection}
          required
          uswds
        >
          <va-radio-option
            id="has-job"
            label="Yes"
            value="true"
            checked={hasJobToAdd}
            uswds
          />
          <va-radio-option
            id="has-no-job"
            label="No"
            value="false"
            name="primary"
            checked={!hasJobToAdd}
            uswds
          />
        </VaRadio>
      </fieldset>
      {contentBeforeButtons}
      <FormNavButtons goBack={goBack} goForward={goForward} />
      {contentAfterButtons}
    </form>
  );
};

SpouseEmploymentQuestion.propTypes = {
  data: PropTypes.object.isRequired,
  goBack: PropTypes.func.isRequired,
  goToPath: PropTypes.func.isRequired,
  setFormData: PropTypes.func.isRequired,
  contentAfterButtons: PropTypes.node,
  contentBeforeButtons: PropTypes.node,
};

export default SpouseEmploymentQuestion;
