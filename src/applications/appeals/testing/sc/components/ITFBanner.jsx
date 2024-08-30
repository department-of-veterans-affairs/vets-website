import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { VaButtonPair } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  focusElement,
  waitForRenderThenFocus,
  scrollTo,
} from '@department-of-veterans-affairs/platform-utilities/ui';

import {
  itfMessage,
  itfError,
  itfSuccess,
  itfActive,
  itfExpander,
} from '../content/itfWrapper';

import { BASE_URL } from '../constants';

const ITFBanner = props => {
  const [messageDismissed, setMessageDismissed] = useState(false);

  const goHome = () => {
    props.router.push(`${BASE_URL}/introduction`);
  };

  const dismissMessage = () => {
    setMessageDismissed(true);
  };

  if (messageDismissed) {
    // Showing review page content doesn't re-render the progress bar
    if (props.router?.location.pathname.endsWith('review-and-submit')) {
      scrollTo('topScrollElement');
      // Focus on review & submit page h2 in stepper
      waitForRenderThenFocus('va-segmented-progress-bar', document, 250, 'h2');
    }
    return props.children;
  }

  let message;
  switch (props.status) {
    case 'error':
      message = itfMessage(
        'We can’t confirm if we have an intent to file on record for you right now',
        itfError,
        'info',
      );
      break;
    case 'itf-found':
      message = itfMessage(
        'You already have an Intent to File',
        itfActive(props.currentExpDate),
        'success',
      );
      break;
    case 'itf-created': {
      const { previousITF, currentExpDate, previousExpDate } = props;
      message = itfMessage(
        'You submitted an Intent to File',
        itfSuccess(previousITF, currentExpDate, previousExpDate),
        'success',
      );
      break;
    }
    default:
      throw new Error(`Unexpected status prop in ITFBanner: ${props.status}`);
  }

  setTimeout(() => {
    scrollTo('topContentElement');
    focusElement('.itf-wrapper h2');
  }, 100);

  return (
    <div className="itf-inner vads-l-grid-container vads-u-padding-left--0 vads-u-padding-bottom--5">
      <div className="usa-content">
        {message}
        <div className="vads-u-margin-top--2">{itfExpander}</div>
        <VaButtonPair
          class="vads-u-margin-top--2"
          continue
          onPrimaryClick={dismissMessage}
          onSecondaryClick={goHome}
          uswds
        />
      </div>
    </div>
  );
};

ITFBanner.propTypes = {
  status: PropTypes.oneOf(['error', 'itf-found', 'itf-created']).isRequired,
  children: PropTypes.any,
  currentExpDate: PropTypes.string,
  previousExpDate: PropTypes.string,
  previousITF: PropTypes.object,
  router: PropTypes.shape({
    push: PropTypes.func,
    location: PropTypes.shape({
      pathname: PropTypes.string,
    }),
  }),
};

export default ITFBanner;
