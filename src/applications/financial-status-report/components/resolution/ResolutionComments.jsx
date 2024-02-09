import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { VaTextarea } from '@department-of-veterans-affairs/web-components/react-bindings';
import ButtonGroup from '../shared/ButtonGroup';

const ResolutionComments = ({
  data,
  goBack,
  goForward,
  goToPath,
  setFormData,
  contentBeforeButtons,
  contentAfterButtons,
}) => {
  const {
    additionalData,
    reviewNavigation = false,
    selectedDebtsAndCopays = [],
    'view:reviewPageNavigationToggle': showReviewNavigation,
  } = data;

  const [commentText, setCommentText] = useState(
    additionalData?.additionalComments || '',
  );
  const [error, setError] = useState(null);
  const commentsRequired = selectedDebtsAndCopays.some(
    debt => debt?.resolutionOption === 'waiver',
  );

  // notify user they are returning to review page if they are in review mode
  const continueButtonText =
    reviewNavigation && showReviewNavigation
      ? 'Continue to review page'
      : 'Continue';

  const onContinue = () => {
    if (!commentText.length && commentsRequired) {
      setError('Please provide a response');
    } else {
      setError(null);
      setFormData({
        ...data,
        additionalData: {
          ...additionalData,
          additionalComments: commentText,
        },
      });
    }
  };

  const onSubmit = event => {
    event.preventDefault();
    if (error) return;

    if (reviewNavigation && showReviewNavigation) {
      setFormData({
        ...data,
        reviewNavigation: false,
      });
      goToPath('/review-and-submit');
    } else {
      goForward(data);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <fieldset className="vads-u-margin-y--2">
        <legend className="schemaform-block-title">
          <h3 className="vads-u-margin--0">Supporting personal statement</h3>
        </legend>
        <VaTextarea
          error={error}
          id="resolution-comments"
          inputMode="text"
          label="Please tell us more about why you need help with this debt(s)"
          maxlength="32000"
          name="resolution-comments"
          onInput={({ target }) => {
            if (target.value.length > 0) {
              setError(null);
            }
            setCommentText(target.value);
          }}
          required={commentsRequired}
          type="text"
          uswds
          value={commentText}
        >
          <div>
            <va-additional-info
              trigger="Why do I need to share this information?"
              uswds
            >
              We want to fully understand your situation so we can make the best
              decision on your request. You can share any details that you think
              we should know about why it is hard for you or your family to
              repay this debt.
            </va-additional-info>
          </div>
        </VaTextarea>
        {contentBeforeButtons}
        <ButtonGroup
          buttons={[
            {
              label: 'Back',
              isBackButton: true,
              onClick: goBack, // Define this function based on page-specific logic
              isSecondary: true,
            },
            {
              label: continueButtonText,
              isContinueButton: false,
              onClick: onContinue,
              isSubmitting: true, // If this button submits a form
            },
          ]}
        />
        {contentAfterButtons}
      </fieldset>
    </form>
  );
};

ResolutionComments.propTypes = {
  contentAfterButtons: PropTypes.object,
  contentBeforeButtons: PropTypes.object,
  data: PropTypes.shape({
    additionalData: PropTypes.shape({
      additionalComments: PropTypes.string,
    }),
    reviewNavigation: PropTypes.bool,
    selectedDebtsAndCopays: PropTypes.arrayOf(
      PropTypes.shape({
        resolutionOption: PropTypes.string,
      }),
    ),
    'view:reviewPageNavigationToggle': PropTypes.bool,
  }),
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  goToPath: PropTypes.func,
  setFormData: PropTypes.func,
};

export default ResolutionComments;
