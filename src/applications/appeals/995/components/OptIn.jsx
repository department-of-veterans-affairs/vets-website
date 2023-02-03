import React from 'react';
import PropTypes from 'prop-types';
import { VaCheckbox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';

import { content } from '../content/optIn';

const OptIn = ({
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
  const handlers = {
    onGoForward: () => {
      if (onReviewPage) {
        updatePage();
      } else {
        goForward(data);
      }
    },
    onChange: event => {
      const { checked } = event.detail;
      setFormData({ ...data, socOptIn: checked });
    },
  };

  return (
    <>
      {content.description}
      <VaCheckbox
        label={content.label}
        onVaChange={handlers.onChange}
        checked={data?.socOptIn}
        enable-analytics
      />
      <div className="form-nav-buttons vads-u-margin-top--4">
        {onReviewPage && (
          <va-button
            onClick={handlers.onGoForward}
            label="Update opt in page"
            text={content.update}
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

OptIn.propTypes = {
  contentAfterButtons: PropTypes.element,
  contentBeforeButtons: PropTypes.element,
  data: PropTypes.shape({
    socOptIn: PropTypes.bool,
  }),
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  setFormData: PropTypes.func,
  updatePage: PropTypes.func,
  onReviewPage: PropTypes.bool,
};

export default OptIn;
