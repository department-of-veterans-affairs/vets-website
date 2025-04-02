import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { focusElement } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import repStatusLoader from 'platform/user/widgets/representative-status';
import { useStore, connect } from 'react-redux';
import { isLoggedIn } from 'platform/user/selectors';

const IntroductionPage = props => {
  const { route, loggedIn } = props;
  const { formConfig, pageList } = route;
  const store = useStore();

  useEffect(() => {
    focusElement('.va-nav-breadcrumbs-list');
  }, []);

  // search from query params on page load
  useEffect(() => {
    repStatusLoader(store, 'representative-status', 3, false);
  }, []);

  return (
    <article className="schemaform-intro">
      <div className="title-section">
        <FormTitle
          title="Request help from a VA accredited representative or VSO"
          subTitle="VA Form 21-22 and VA Form 21-22a"
        />
        <p>
          A VA accredited representative can help you file a claim or request a
          decision review.
        </p>
        <p>
          Use our online tool to pre-fill your VA Form 21-22 to appoint a
          Veteran Service Organization (VSO). Or, use our online tool to
          pre-fill your VA Form 21-22a to appoint a VA accredited attorney or
          claims agent.
        </p>
        <>
          <div tabIndex="-1">
            <div data-widget-type="representative-status" />
          </div>
        </>
      </div>
      {loggedIn && (
        <>
          <p />
          <SaveInProgressIntro
            alertTitle="Sign in with a verified account to request help from a VA accredited representative"
            formConfig={formConfig}
            headingLevel={2}
            messages={formConfig.savedFormMessages}
            prefillEnabled={formConfig.prefillEnabled}
            pageList={pageList}
            unauthStartText="Sign in or create an account"
            startText="Fill out your form to request help"
          />
        </>
      )}
      <h2>Follow these steps to pre-fill your form</h2>
      <div className="vads-u-padding-left--2">
        <va-process-list uswds>
          <va-process-list-item
            header="Contact the accredited representative"
            level="3"
          >
            <p>
              You’ll need to contact the accredited representative you’d like to
              appoint to ask if they’re available to help you.
            </p>
            <p>
              If you’d like to work with an accredited VSO representative,
              you’ll need to appoint their organization. You should contact them
              to confirm which organization they’re accredited by. You’ll need
              to select this organization on your form.
            </p>
            <va-additional-info trigger="If you don't know who you'd like to appoint">
              <p>
                You can use our search tool to find an accredited
                representative.
              </p>
              <p />
              <a
                href="/get-help-from-accredited-representative/find-rep"
                target="_blank"
              >
                Find an accredited representative or VSO
              </a>
            </va-additional-info>
          </va-process-list-item>
          <va-process-list-item header="Gather your information" level="3">
            <p>Here’s what you’ll need to complete this form:</p>
            <ul>
              <li>Your Social Security number or VA file number</li>
              <li>Your date of birth</li>
              <li>Your mailing address and phone number</li>
              <li>
                Your branch of service (only if you’d like to appoint an
                attorney or claims agent)
              </li>
              <li>
                The name of the organization you’d like to appoint, if you’d
                like to work with an accredited VSO representative
              </li>
            </ul>
            <p>
              If you’re a dependent or surviving spouse, we’ll ask you for some
              personal information about the Veteran or service member you’re
              connected to.
            </p>
          </va-process-list-item>
          <va-process-list-item header="Start your form" level="3">
            <p>
              We’ll take you through each step of our online tool. It should
              take about 5 minutes.
            </p>
            <p>
              After you complete your form, you’ll need to download, print, and
              sign it. Then mail or bring your form to the accredited
              representative you’re appointing. The accredited representative
              will sign your form and submit it for you.
            </p>
          </va-process-list-item>
        </va-process-list>
      </div>
      <SaveInProgressIntro
        alertTitle="Sign in with a verified account to request help from a VA accredited representative"
        formConfig={formConfig}
        headingLevel={2}
        messages={formConfig.savedFormMessages}
        prefillEnabled={formConfig.prefillEnabled}
        pageList={pageList}
        unauthStartText="Sign in or create an account"
        startText="Fill out your form to request help"
        verifiedPrefillAlert={<></>}
      />
      <p />
      <va-omb-info
        exp-date="07/31/2026"
        omb-number="2900-0321"
        res-burden="5"
      />
      <p />
    </article>
  );
};

IntroductionPage.propTypes = {
  route: PropTypes.shape({
    formConfig: PropTypes.shape({
      prefillEnabled: PropTypes.bool,
      savedFormMessages: PropTypes.object,
      customText: PropTypes.shape({
        appType: PropTypes.string,
      }),
    }),
    loggedIn: PropTypes.bool,
    pageList: PropTypes.array,
  }),
};

function mapStateToProps(state) {
  return {
    loggedIn: isLoggedIn(state),
  };
}

// named export for testing
export { IntroductionPage };

export default connect(mapStateToProps)(IntroductionPage);
