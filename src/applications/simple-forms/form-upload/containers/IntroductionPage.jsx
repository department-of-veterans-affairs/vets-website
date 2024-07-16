import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { isLOA3, isLoggedIn } from 'platform/user/selectors';
import { IntroductionPageView } from '../../shared/components/IntroductionPageView';
import { PrimaryActionLink } from '../config/constants';
import { getFormContent } from '../helpers';

const IntroductionPage = props => {
  const { route } = props;
  const userLoggedIn = useSelector(state => isLoggedIn(state));
  const userIdVerified = useSelector(state => isLOA3(state));
  const {
    title,
    subtitle,
    childContent,
    additionalChildContent,
  } = getFormContent();

  const content = {
    formTitle: title,
    formSubTitle: subtitle,
    authStartFormText: 'Start your form upload',
    unauthStartText: 'Sign in to upload your form',
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
      additionalChildContent={additionalChildContent}
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
