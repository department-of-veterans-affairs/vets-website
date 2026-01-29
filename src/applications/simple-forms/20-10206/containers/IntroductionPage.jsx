import React, { useEffect } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { isLOA3, isLoggedIn } from 'platform/user/selectors';
import { IntroductionPageView } from '../../shared/components/IntroductionPageView';
import { SUBTITLE, TITLE } from '../config/constants';
import IdNotVerifiedAlert from '../../shared/components/IdNotVerified';

const ombInfo = {
  resBurden: '5',
  ombNumber: '2900-0877',
  expDate: '08/31/2026',
};

const appendLoggedInQueryParam = (windowLocation = window.location) => {
  return `${windowLocation.origin}${windowLocation.pathname}?loggedIn=true`;
};

/**
 * Creates a sign-in button component based on user login status
 * @param {Object} params - Parameters for creating the sign-in button
 * @param {boolean} params.userLoggedIn - Whether the user is logged in
 * @param {Array} params.routes - Routes array
 * @param {Object} params.router - Router object for navigation
 * @param {Function} params.appendLoggedInQueryParam - Function to append logged in query param
 * @returns {React.Component} A sign-in button component
 */
const createSignInButton = ({ userLoggedIn, routes, router }) => {
  const text = userLoggedIn
    ? 'Start your request'
    : 'Sign in to start your request';

  const nextRoute = userLoggedIn
    ? routes[0].childRoutes[1].path
    : appendLoggedInQueryParam();

  const onSignInButtonClick = event => {
    event.preventDefault();
    if (userLoggedIn) {
      router.push(nextRoute);
      return;
    }

    window.location = nextRoute;
  };

  const LoggedInLink = ({ loggedIn }) =>
    loggedIn ? (
      <va-link-action
        type="primary"
        onClick={onSignInButtonClick}
        text={text}
        href={nextRoute}
      />
    ) : (
      <va-button onClick={onSignInButtonClick} text={text} />
    );
  return <LoggedInLink loggedIn={userLoggedIn} />;
};

export const IntroductionPage = ({
  route,
  userIdVerified,
  userLoggedIn,
  router,
  routes,
}) => {
  const content = {
    formTitle: TITLE,
    formSubTitle: SUBTITLE,
    authStartFormText: 'Start your request',
    unauthStartText: 'Sign in to start your request',
    hideSipIntro: userLoggedIn && !userIdVerified,
    displayNonVeteranMessaging: true,
  };

  const childContent = (
    <>
      <p>
        Use this form to access personal military, compensation, pension, or
        benefit records.
      </p>
      <h2>What to know before you fill out this form</h2>
      <ul>
        <li>
          You must be a U.S. citizen or a legal permanent resident to access
          your records under the Privacy Act (PA).
        </li>
        <li>
          You can use this form only to request your own personal records. To
          request records for someone else, you can use the Public Access Link
          (PAL) to submit a FOIA request.{' '}
          <a
            href="https://www.va.gov/FOIA/index.asp"
            target="_blank"
            rel="noopener noreferrer"
          >
            Request someone else’s records on PAL (opens in new tab)
          </a>
        </li>
      </ul>

      <h2>Types of information you can request</h2>
      <p>You can request any of these kinds of personal records:</p>
      <h3 className="vads-u-font-size--h6">
        Your compensation and pension records
      </h3>
      <ul>
        <li>Certificate of Release or Discharge from Active Duty (DD214)</li>
        <li>Claims file (C-file)</li>
        <li>
          Claim exams (sometimes called disability examinations or C&P exams){' '}
        </li>
        <li>Official military personnel file (OMPF)</li>
        <li>Pension benefit documents</li>
        <li>Service or military treatment</li>
        <li>Other compensation and pension records</li>
      </ul>
      <h3 className="vads-u-font-size--h6">Your benefit records</h3>
      <ul>
        <li>Education benefit</li>
        <li>Fiduciary services</li>
        <li>Financial records</li>
        <li>Home loan benefit</li>
        <li>Life insurance benefit</li>
        <li>Vocational rehabilitation and employment</li>
        <li>Other benefit record</li>
      </ul>

      {userLoggedIn &&
      !userIdVerified /* If User's signed-in but not identity-verified [not LOA3] */ && (
          <IdNotVerifiedAlert formNumber="20-10206" />
        )}
    </>
  );

  useEffect(
    () => {
      const signInLink = document.querySelector(
        '.sign-in-nav .sign-in-links .sign-in-link',
      );

      if (signInLink && !userLoggedIn) {
        const handleClick = e => {
          e.stopPropagation();
          e.preventDefault();
          window.location = appendLoggedInQueryParam();
        };

        signInLink.addEventListener('click', handleClick);

        return () => {
          signInLink.removeEventListener('click', handleClick);
        };
      }

      // Return an empty cleanup function if no event listener was added
      return () => {};
    },
    [userLoggedIn],
  );

  // Create the sign-in button using the extracted function
  const signInButton = () =>
    createSignInButton({
      userLoggedIn,
      routes,
      router,
      appendLoggedInQueryParam,
    });

  return (
    <IntroductionPageView
      route={route}
      content={{
        ...content,
        customLink: signInButton,
      }}
      ombInfo={ombInfo}
      childContent={childContent}
      userIdVerified={userIdVerified}
      userLoggedIn={userLoggedIn}
      devOnly={{
        forceShowFormControls: true,
      }}
    />
  );
};

IntroductionPage.propTypes = {
  route: PropTypes.shape({
    formConfig: PropTypes.shape({
      prefillEnabled: PropTypes.bool.isRequired,
      savedFormMessages: PropTypes.object.isRequired,
    }).isRequired,
    pageList: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
  userIdVerified: PropTypes.bool,
  userLoggedIn: PropTypes.bool,
};

const mapStateToProps = state => ({
  userIdVerified: isLOA3(state),
  userLoggedIn: isLoggedIn(state),
});

export default connect(mapStateToProps)(IntroductionPage);
