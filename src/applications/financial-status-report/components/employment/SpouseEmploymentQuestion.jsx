import React, { useEffect, useState } from 'react';
import { VaRadio } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';
import { clearJobIndex } from '../../utils/session';

const SpouseEmploymentQuestion = props => {
  const {
    data,
    goBack,
    goForward,
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
    [hasJobToAdd],
  );

  const handlers = {
    nextPage: () => {
      if (hasJobToAdd) {
        const path = hasJobs
          ? '/spouse-employment-history'
          : '/enhanced-spouse-employment-records';
        goToPath(path);
      } else {
        goToPath('/spouse-benefits');
      }
    },
  };

  const onSelection = event => {
    const { value } = event?.detail || {};
    if (value === undefined) return;
    setHasJobToAdd(value === 'true');
  };

  return (
    <form onSubmit={handlers.nextPage}>
      <fieldset className="vads-u-margin-y--2">
        <legend className="schemaform-block-title">
          <h3 className="vads-u-margin--0">Your spouse’s work history</h3>
        </legend>
        <VaRadio
          class="vads-u-margin-y--2"
          label="Has your spouse had any jobs in the last 2 years? "
          onVaValueChange={onSelection}
          required
        >
          <va-radio-option
            id="has-job"
            label="Yes"
            value="true"
            checked={hasJobToAdd}
          />
          <va-radio-option
            id="has-no-job"
            label="No"
            value="false"
            name="primary"
            checked={!hasJobToAdd}
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
