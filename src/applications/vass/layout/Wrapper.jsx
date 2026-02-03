import React, { useEffect } from 'react';
import DowntimeNotification, {
  externalServices,
} from 'platform/monitoring/DowntimeNotification';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom-v5-compat';
import classNames from 'classnames';
import { focusElement } from 'platform/utilities/ui';

import NeedHelp from '../components/NeedHelp';
import ErrorAlert from '../components/ErrorAlert';

// TODO: combine errorAlert and verificationError into a single prop

const getContent = (errorAlert, verificationError, children) => {
  if (errorAlert) {
    return <ErrorAlert />;
  }
  if (verificationError) {
    return (
      <va-alert
        data-testid="verification-error-alert"
        class="vads-u-margin-top--4"
        status="error"
      >
        {verificationError}
      </va-alert>
    );
  }
  return children;
};

const Wrapper = props => {
  const {
    children,
    pageTitle,
    className = '',
    testID,
    showBackLink = false,
    required = false,
    verificationError,
    loading = false,
    loadingMessage = 'Loading...',
    errorAlert = false,
  } = props;
  const navigate = useNavigate();

  useEffect(() => {
    focusElement('h1');
  }, []);

  useEffect(
    () => {
      if (verificationError) {
        setTimeout(() => {
          focusElement('va-alert[data-testid="verification-error-alert"]');
        }, 100);
      }
    },
    [verificationError],
  );

  if (loading) {
    return (
      <div className="vads-l-grid-container vads-u-margin-y--8">
        <va-loading-indicator
          data-testid="loading-indicator"
          message={loadingMessage}
        />
      </div>
    );
  }

  const content = getContent(errorAlert, verificationError, children);

  return (
    <div
      className={classNames(`vads-l-grid-container vads-u-padding-x--2p5`, {
        'vads-u-padding-y--3': !showBackLink,
        'vads-u-padding-top--2 vads-u-padding-bottom--3': showBackLink, // Make the spacing consistent when showBackLink is true
        [className]: className,
      })}
      data-testid={testID}
    >
      {!errorAlert &&
        showBackLink && (
          <div className="vads-u-margin-bottom--2p5 vads-u-margin-top--0">
            <nav aria-label="backlink">
              <va-link
                back
                aria-label="Back link"
                data-testid="back-link"
                text="Back"
                href="#"
                onClick={e => {
                  e.preventDefault();
                  navigate(-1);
                }}
              />
            </nav>
          </div>
        )}
      <div className="vads-l-row">
        <div className="vads-l-col--12 medium-screen:vads-l-col--8">
          {!errorAlert &&
            pageTitle && (
              <h1 tabIndex="-1" data-testid="header">
                {pageTitle}
                {required && (
                  <span className="vass-usa-label--required vads-u-font-family--sans">
                    (*Required)
                  </span>
                )}
              </h1>
            )}
          <DowntimeNotification
            appTitle="VA Solid Start"
            dependencies={[externalServices.vass]}
          >
            {content}
          </DowntimeNotification>
          <NeedHelp />
        </div>
      </div>
    </div>
  );
};

export default Wrapper;

Wrapper.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  errorAlert: PropTypes.bool,
  loading: PropTypes.bool,
  loadingMessage: PropTypes.string,
  pageTitle: PropTypes.string,
  required: PropTypes.bool,
  showBackLink: PropTypes.bool,
  testID: PropTypes.string,
  verificationError: PropTypes.string,
};
