import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { VaTextarea } from '@department-of-veterans-affairs/web-components/react-bindings';
import ButtonGroup from '../shared/ButtonGroup';

const ResolutionComments = ({
  data,
  goBack,
  goForward,
  setFormData,
  contentBeforeButtons,
  contentAfterButtons,
}) => {
  const { additionalData, selectedDebtsAndCopays = [] } = data;

  const [commentText, setCommentText] = useState(
    additionalData?.additionalComments || '',
  );
  const [error, setError] = useState(null);

  const onContinue = () => {
    if (!commentText.length) {
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
    goForward(data);
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
          required={selectedDebtsAndCopays.some(
            debt => debt?.resolutionOption === 'waiver',
          )}
          type="text"
          uswds
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
              onClick: goBack,
              secondary: true,
              iconLeft: '«',
            },
            {
              label: 'Continue',
              onClick: onContinue,
              type: 'submit',
              iconRight: '»',
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
    selectedDebtsAndCopays: PropTypes.arrayOf(
      PropTypes.shape({
        resolutionOption: PropTypes.string,
      }),
    ),
  }),
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  goToPath: PropTypes.func,
  setFormData: PropTypes.func,
};

export default ResolutionComments;
