import React, { useEffect, useState } from 'react';
import { VaRadio } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';
import { clearJobIndex } from '../utils/session';

const EmploymentQuestion = props => {
  const {
    data,
    goBack,
    goToPath,
    setFormData,
    contentBeforeButtons,
    contentAfterButtons,
  } = props;

  const [hasJobToAdd, setHasJobToAdd] = useState(
    data.questions?.vetIsEmployed ?? false,
  );

  const hasJobs =
    data.personalData?.employmentHistory?.veteran?.employmentRecords;

  useEffect(() => {
    clearJobIndex();
  }, []);

  useEffect(
    () => {
      setFormData({
        ...data,
        questions: {
          ...data?.questions,
          vetIsEmployed: hasJobToAdd,
        },
      });
    },
    [hasJobToAdd],
  );

  const goForward = () => {
    if (hasJobToAdd) {
      const path = hasJobs
        ? '/employment-history'
        : '/enhanced-employment-records';
      goToPath(path);
    } else {
      goToPath('/your-benefits');
    }
  };

  const onSelection = event => {
    const { value } = event?.detail || {};
    if (value === undefined) return;
    setHasJobToAdd(value === 'true');
  };

  return (
    <form>
      <fieldset className="vads-u-margin-y--2">
        <legend className="schemaform-block-title">
          <h3 className="vads-u-margin--0">Your work history</h3>
        </legend>
        <VaRadio
          class="vads-u-margin-y--2"
          label="Have you had any jobs in the last 2 years?"
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
      <FormNavButtons goBack={goBack} goForward={goForward} submitToContinue />
      {contentAfterButtons}
    </form>
  );
};

EmploymentQuestion.propTypes = {
  data: PropTypes.object.isRequired,
  goBack: PropTypes.func.isRequired,
  goToPath: PropTypes.func.isRequired,
  setFormData: PropTypes.func.isRequired,
  contentAfterButtons: PropTypes.node,
  contentBeforeButtons: PropTypes.node,
};

export default EmploymentQuestion;
