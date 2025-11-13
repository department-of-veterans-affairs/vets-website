import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { VaRadio } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import { HAS_VA_EVIDENCE } from '../../constants';
import { focusFirstError } from '../../../shared/utils/focus';

const VaPrompt = ({
  data,
  goBack,
  goForward,
  setFormData,
  contentBeforeButtons,
  contentAfterButtons,
}) => {
  const [error, setError] = useState(null);

  const handlers = {
    onSelection: event => {
      const { value } = event?.detail || null;
      const boolResponse = event?.detail?.value === 'y';

      if (value) {
        setFormData({
          ...data,
          [HAS_VA_EVIDENCE]: boolResponse,
        });

        if (error) {
          setError(null);
        }
      }
    },
    onGoForward: () => {
      if (typeof data[HAS_VA_EVIDENCE] === 'undefined') {
        setError('Select if we should get your VA medical records');
        setTimeout(focusFirstError);
      } else {
        setError(null);
        goForward(data);
      }
    },
  };

  return (
    <form onSubmit={handlers.onGoForward}>
      <VaRadio
        error={error}
        form-heading="Do you want us to get your VA medical records or military health records?"
        form-heading-level="3"
        onVaValueChange={e => handlers.onSelection(e)}
        required
        use-forms-pattern="single"
      >
        <va-radio-option
          checked={data[HAS_VA_EVIDENCE] === true}
          label="Yes, get my VA medical records or military health records to support my claim"
          name="va-prompt"
          value="y"
        />
        <va-radio-option
          checked={data[HAS_VA_EVIDENCE] === false}
          label="No, I don't need my VA medical records or military health records to support my claim"
          name="va-prompt"
          value="n"
        />
        <div slot="form-description" className={error ? 'error-bolding' : ''}>
          <p>
            We can collect your VA medical records or military health records
            from any of these sources to support your claim:
          </p>
          <ul>
            <li>VA medical center</li>
            <li>Community-based outpatient clinic</li>
            <li>Department of Defense military treatment facility</li>
            <li>Community care provider paid for by VA</li>
          </ul>
          <p>We’ll ask you the names of the treatment locations to include.</p>
          <p>
            <strong>Note:</strong> Later in this form, we’ll ask about your
            private (non-VA) provider medical records.
          </p>
        </div>
      </VaRadio>
      <div className="vads-u-margin-top--3">
        {contentBeforeButtons}
        <FormNavButtons
          goBack={goBack}
          goForward={handlers.onGoForward}
          useWebComponents
        />
        {contentAfterButtons}
      </div>
    </form>
  );
};

VaPrompt.propTypes = {
  data: PropTypes.object.isRequired,
  goBack: PropTypes.func.isRequired,
  goForward: PropTypes.func.isRequired,
  setFormData: PropTypes.func.isRequired,
  contentAfterButtons: PropTypes.element,
  contentBeforeButtons: PropTypes.element,
};

export default VaPrompt;
