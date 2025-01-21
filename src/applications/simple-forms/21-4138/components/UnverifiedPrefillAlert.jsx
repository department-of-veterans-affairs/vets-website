import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import {
  VaAlert,
  VaButton,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { UNAUTH_SIGN_IN_DEFAULT_MESSAGE } from 'platform/forms-system/src/js/constants';

const ButtonOnlyAlert = ({
  appType,
  ariaDescribedby,
  ariaLabel,
  getStartPage,
  handleClick,
  hideUnauthedStartLink,
  unauthStartButton,
}) => (
  <>
    {unauthStartButton}
    {!hideUnauthedStartLink && (
      <p>
        <Link
          onClick={handleClick}
          to={getStartPage}
          className="schemaform-start-button"
          aria-label={ariaLabel}
          aria-describedby={ariaDescribedby}
        >
          Start your {appType} without signing in
        </Link>
      </p>
    )}
  </>
);

ButtonOnlyAlert.propTypes = {
  appType: PropTypes.string.isRequired,
  getStartPage: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
  unauthStartButton: PropTypes.node.isRequired,
  ariaDescribedby: PropTypes.string,
  ariaLabel: PropTypes.string,
  hideUnauthedStartLink: PropTypes.bool,
};

const UnverifiedPrefillAlert = ({
  alertTitle,
  appType,
  formConfig,
  getStartPage,
  handleClick,
  retentionPeriod,
  retentionPeriodStart,
  ariaDescribedby,
  ariaLabel,
  buttonOnly,
  customLink,
  displayNonVeteranMessaging,
  headingLevel,
  hideUnauthedStartLink,
  openLoginModal,
  unauthStartText,
}) => {
  const Header = `h${headingLevel}`;
  const { signInHelpList } = formConfig;
  const CustomLink = customLink;
  const unauthStartButton = CustomLink ? (
    <CustomLink
      href="#start"
      onClick={event => {
        event.preventDefault();
        openLoginModal();
      }}
    >
      {unauthStartText || UNAUTH_SIGN_IN_DEFAULT_MESSAGE}
    </CustomLink>
  ) : (
    <VaButton
      onClick={openLoginModal}
      label={ariaLabel}
      aria-describedby={ariaDescribedby}
      uswds
      text={unauthStartText || UNAUTH_SIGN_IN_DEFAULT_MESSAGE}
    />
  );

  if (buttonOnly) {
    return (
      <ButtonOnlyAlert
        appType={appType}
        ariaDescribedby={ariaDescribedby}
        ariaLabel={ariaLabel}
        getStartPage={getStartPage}
        handleClick={handleClick}
        hideUnauthedStartLink={hideUnauthedStartLink}
        unauthStartButton={unauthStartButton}
      />
    );
  }

  return (
    <VaAlert status="info" uswds visible>
      <div className="usa-alert-body">
        <Header className="usa-alert-heading">{alertTitle}</Header>
        <div className="usa-alert-text">
          {displayNonVeteranMessaging ? (
            <p>
              By signing in, you can save your work in progress. You&rsquo;ll
              have {retentionPeriod} from {retentionPeriodStart} your {appType}{' '}
              to come back and finish it.
            </p>
          ) : (
            <>
              <p>Here&rsquo;s how signing in now helps you:</p>
              {signInHelpList ? (
                signInHelpList()
              ) : (
                <ul>
                  <li>
                    We can fill in some of your information for you to save you
                    time.
                  </li>
                  <li>
                    You can save your work in progress. You&rsquo;ll have{' '}
                    {retentionPeriod} from {retentionPeriodStart} your {appType}{' '}
                    to come back and finish it.
                  </li>
                </ul>
              )}
            </>
          )}
          <p>
            {!hideUnauthedStartLink && (
              <>
                <strong>Note:</strong> You can sign in after you start your{' '}
                {appType}. But you&rsquo;ll lose any information you already
                filled in.
              </>
            )}
          </p>
          {unauthStartButton}
          {!hideUnauthedStartLink && (
            <p>
              <Link
                onClick={handleClick}
                to={getStartPage}
                className="schemaform-start-button"
                aria-label={ariaLabel}
                aria-describedby={ariaDescribedby}
              >
                Start your {appType} without signing in
              </Link>
            </p>
          )}
        </div>
      </div>
    </VaAlert>
  );
};

UnverifiedPrefillAlert.propTypes = {
  alertTitle: PropTypes.string.isRequired,
  appType: PropTypes.string.isRequired,
  formConfig: PropTypes.shape({
    signInHelpList: PropTypes.func,
  }).isRequired,
  getStartPage: PropTypes.func.isRequired,
  handleClick: PropTypes.func.isRequired,
  retentionPeriod: PropTypes.string.isRequired,
  retentionPeriodStart: PropTypes.string.isRequired,
  ariaDescribedby: PropTypes.string,
  ariaLabel: PropTypes.string,
  buttonOnly: PropTypes.bool,
  customLink: PropTypes.any,
  displayNonVeteranMessaging: PropTypes.bool,
  headingLevel: PropTypes.number,
  hideUnauthedStartLink: PropTypes.bool,
  openLoginModal: PropTypes.func,
  unauthStartText: PropTypes.string,
};

export default UnverifiedPrefillAlert;
