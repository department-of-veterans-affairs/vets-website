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
import { selectMeb1995Reroute } from '../selectors/featureToggles';

export const IntroductionPageRedirect = ({ route, router }) => {
  const dispatch = useDispatch();
  const rerouteFlag = useSelector(selectMeb1995Reroute);
  const { user, formData } = useSelector(state => getIntroState(state));

  useEffect(() => {
    focusElement('.va-nav-breadcrumbs-list');
    const signInAlert = document.querySelector('va-alert-sign-in');
    if (!signInAlert) return;

    const updateSignInAlertCopy = async () => {
      const alertContent = await querySelectorWithShadowRoot(
        '.va-alert-sign-in__body',
        'va-alert-sign-in',
      );

      if (!alertContent) return;
      alertContent.innerHTML = `
        <h2 class="headline">Sign in with a verified account</h2>
        <p>
          Here’s how signing in with an identity-verified account helps you:
        </p>
        <ul>
          <li>
            We can fill in some of your information for you to save you time.
          </li>
        </ul>
        <p>
          <strong>Don’t yet have a verified account?</strong> Create a
          <strong>Login.gov</strong> or <strong>ID.me</strong> account.
          We’ll help you verify your identity for your account now.
        </p>
        <p>
          <strong>Not sure if your account is verified?</strong> Sign in here.
          If you still need to verify your identity, we’ll help you do that now.
        </p>
        <p>
          <strong>Note:</strong> You can sign in after you start filling out
          your questionnaire. But you’ll lose any information you already filled in.
        </p>
        <p>
          <slot name="SignInButton"></slot>
        </p>
      `;
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
      if (rerouteFlag) {
        dispatch(fetchClaimantInfo());
      }
    },
    [dispatch, rerouteFlag],
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
        <h3 slot="headline">VA Form 22-1995 is being phased out</h3>
        <p className="vads-u-margin-y--0">
          If you need to make updates to your benefit or program or get an
          updated Certificate of Eligibility (COE), you’re still in the right
          place. We’ll help you find the right information.
        </p>
      </va-alert>

      <h2 className="vads-u-font-size--h2 vads-u-margin-top--4">
        Get updated information if you have the Post 9/11 GI Bill benefit
      </h2>
      <p>
        If your current benefit is the Post 9/11 GI Bill (Chapter 33), you can
        use your Statement of Benefits to:
      </p>
      <ul>
        <li>Get an updated Certificate of Eligibility (COE)</li>
        <li>Get more information about your updated entitlement</li>
      </ul>
      <va-link
        href="https://www.va.gov/education/check-remaining-post-9-11-gi-bill-benefits/"
        text="Access your Statement of Benefits online"
      />

      <h2 className="vads-u-font-size--h2 vads-u-margin-top--4">
        Change or update your personal information
      </h2>
      <p>
        You can update your personal information online. This includes your bank
        account for direct deposit, mailing address, and contact information.{' '}
        <va-link
          external
          href="https://ask.va.gov/"
          text="Submit your request with Ask VA."
        />
      </p>

      <h2 className="vads-u-font-size--h2 vads-u-margin-top--4">
        Change or switch your benefit or program
      </h2>
      <p>
        If you’re looking to make changes or switch your benefit or program, you
        can apply using one of our existing education forms. Use the
        questionnaire to determine which form you need.
      </p>

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
