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
      <div>
        <ul className="remove-bullets">
          <li>related to: Disability</li>
          <li>Form last updated: October 2023</li>
        </ul>
      </div>
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
      <div className="vads-u-margin-y--4">
        <va-link
          download
          href="https://www.vba.va.gov/pubs/forms/VBA-21-0779-ARE.pdf"
          text="Download VA Form 21-0779"
        />
      </div>
      <h3>Submit completed form</h3>
      <p>After you complete the form, you can upload and submit it here.</p>
    </>
  );

  const additionalChildContent = (
    <>
      <h2>Related forms and instructions</h2>
      <h3>
        <div className="vads-u-margin-y--4">
          <va-link
            href="https://www.va.gov/find-forms/about-form-21-2680/"
            text="VA Form 21-2680"
          />
        </div>
      </h3>
      <p>
        Examination for Housebound Status or Permanent Need for Regular Aid and
        Attendance
      </p>
      <p>
        Use VA Form 21-2680 to apply for Aid and Attendance benefits that will
        be added to your monthly compensation or pension benefits.
      </p>
      <div className="vads-u-margin-y--4">
        <va-link
          download
          href="https://www.vba.va.gov/pubs/forms/VBA-21-2680-ARE.pdf"
          text="Download VA Form 21-2680"
        />
      </div>
      <div
        className="vads-u-display--none medium-screen:vads-u-display--flex vads-u-flex-direction--column vads-u-padding-x--2 vads-u-background-color--gray-light-alt vads-u-margin-top--2p5 vads-u-margin-bottom--4"
        data-e2e-id="yellow-ribbon--helpful-links"
      >
        <h3 className="vads-u-margin--0 vads-u-padding-top--1 vads-u-padding-bottom--1p5 vads-u-border-bottom--1px vads-u-border-color--gray-light">
          Helpful links related to VA Form 21-0779
        </h3>
        <p className="vads-u-font-weight--bold vads-u-margin-bottom--0">
          <a href="https://www.va.gov/pension/aid-attendance-housebound/">
            VA Aid and Attendance benefits and Housebound allowance
          </a>
        </p>
        <p className="vads-u-margin-top--0">
          If you need help with daily activities, or you’re housebound, learn
          about these benefits and if you qualify.
        </p>
      </div>
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
