import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { isLOA3, isLoggedIn } from 'platform/user/selectors';
import {
  VaAlertSignIn,
  VaButton,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { toggleLoginModal } from '@department-of-veterans-affairs/platform-site-wide/actions';
import { IntroductionPageView } from '../../shared/components/IntroductionPageView';
import { TITLE, SUBTITLE } from '../config/constants';

const IntroductionPage = props => {
  const { route } = props;
  const dispatch = useDispatch();
  const userLoggedIn = useSelector(state => isLoggedIn(state));
  const userIdVerified = useSelector(state => isLOA3(state));

  const childContent = (
    <>
      <p>
        Use this form to provide additional information to support an existing
        claim.
      </p>
      <h2>What to know before you fill out this form</h2>
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
    </>
  );

  const content = {
    formTitle: TITLE,
    formSubTitle: SUBTITLE,
    authStartFormText: 'Start your statement',
    unauthStartText: 'Sign in or create an account',
    displayNonVeteranMessaging: true,
    hideSipIntro: true,
  };

  const ombInfo = {
    resBurden: '15',
    ombNumber: '2900-0075',
    expDate: '6/30/2024',
  };

  const customSipComponent = (
    <VaAlertSignIn variant="signInRequired" disable-analytics visible>
      <span slot="SignInButton">
        <VaButton
          text={content.unauthStartText}
          onClick={() => dispatch(toggleLoginModal(true, '', true))}
          uswds
        />
      </span>
    </VaAlertSignIn>
  );

  return (
    <IntroductionPageView
      additionalChildContent={customSipComponent}
      childContent={childContent}
      content={content}
      devOnly={{ forceShowFormControls: true }}
      ombInfo={ombInfo}
      route={route}
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
