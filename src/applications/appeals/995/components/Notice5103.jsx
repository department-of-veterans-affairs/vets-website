import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { VaCheckbox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import {
  scrollToFirstError,
  waitForRenderThenFocus,
} from 'platform/utilities/ui';

import { Notice5103Description, content } from '../content/notice5103';

const Notice5103 = ({
  data = {},
  goBack,
  goForward,
  setFormData,
  contentBeforeButtons,
  contentAfterButtons,
  // on review & submit page, in edit mode
  onReviewPage,
  updatePage,
}) => {
  const [hasError, setHasError] = useState(false);

  const handlers = {
    onGoForward: () => {
      if (!data.form5103Acknowledged) {
        setHasError(true);
        scrollToFirstError($('va-checkbox'));
        waitForRenderThenFocus('input', $('va-checkbox').shadowRoot);
      } else if (onReviewPage) {
        setHasError(false);
        updatePage();
      } else {
        setHasError(false);
        goForward(data);
      }
    },
    onChange: event => {
      const { checked } = event?.detail;
      setFormData({ ...data, form5103Acknowledged: checked });
      setHasError(!checked);
      if (!checked) {
        scrollToFirstError($('va-checkbox'));
        waitForRenderThenFocus('input', $('va-checkbox').shadowRoot);
      }
    },
  };

  return (
    <>
      <Notice5103Description onReviewPage={onReviewPage} />
      <VaCheckbox
        label={content.label}
        error={hasError ? content.error : null}
        onVaChange={handlers.onChange}
        checked={data.form5103Acknowledged}
        required
        enable-analytics
        uswds
      >
        <div slot="description">{content.descriptionInCheckbox}</div>
      </VaCheckbox>
      <div className="form-nav-buttons vads-u-margin-top--4">
        {onReviewPage && (
          <va-button
            onClick={handlers.onGoForward}
            label={content.updateLabel}
            text={content.update}
            uswds
          />
        )}
        {!onReviewPage && (
          <>
            {contentBeforeButtons}
            <FormNavButtons goBack={goBack} goForward={handlers.onGoForward} />
            {contentAfterButtons}
          </>
        )}
      </div>
    </>
  );
};

Notice5103.propTypes = {
  contentAfterButtons: PropTypes.element,
  contentBeforeButtons: PropTypes.element,
  data: PropTypes.shape({
    form5103Acknowledged: PropTypes.bool,
  }),
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
  onReviewPage: PropTypes.bool,
};

export default Notice5103;
