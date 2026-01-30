import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { focusElement } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import { getNextPagePath } from 'platform/forms-system/src/js/routing';
import { getIntroState } from 'platform/forms/save-in-progress/selectors';
import { querySelectorWithShadowRoot } from 'platform/utilities/ui/webComponents';
import { fetchClaimantInfo } from '../actions';
import {
  selectMeb1995Reroute,
  selectMeb1995RudisillAccess,
} from '../selectors/featureToggles';

export const IntroductionPageRedirect = ({ route, router }) => {
  const dispatch = useDispatch();
  const rerouteFlag = useSelector(selectMeb1995Reroute);
  const rudisillAccessEnabled = useSelector(selectMeb1995RudisillAccess);
  const { user, formData } = useSelector(state => getIntroState(state));

  useEffect(() => {
    focusElement('.va-nav-breadcrumbs-list');
  }, []);

  // Update sign-in alert copy only for unauthenticated users
  useEffect(() => {
    const updateSignInAlertCopy = async () => {
      const signInAlert = document.querySelector('va-alert-sign-in');
      if (!signInAlert) return;

      try {
        const alertContent = await querySelectorWithShadowRoot(
          '.va-alert-sign-in__body',
          'va-alert-sign-in',
        );

        if (!alertContent) return;
        alertContent.innerHTML = `
          <h2 class="headline">Sign in with a verified account</h2>
          <p>
            Here's how signing in with an identity-verified account helps you:
          </p>
          <ul>
            <li>
              We can fill in some of your information for you to save you time.
            </li>
          </ul>
          <p>
            <strong>Don't yet have a verified account?</strong> Create a
            <strong>Login.gov</strong> or <strong>ID.me</strong> account.
            We'll help you verify your identity for your account now.
          </p>
          <p>
            <strong>Not sure if your account is verified?</strong> Sign in here.
            If you still need to verify your identity, we'll help you do that now.
          </p>
          <p>
            <strong>Note:</strong> You can sign in after you start filling out
            your questionnaire. But you'll lose any information you already filled in.
          </p>
          <p>
            <slot name="SignInButton"></slot>
          </p>
        `;
      } catch (error) {
        // Ignore errors - sign-in alert may not be fully rendered yet
      }
    };

    updateSignInAlertCopy();
  }, []);

  const handleStartQuestionnaire = useCallback(
    () => {
      const data = formData || {};
      const startingPath = route.pageList[0]?.path;
      const startPage = getNextPagePath(route.pageList, data, startingPath);
      router.push(startPage);
    },
    [formData, route.pageList, router],
  );

  const renderSaveInProgressIntro = useCallback(
    buttonOnly => (
      <SaveInProgressIntro
        buttonOnly={buttonOnly}
        prefillEnabled={route.formConfig.prefillEnabled}
        messages={route.formConfig.savedFormMessages}
        pageList={route.pageList}
        startText="Start your questionnaire"
        formConfig={{ customText: { appType: 'questionnaire' } }}
        unauthStartText="Sign in or create an account"
      />
    ),
    [
      route.formConfig.prefillEnabled,
      route.formConfig.savedFormMessages,
      route.pageList,
    ],
  );

  useEffect(
    () => {
      if (rerouteFlag && user?.login?.currentlyLoggedIn) {
        dispatch(fetchClaimantInfo());
      }
    },
    [dispatch, rerouteFlag, user?.login?.currentlyLoggedIn],
  );

  if (!rerouteFlag) {
    return null;
  }

  return (
    <div
      className="schemaform-intro"
      itemScope
      itemType="http://schema.org/HowTo"
    >
      <FormTitle title="Change your education benefits" />
      <va-alert status="info" visible uswds>
        <h3 slot="headline">Update your benefits without VA Form 22-1995</h3>
        <p className="vads-u-margin-y--0">
          If you need to change or update your benefit for a new Certificate of
          Eligibility (COE), you’re in the right place. We’ll help you find the
          right form.
        </p>
      </va-alert>

      <h2 className="vads-u-font-size--h2 vads-u-margin-top--4">
        Determine which form to use
      </h2>
      <p>
        If you need to change or update your benefit for a new Certificate of
        Eligibility, use the questionnaire to determine which form you need.
      </p>

      {rudisillAccessEnabled && (
        <>
          <h4 className="vads-u-margin-top--2 vads-u-margin-bottom--0">
            Rudisill review
          </h4>
          <p className="vads-u-margin-top--0">
            If you need a Rudisill review,{' '}
            <va-link
              href="/education/apply-for-education-benefits/application/1995/introduction?rudisill=true"
              text="you can submit a Rudisill review request through this online form"
            />
            .
          </p>
        </>
      )}

      {user?.login?.currentlyLoggedIn ? (
        <>
          <div className="vads-u-margin-y--4">
            <va-alert status="info" visible uswds>
              <h3 slot="headline">We’ve prefilled some of your information</h3>
              <p className="vads-u-margin-y--0">
                Since you’re signed in, we can prefill part of your
                questionnaire based on your profile details.
              </p>
            </va-alert>
          </div>
          <div className="vads-u-margin-y--4">
            <va-link-action
              href="#start"
              onClick={event => {
                event.preventDefault();
                handleStartQuestionnaire();
              }}
              text="Start your questionnaire"
            />
          </div>
        </>
      ) : (
        <div className="vads-u-margin-y--4">
          {renderSaveInProgressIntro(false)}
        </div>
      )}

      <div className="omb-info--container" style={{ paddingLeft: '0px' }}>
        <va-omb-info
          res-burden={20}
          omb-number="2900-0074"
          exp-date="09/30/2027"
        />
      </div>
    </div>
  );
};

IntroductionPageRedirect.propTypes = {
  route: PropTypes.shape({
    formConfig: PropTypes.shape({
      prefillEnabled: PropTypes.bool,
      savedFormMessages: PropTypes.shape({}),
    }),
    pageList: PropTypes.array,
  }).isRequired,
  router: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default IntroductionPageRedirect;
