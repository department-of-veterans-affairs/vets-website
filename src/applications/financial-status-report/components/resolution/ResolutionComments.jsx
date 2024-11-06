import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import { VaTextarea } from '@department-of-veterans-affairs/web-components/react-bindings';
import ButtonGroup from '../shared/ButtonGroup';

const ResolutionComments = ({
  goBack,
  goForward,
  goToPath,
  contentBeforeButtons,
  contentAfterButtons,
}) => {
  const dispatch = useDispatch();
  const formData = useSelector(state => state.form.data);

  const {
    selectedDebtsAndCopays = [],
    additionalData = {}, // Ensure additionalData is an object by default
    reviewNavigation = false,
    'view:reviewPageNavigationToggle': showReviewNavigation,
  } = formData;

  const commentsRequired = selectedDebtsAndCopays.some(
    debt => debt?.resolutionOption === 'waiver',
  );

  const commentText = additionalData?.additionalComments || '';

  const onCommentChange = ({ target }) => {
    const updatedFormData = {
      ...formData,
      additionalData: {
        ...additionalData,
        additionalComments: target.value,
      },
    };
    dispatch(setData(updatedFormData));
  };

  const [error, setError] = React.useState(null);

  const onSubmit = event => {
    event.preventDefault();
    if (!commentText.length && commentsRequired) {
      setError('Please provide a response');
      return;
    }
    setError(null);
    const updatedFormData = {
      ...formData,
      additionalData: {
        ...additionalData,
        additionalComments: commentText,
      },
    };

    dispatch(setData(updatedFormData));

    if (reviewNavigation && showReviewNavigation) {
      dispatch(
        setData({
          ...updatedFormData,
          reviewNavigation: false,
        }),
      );
      goToPath('/review-and-submit');
    } else {
      goForward(updatedFormData);
    }
  };

  const continueButtonText =
    reviewNavigation && showReviewNavigation
      ? 'Continue to review page'
      : 'Continue';

  return (
    <form>
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
          onInput={onCommentChange}
          required={commentsRequired}
          type="text"
          value={commentText}
        >
          <div>
            <va-additional-info trigger="Why do I need to share this information?">
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
              onClick: goBack, // Define this function based on page-specific logic
              isSecondary: true,
            },
            {
              label: continueButtonText,
              onClick: onSubmit,
              isSubmitting: 'prevent', // If this button submits a form
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
