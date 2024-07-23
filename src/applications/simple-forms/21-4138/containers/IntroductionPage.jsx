import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { isLOA3, isLoggedIn } from 'platform/user/selectors';
import { IntroductionPageView } from '../../shared/components/IntroductionPageView';
import { TITLE, SUBTITLE, PrimaryActionLink } from '../config/constants';

const IntroductionPage = props => {
  const { route } = props;
  const userLoggedIn = useSelector(state => isLoggedIn(state));
  const userIdVerified = useSelector(state => isLOA3(state));

  const childContent = (
    <>
      <p>
        Use this form to provide additional information to support an existing
        claim.
      </p>
      <h2>What to know before filling out this form</h2>
      <p>
        If you want to submit more than one statement, you’ll need to use a new
        form for each statement.
      </p>
      <h3>Not sure if this is the right form to use?</h3>
      <p>
        For more information about how to choose the best supporting form,{' '}
        <a
          href="/supporting-forms-for-claims/"
          target="_blank"
          rel="noopener noreferrer"
        >
          read about all our supporting forms.
        </a>
      </p>
      <h2>Start your form</h2>
      <p>
        <b>Note:</b> You’ll need to sign in with a verified <b>Login.gov</b> or{' '}
        <b>ID.me</b> account or a Premium <b>DS Logon</b> or{' '}
        <b>My HealtheVet</b> account. If you don’t have any of those accounts,
        you can create a free <b>Login.gov</b> or <b>ID.me</b> account now.
      </p>
    </>
  );

  const content = {
    formTitle: TITLE,
    formSubTitle: SUBTITLE,
    authStartFormText: 'Start your statement',
    unauthStartText: 'Sign in to start your statement',
    displayNonVeteranMessaging: true,
    hideSipIntro: userLoggedIn && !userIdVerified,
    customLink: PrimaryActionLink,
  };

  const ombInfo = {
    resBurden: '15',
    ombNumber: '2900-0075',
    expDate: '6/30/2024',
  };

  return (
    <IntroductionPageView
      devOnly={{
        forceShowFormControls: true,
      }}
      route={route}
      content={content}
      ombInfo={ombInfo}
      childContent={childContent}
      userIdVerified={userIdVerified}
      userLoggedIn={userLoggedIn}
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
};

export default IntroductionPage;
