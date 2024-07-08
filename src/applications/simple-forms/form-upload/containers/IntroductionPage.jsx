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
        <ul className="remove-bullets">
          <li>related to: Disability</li>
          <li>Form last updated: October 2023</li>
        </ul>
      </p>
      <h2>When to use this form</h2>
      <p>
        Use VA Form 21-0779 if you’re a resident of a nursing home and you’re
        providing supporting information for your claim application for VA Aid
        and Attendance benefits.
      </p>
      <h3>Download form</h3>
      <p>
        Download this PDF form and fill it out. Then submit your completed form
        on this page. Or you can print the form and mail it to the address
        listed on the form.
      </p>
      <h3>Submit completed form</h3>
      <p>After you complete the form, you can upload and submit it here.</p>
      <h2>Related forms and instructions</h2>
      <h3>
        <a href="">VA Form 21-2680</a>
        <p>
          Examination for Housebound Status or Permanent Need for Regular Aid
          and Attendance
        </p>
      </h3>
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
