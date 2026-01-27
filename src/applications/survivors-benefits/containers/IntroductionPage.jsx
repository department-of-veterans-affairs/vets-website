import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { focusElement, scrollToTop } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import { useSelector } from 'react-redux';
import { isLOA3, isLoggedIn } from 'platform/user/selectors';
import { TITLE, SUBTITLE } from '../utils/constants';

const OMB_RES_BURDEN = '40';
const OMB_NUMBER = '2900-0004';
const OMB_EXP_DATE = '08/31/2028';

const IntroductionText = () => {
  return (
    <p className="va-introtext">
      Use this application if you’re the surviving spouse or child of a Veteran
      and want to apply for survivors benefits. You can also submit evidence
      with your application to get a faster decision.
    </p>
  );
};

const ProcessList = () => {
  return (
    <va-process-list>
      <va-process-list-item header="Check your eligibility">
        <p className="vads-u-margin-top--2">
          Check your eligibility requirements before you apply. If you think you
          may be eligible, but you’re not sure, we encourage you to apply.
        </p>
        <p>
          <a href="/family-and-caregiver-benefits/survivor-compensation/dependency-indemnity-compensation/">
            Find out if you’re eligible for VA Dependency and Indemnity
            Compensation (DIC)
          </a>
        </p>
        <p>
          <a href="/family-and-caregiver-benefits/survivor-compensation/survivors-pension/">
            Find out if you’re eligible for Survivors Pension
          </a>
        </p>
      </va-process-list-item>
      <va-process-list-item header="Determine which benefits to apply for">
        <p className="vads-u-margin-top--2">
          You can apply for these benefits with this application:
        </p>
        <ul>
          <li>Dependency Indemnity Compensation (DIC)</li>
          <li>Survivors Pension</li>
          <li>
            Increased benefits based on Aid and Attendance or being housebound
          </li>
          <li>Accrued Benefits</li>
          <li>Pension benefits for a disabled child</li>
        </ul>
        <p>
          You can also upload evidence (supporting documents) to support your
          application.
        </p>
      </va-process-list-item>
      <va-process-list-item header="Gather your information">
        <p className="vads-u-margin-top--2">
          Depending on which benefits you’re applying for, you’ll need to
          provide certain information and evidence.
        </p>
        <p>
          <a href="/resources/evidence-to-support-va-pension-dic-or-accrued-benefits-claims/">
            Learn more about evidence to support VA pension, DIC, or accrued
            benefits claims
          </a>
        </p>
      </va-process-list-item>
      <va-process-list-item header="Start your application">
        <p>
          We’ll take you through each step of the process. The time it takes to
          complete the application varies. It depends on what supporting
          documents you’re required to submit. We’ll let you know what
          supporting documents are required for you as you fill out the
          application.
        </p>
        <va-additional-info trigger="What happens after you apply">
          <p>
            We’ll process your application and send you a letter in the mail
            with our decision.
          </p>
          <p>
            We may request more information from you to make a decision about
            your medical expense reimbursement. If we request more information,
            you’ll need to respond within 30 days. If you don’t, we may decide
            your expenses with the evidence that’s available to us.
          </p>
        </va-additional-info>
      </va-process-list-item>
    </va-process-list>
  );
};

export const IntroductionPage = props => {
  const userLoggedIn = useSelector(state => isLoggedIn(state));
  const userIdVerified = useSelector(state => isLOA3(state));
  const { route, routes, router } = props;
  const { formConfig, pageList } = route;
  const showVerifyIdentify =
    userLoggedIn &&
    !userIdVerified; /* If User's signed-in but not identity-verified [not LOA3] */

  useEffect(() => {
    scrollToTop();
    focusElement('h1');
  }, []);

  const appendLoggedInQueryParam = (windowLocation = window.location) => {
    return `${windowLocation.origin}${windowLocation.pathname}?loggedIn=true`;
  };

  // Determine the first form route path (exclude intro/confirmation-style routes)
  // const getFirstFormPath = () => {
  //   const childRoutes = routes?.[0]?.childRoutes || [];
  //   const exclude = [
  //     'introduction',
  //     'review-and-submit',
  //     'confirmation',
  //     'confirm',
  //   ];
  //   const first = childRoutes.find(r => r?.path && !exclude.includes(r.path));
  //   return first?.path || childRoutes[0]?.path || null;
  // };

  const mockSignInButton = () => {
    const text = userLoggedIn
      ? 'Continue your application'
      : 'Sign in to start your application';

    const nextRoute = userLoggedIn
      ? routes[0].childRoutes[1].path // first page of form
      : appendLoggedInQueryParam();

    const onContinueButtonClick = event => {
      event.preventDefault();
      if (nextRoute) {
        router.push(nextRoute);
        return;
      }
      window.location = nextRoute;
    };

    const onSignInButtonClick = () => {
      const redirectLocation = `${formConfig.rootUrl}${
        formConfig.urlPrefix
      }introduction?loggedIn=true`;

      window.location = redirectLocation;
    };

    const LoggedInLink = () =>
      userLoggedIn ? (
        <va-link-action
          type="primary"
          onClick={onContinueButtonClick}
          text={text}
          href={nextRoute}
        />
      ) : (
        <va-button onClick={onSignInButtonClick} text={text} />
      );

    return <LoggedInLink />;
  };

  // TODO: Consolidate return into IntroductionPageView component
  return (
    <article className="schemaform-intro">
      <FormTitle title={TITLE} subTitle={SUBTITLE} />
      <IntroductionText />
      <h2 className="vads-u-margin-top--0">
        Follow these steps to get started:
      </h2>
      <ProcessList />
      {showVerifyIdentify ? (
        <div>{/* add verify identity alert if applicable */}</div>
      ) : (
        <>
          <SaveInProgressIntro
            headingLevel={2}
            hideUnauthedStartLink
            prefillEnabled={formConfig.prefillEnabled}
            messages={formConfig.savedFormMessages}
            pageList={pageList}
            startText="Apply for survivors benefits"
            devOnly={{
              forceShowFormControls: false,
            }}
            customLink={mockSignInButton}
          />
        </>
      )}
      <p />
      <va-omb-info
        res-burden={OMB_RES_BURDEN}
        omb-number={OMB_NUMBER}
        exp-date={OMB_EXP_DATE}
      />
    </article>
  );
};

IntroductionPage.propTypes = {
  route: PropTypes.shape({
    formConfig: PropTypes.shape({
      prefillEnabled: PropTypes.bool.isRequired,
      savedFormMessages: PropTypes.object.isRequired,
      rootUrl: PropTypes.string.isRequired,
      urlPrefix: PropTypes.string.isRequired,
    }).isRequired,
    pageList: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
  router: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    basename: PropTypes.string,
  }),
  routes: PropTypes.array,
};

export default IntroductionPage;
