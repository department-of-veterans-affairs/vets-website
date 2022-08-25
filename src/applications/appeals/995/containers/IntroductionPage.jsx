import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

import { focusElement } from 'platform/utilities/ui';
import OMBInfo from '@department-of-veterans-affairs/component-library/OMBInfo';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';

class IntroductionPage extends React.Component {
  componentDidMount() {
    focusElement('.va-nav-breadcrumbs-list');
  }

  render() {
    const { route } = this.props;
    const { formConfig, pageList } = route;
    const { formId, prefillEnabled, savedFormMessages } = formConfig;

    const saveInProgressProps = {
      formId,
      pageList,
      prefillEnabled,
      headingLevel: 2,
      messages: savedFormMessages,
      startText: 'Start the Request for Supplemental Claim',
      gaStartEventName: 'decision-reviews-va20-0996-start-form',
      ariaDescribedby: 'main-content',
      testActionLink: true,
      hideUnauthedStartLink: true,
    };

    return (
      <div className="schemaform-intro">
        <FormTitle
          title="Request a Supplemental Claim"
          subTitle="Equal to VA Form 20-0995 (Request a Supplemental Claim)"
        />
        <SaveInProgressIntro {...saveInProgressProps}>
          Please complete the 20-0995 form to apply for VA Form 20-0995
          (Supplemental Claim).
        </SaveInProgressIntro>
        <h2 className="vads-u-font-size--h3 vad-u-margin-top--0">
          Follow the steps below to apply for VA Form 20-0995 (Supplemental
          Claim).
        </h2>
        <p className="vads-u-margin-top--2">
          If you don’t think this is the right form for you,{' '}
          <Link to="/start">go back and answer questions again</Link>.
        </p>
        <va-process-list>
          <li>
            <h3>Prepare</h3>
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
          </li>
          <li>
            <h3>Apply</h3>
            <p>Complete this VA Form 20-0995 (Supplemental Claim) form.</p>
            <p>
              After submitting the form, you’ll get a confirmation message. You
              can print this for your records.
            </p>
          </li>
          <li>
            <h3>VA Review</h3>
            <p>
              We process claims within a week. If more than a week has passed
              since you submitted your application and you haven’t heard back,
              please don’t apply again. Call us at.
            </p>
          </li>
          <li>
            <h3>Decision</h3>
            <p>
              Once we’ve processed your claim, you’ll get a notice in the mail
              with our decision.
            </p>
          </li>
        </va-process-list>
        <SaveInProgressIntro {...saveInProgressProps} buttonOnly />
        <p />
        <OMBInfo resBurden={15} ombNumber="2900-0862" expDate="4/30/2024" />
      </div>
    );
  }
}

IntroductionPage.propTypes = {
  route: PropTypes.shape({
    formConfig: PropTypes.shape({
      formId: PropTypes.string,
      prefillEnabled: PropTypes.bool,
      savedFormMessages: PropTypes.shape({}),
    }),
    pageList: PropTypes.array,
  }),
};

export default IntroductionPage;
