import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { VaRadio } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import { scrollToFirstError } from 'platform/utilities/ui';
import { useReviewPage } from '../hooks/useReviewPage';

const RepresentativeSubmissionMethod = props => {
  const { formData, setFormData, goBack, goForward, goToPath } = props;

  const [error, setError] = useState(null);

  const isReviewPage = useReviewPage();

  const handleGoBack = () => {
    if (isReviewPage) {
      goToPath('representative-contact?review=true');
    } else {
      goBack(formData);
    }
  };

  const handleGoForward = () => {
    if (!formData?.representativeSubmissionMethod) {
      setError('Choose how to submit your request by selecting an option');
      scrollToFirstError({ focusOnAlertRole: true });
    } else if (isReviewPage) {
      goToPath('/representative-organization?review=true');
    } else {
      goForward(formData);
    }
  };

  const handleRadioSelect = e => {
    setError(null);
    setFormData({
      ...formData,
      representativeSubmissionMethod: e.detail.value,
    });
  };

  return (
    <>
      <h3>Select how to submit your request</h3>
      <VaRadio
        error={error}
        name="repSubmissionMethod"
        label="How do you want to submit your request?"
        required
        onVaValueChange={handleRadioSelect}
      >
        <va-radio-option
          label="Online"
          name="method"
          value="digital"
          key={0}
          checked={formData.representativeSubmissionMethod === 'digital'}
        />
        <va-radio-option
          label="By mail"
          name="method"
          value="mail"
          key={1}
          checked={formData.representativeSubmissionMethod === 'mail'}
        />
        <va-radio-option
          label="In person"
          name="method"
          value="in person"
          key={2}
          checked={formData.representativeSubmissionMethod === 'in person'}
        />
      </VaRadio>
      <p>
        <strong>Note:</strong> If you want to submit your request by mail or in
        person, you’ll need to print your form at the end of our online tool.
        We’ll provide instructions on how to submit it.
      </p>
      <FormNavButtons goBack={handleGoBack} goForward={handleGoForward} />
    </>
  );
};

RepresentativeSubmissionMethod.propTypes = {
  formData: PropTypes.object,
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  goToPath: PropTypes.func,
  setFormData: PropTypes.func,
};

function mapStateToProps(state) {
  return {
    formData: state.form.data,
  };
}

export { RepresentativeSubmissionMethod }; // Named export for testing

export default connect(mapStateToProps, null)(RepresentativeSubmissionMethod);
