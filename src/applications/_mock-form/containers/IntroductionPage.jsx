import React from 'react';
import PropTypes from 'prop-types';

import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';

import { focusElement } from 'platform/utilities/ui';

class IntroductionPage extends React.Component {
  componentDidMount() {
    focusElement('.va-nav-breadcrumbs-list');
  }

  render() {
    const { route } = this.props;
    const { formConfig, pageList } = route;
    return (
      <article className="schemaform-intro">
        <FormTitle
          title="Mock Form"
          subTitle="Equal to VA Form 00-1234 (Mock Form)"
        />
        <SaveInProgressIntro
          headingLevel={2}
          prefillEnabled
          verifyRequiredPrefill={false}
          messages={formConfig.savedFormMessages}
          pageList={pageList}
          startText="Start the Application"
        >
          Please complete the 00-1234 form to apply for Mock form.
        </SaveInProgressIntro>
        <h2 className="vads-u-font-size--h3 vads-u-margin-top--0">
          What’s a mock form?
        </h2>
        <p>
          This mock form was{' '}
          <a href="https://department-of-veterans-affairs.github.io/veteran-facing-services-tools/forms/form-tutorial-basic">
            built using the form generator
          </a>{' '}
          and includes examples from the intermediate and advanced tutorials.
          Additional examples, not from the tutorial, have also been included.
        </p>
        <p>
          It is meant to show alternative patterns and best practices, and
          should help with onboarding engineers, and be a showcase for
          implementation of newer patterns and workarounds for issues.
        </p>
        <h2 className="vads-u-font-size--h3 vads-u-margin-top--0">
          Follow the steps below to apply for Mock form.
        </h2>
        <va-process-list>
          <va-process-list-item header="Prepare">
            <h4>To fill out this application, you’ll need your:</h4>
            <ul>
              <li>Social Security number (required)</li>
            </ul>
            <p>
              <strong>What if I need help filling out my application?</strong>{' '}
              An accredited representative, like a Veterans Service Officer
              (VSO), can help you fill out your claim.{' '}
              <a href="/disability-benefits/apply/help/index.html">
                Get help filing your claim
              </a>
            </p>
          </va-process-list-item>
          <va-process-list-item header="Apply">
            <p>Complete this Mock form form.</p>
            <p>
              After submitting the form, you’ll get a confirmation message. You
              can print this for your records.
            </p>
          </va-process-list-item>
          <va-process-list-item header="VA Review">
            <p>
              We process claims within a week. If more than a week has passed
              since you submitted your application and you haven’t heard back,
              please don’t apply again. Call us at.
            </p>
          </va-process-list-item>
          <va-process-list-item header="Decision">
            <p>
              Once we’ve processed your claim, you’ll get a notice in the mail
              with our decision.
            </p>
          </va-process-list-item>
        </va-process-list>
        <SaveInProgressIntro
          buttonOnly
          prefillEnabled
          verifyRequiredPrefill={false}
          messages={formConfig.savedFormMessages}
          pageList={pageList}
          startText="Start the Application"
        />
        <p />
        <va-omb-info
          res-burden={10}
          omb-number="0000-0000"
          exp-date="12/31/2022"
        />
      </article>
    );
  }
}

IntroductionPage.propTypes = {
  route: PropTypes.shape({
    formConfig: PropTypes.shape({
      savedFormMessages: PropTypes.shape({}),
    }),
    pageList: PropTypes.array,
  }),
};

export default IntroductionPage;
