import React from 'react';
import PropTypes from 'prop-types';
import ButtonGroup from './ButtonGroup';

const StreamlinedExplainer = ({
  contentBeforeButtons,
  contentAfterButtons,
  data,
  goBack,
  goForward,
  setFormData,
}) => {
  const { reviewNavigation = false } = data;
  // notify user they are returning to review page if they are in review mode
  const continueButtonText = reviewNavigation
    ? 'Continue to review page'
    : 'Continue';

  const onSubmit = event => {
    event.preventDefault();
    if (reviewNavigation) {
      setFormData({
        ...data,
        reviewNavigation: false,
      });
    }
    return goForward(data);
  };

  return (
    <form onSubmit={onSubmit}>
      <fieldset className="vads-u-margin-y--2">
        <va-alert
          close-btn-aria-label="Close notification"
          full-width
          status="info"
          uswds
          visible
        >
          <h3 slot="headline">You can skip questions on this form</h3>
          <p>
            <strong>
              Based on your responses so far, you’re tentatively eligible for
              debt relief. We don’t need to ask you any more questions.
            </strong>
          </p>
          <p>
            After you submit your request, we’ll mail you a letter with more
            details.
          </p>
        </va-alert>
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
              label: continueButtonText,
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

StreamlinedExplainer.propTypes = {
  contentAfterButtons: PropTypes.object,
  contentBeforeButtons: PropTypes.object,
  data: PropTypes.shape({
    reviewNavigation: PropTypes.bool,
  }),
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  setFormData: PropTypes.func,
};

export default StreamlinedExplainer;
