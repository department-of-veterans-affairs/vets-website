import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

import { VaButtonPair } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from 'platform/utilities/ui';
import environment from 'platform/utilities/environment';

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
    props.router.push(`/introduction`);
  };

  const dismissMessage = () => {
    setMessageDismissed(true);
  };

  if (messageDismissed) {
    return props.children;
  }

  let message;
  switch (props.status) {
    case 'error':
      message = itfMessage(
        'We’re sorry. Something went wrong on our end.',
        itfError,
        'error',
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
    focusElement('.itf-wrapper h2');
  }, 100);

  return (
    <div className="itf-inner vads-l-grid-container vads-u-padding-left--0 vads-u-padding-bottom--5">
      <div className="usa-content">
        {message}
        <div className="vads-u-margin-top--2">{itfExpander}</div>
        {props.status === 'error' ? (
          <p>
            <Link to={BASE_URL} className="vads-u-margin-top--2">
              Back
            </Link>
            {!environment.isProduction() && (
              <va-button
                class="vads-u-margin-left--2"
                onClick={dismissMessage}
                text="Continue (testing only)"
                uswds
              />
            )}
          </p>
        ) : (
          <VaButtonPair
            class="vads-u-margin-top--2"
            continue
            onPrimaryClick={dismissMessage}
            onSecondaryClick={goHome}
            uswds
          />
        )}
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
  }),
};

export default ITFBanner;
