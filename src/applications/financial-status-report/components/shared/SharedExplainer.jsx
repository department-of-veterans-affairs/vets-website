import React from 'react';
import PropTypes from 'prop-types';
import ButtonGroup from './ButtonGroup';

const SharedExplainer = ({
  headline,
  paragraph1,
  paragraph2,
  goBack,
  goForward,
  goToPath,
  setFormData,
  data,
  explainerType,
  contentBeforeButtons,
  contentAfterButtons,
}) => {
  const { reviewNavigation = false } = data || {};
  const continueButtonText = reviewNavigation
    ? 'Continue to review page'
    : 'Continue';

  const onSubmit = event => {
    event.preventDefault();
    if (reviewNavigation) {
      if (setFormData) {
        // Check if setFormData is provided
        setFormData({
          ...data,
          reviewNavigation: false,
        });
      } else {
        throw new Error(
          'setFormData function must be provided when reviewNavigation is true.',
        );
      }
    }

    const action = explainerType === 'Streamlined' ? goForward : goToPath;
    if (action) {
      // Check if action is provided
      return action(data);
    }
    throw new Error(`Action function for ${explainerType} must be provided.`);
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
          <h3 slot="headline">{headline}</h3>
          <p>
            <strong>{paragraph1}</strong>
          </p>
          <p>{paragraph2}</p>
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
              onClick: onSubmit,
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

SharedExplainer.propTypes = {
  explainerType: PropTypes.oneOf(['Streamlined', 'Spouse']).isRequired,
  headline: PropTypes.string.isRequired,
  paragraph1: PropTypes.string.isRequired,
  paragraph2: PropTypes.string.isRequired,
  contentAfterButtons: PropTypes.object,
  contentBeforeButtons: PropTypes.object,
  data: PropTypes.shape({
    reviewNavigation: PropTypes.bool,
  }),
  goBack: PropTypes.func,
  goForward: PropTypes.func, // Optional
  goToPath: PropTypes.func, // Optional
  setFormData: PropTypes.func,
};

export default SharedExplainer;
