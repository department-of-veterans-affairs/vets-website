import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { isLOA3, isLoggedIn } from 'platform/user/selectors';
import { IntroductionPageView } from '../../shared/components/IntroductionPageView';
import { TITLE, SUBTITLE, PrimaryActionLink } from '../config/constants';
import IdNotVerifiedAlert from '../../shared/components/IdNotVerified';

const IntroductionPage = props => {
  const { route } = props;
  const userLoggedIn = useSelector(state => isLoggedIn(state));
  const userIdVerified = useSelector(state => isLOA3(state));

  const childContent = (
    <>
      <p>
        Use this form to share more information as instructed by another VA form
        or process. Here are a few examples of when you may need to use this
        form:
      </p>
      <ul>
        <li>
          To share more details about your family situation or finances for
          applications or claims related to pension, Dependency and Indemnity
          Compensation, or accrued benefits
        </li>
        <li>
          To tell us about reimbursement you received after you submitted a
          medical expense report
        </li>
        <li>
          To share more details about claimed disabilities or other issues in
          support of your claim that can’t fit on the original claim form
        </li>
      </ul>
      <h2>What to know before you fill out this form</h2>
      <ul>
        <li>
          We may tell you to use this form in certain cases like the ones listed
          on this page.
        </li>
        <li>
          In many cases, there are better ways to share information or requests
          with us than using this form. When you start the online form, we’ll
          help direct you to the best way to share your information or request.
          This means we may encourage you to use a different form before
          continuing. It’s your choice which form you’d like to use.
        </li>
        <li>
          You can also review more supporting form options now to choose the
          best form for your needs.{' '}
          <a
            href="/supporting-forms-for-claims/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Review more supporting forms for VA claims
          </a>
        </li>
        <li>
          If you want to submit more than one statement, you’ll need to use a
          new form for each statement.
        </li>
      </ul>
      {userLoggedIn &&
      !userIdVerified /* If User's signed-in but not identity-verified [not LOA3] */ && (
          <IdNotVerifiedAlert formNumber="21-4138" formType="form" />
        )}
    </>
  );

  const content = {
    formTitle: TITLE,
    formSubTitle: SUBTITLE,
    authStartFormText: 'Start your statement',
    unauthStartText: 'Sign in or create an account',
    displayNonVeteranMessaging: true,
    hideSipIntro: userLoggedIn && !userIdVerified,
    customLink: PrimaryActionLink,
  };

  const ombInfo = {
    resBurden: '15',
    ombNumber: '2900-0075',
    expDate: '7/31/2027',
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
