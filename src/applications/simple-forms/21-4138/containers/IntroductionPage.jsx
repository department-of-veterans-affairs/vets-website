import React from 'react';

import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { isLOA3, isLoggedIn } from 'platform/user/selectors';
import { IntroductionPageView } from '../../shared/components/IntroductionPageView';

// import { TITLE, SUBTITLE } from '../config/constants';
// import manifest from '../manifest.json';

const IntroductionPage = props => {
  const { route } = props;
  // WIP: need to keep unit-tests passing with these new selector-hooks
  const userLoggedIn = useSelector(state => isLoggedIn(state));
  const userIdVerified = useSelector(state => isLOA3(state));

  const childContent = (
    <>
      <p>Stuff</p>
    </>
  );

  const content = {
    formTitle: 'TITLE',
    formSubTitle: 'SUBTITLE',
    authStartFormText: 'Start your request for priority processing',
    unauthStartText: 'Sign in to start filling out your form',
    displayNonVeteranMessaging: true,
    hideSipIntro: userLoggedIn && !userIdVerified,
  };

  const ombInfo = {
    resBurden: '15',
    ombNumber: '2900-0075',
    expDate: '6/30/2024',
  };

  return (
    <IntroductionPageView
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
