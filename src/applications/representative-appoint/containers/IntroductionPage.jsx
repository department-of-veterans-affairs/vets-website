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
    repStatusLoader(store, 'representative-status', 2, false);
  }, []);

  return (
    <article className="schemaform-intro">
      <div className="title-section">
        <FormTitle title="Form title" subTitle="Form subtitle" />
        <p>blah blah</p>
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
          <va-process-list-item header="Example header" level="3">
            <p>blah blah</p>
            <p>blah blah blah blah blah</p>
          </va-process-list-item>
          <va-process-list-item header="Gather your information" level="3">
            <p>Here’s what you’ll need to complete this form:</p>
            <ul>
              <li>blah</li>
              <li>blach</li>
            </ul>
          </va-process-list-item>
          <va-process-list-item header="Start your form" level="3">
            <p>
              We’ll take you through each step of our online tool. It should
              take about 5 minutes.
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
