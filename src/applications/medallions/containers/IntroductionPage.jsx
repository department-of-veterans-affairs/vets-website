import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { focusElement } from 'platform/utilities/ui/focus';
import { scrollToTop } from 'platform/utilities/scroll';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import { useSelector } from 'react-redux';
import { Link } from 'react-router';
import { isLoggedIn } from 'platform/user/selectors';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import SaveInProgressIntro from './SaveInProgressIntro';
import SaveInProgressIntroLink from './SaveInProgressIntroLink';
import { TITLE, SUBTITLE } from '../constants';

const OMB_RES_BURDEN = 15;
const OMB_NUMBER = '2900-0222';
const OMB_EXP_DATE = '09/30/2027';

const ProcessList = () => {
  return (
    <>
      <h2 className="vads-u-font-size--h3 vad-u-margin-top--0">
        Follow these steps to get started
      </h2>
      <va-process-list>
        <va-process-list-item header="Check the Veteran’s eligibility">
          <p>
            Check our eligibility requirements before you apply. If you think
            the Veteran may be eligible, but you’re not sure, we encourage you
            to apply.
          </p>
          <p>
            <a href="https://www.va.gov/burials-memorials/memorial-items/headstones-markers-medallions/#eligibility">
              Find out if the Veteran is eligible for a medallion
            </a>
          </p>
        </va-process-list-item>
        <va-process-list-item header="Contact the Veteran’s cemetery">
          <p>
            Contact the Veteran’s cemetery and tell them that you’re applying
            for a medallion to put on a Veteran’s headstone or marker.
          </p>
          <p>You’ll need to get this information from them:</p>
          <ul>
            <li>The name of a representative from the Veteran’s cemetery</li>
            <li>The representative’s email address</li>
          </ul>
          <p>
            Also check if the cemetery will accept the size of medallion you
            request.
          </p>
          <p>
            After you get this information, tell the representative to expect an
            email from VA about your application. And to review and sign your
            application within 30 days.
          </p>
        </va-process-list-item>
        <va-process-list-item header="Gather the Veteran’s information">
          <p>Here’s what you’ll need to apply:</p>
          <ul>
            <li>The Veteran’s Social Security number</li>
            <li>The Veteran’s date and place of birth</li>
            <li>The Veteran’s date of death</li>
            <li>The Veteran’s service periods</li>
            <li>
              The contact information and mailing address for a representative
              from the Veteran’s cemetery
            </li>
          </ul>
          <p>
            <a href="https://www.cem.va.gov/CEM/hmm/discharge_documents.asp">
              Find out what supporting documents you’ll need to submit
            </a>
          </p>
        </va-process-list-item>
        <va-process-list-item header="Start your application">
          <p>
            We’ll take you through each step of the process. It should take
            about 15 minutes.
          </p>
          <va-additional-info trigger="What happens after you apply">
            <p>
              We’ll ask the representative from the Veteran’s cemetery to review
              and sign your application. After the representative reviews and
              signs your application, we’ll review it next. Then, we’ll send you
              a letter in the mail with our decision.
            </p>
          </va-additional-info>
        </va-process-list-item>
      </va-process-list>
    </>
  );
};

export const IntroductionPage = props => {
  const storeData = useSelector(reduxState => reduxState);
  const userLoggedIn = isLoggedIn(storeData);

  const { route } = props;
  const { formConfig, pageList } = route;

  useEffect(() => {
    scrollToTop();
    focusElement('h1');
  }, []);

  const onSignInButtonClick = () => {
    const redirectLocation = `${formConfig.rootUrl}${formConfig.urlPrefix}introduction?next=loginModal&oauth=true`;

    window.location = redirectLocation;
  };

  return (
    <article className="schemaform-intro">
      <FormTitle title={TITLE} subTitle={SUBTITLE} />
      <p>
        Use this form to get a medallion to put on a deceased Veteran’s
        headstone or marker.
      </p>
      {!userLoggedIn ? (
        <>
          <ProcessList />
          <va-alert
            status="info"
            class="vads-u-margin-y--4"
            data-testid="ezr-login-alert"
            uswds
          >
            <h3 slot="headline">Sign in with a verified account</h3>

            <p>
              Here’s how signing in with an identity-verified account helps you:
            </p>

            <ul>
              <li>
                We can fill in some of your information for you to save you
                time.
              </li>
              <li>
                You can save your work in progress. You’ll have 60 days from
                when you start or make changes to submit your form.
              </li>
            </ul>

            <p>
              <strong>Don’t yet have a verified account?</strong> Create an{' '}
              <strong>ID.me</strong> or <strong>Login.gov</strong> account.
              We’ll help you verify your identity for your account now.
            </p>

            <p>
              <strong>Not sure if your account is verified?</strong> Sign in
              here. If you still need to verify your identity, we’ll help you do
              that now.
            </p>

            <p>
              <strong>Note:</strong> You can sign in after you start filling out
              your form. But you’ll lose any information you already filled in.
            </p>

            <VaButton
              onClick={onSignInButtonClick}
              text="Sign in to start your application"
            />

            <p>
              <Link
                to="/applicant-name?loggedIn=false"
                className="schemaform-start-button"
              >
                Start your form without signing in
              </Link>
            </p>
          </va-alert>
        </>
      ) : (
        <>
          <SaveInProgressIntro
            headingLevel={2}
            prefillEnabled={formConfig.prefillEnabled}
            messages={formConfig.savedFormMessages}
            pageList={pageList}
            startText="Start your medallion application"
            devOnly={{
              forceShowFormControls: true,
            }}
          />
          <ProcessList />
          <SaveInProgressIntroLink
            headingLevel={2}
            prefillEnabled={formConfig.prefillEnabled}
            messages={formConfig.savedFormMessages}
            pageList={pageList}
            startText="Start your medallion application"
            devOnly={{
              forceShowFormControls: true,
            }}
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
    }).isRequired,
    pageList: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
  location: PropTypes.shape({
    basename: PropTypes.string,
  }),
};

export default IntroductionPage;
