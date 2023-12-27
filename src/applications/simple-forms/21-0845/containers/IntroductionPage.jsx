/* eslint-disable @department-of-veterans-affairs/prefer-telephone-component */
// <va-telephone /> doesn't display 1-800 numbers correctly
import React from 'react';

import { focusElement } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';

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
          title="Authorize VA to release your information to a third-party source"
          subTitle="Authorization To Disclose Personal Information To a Third Party (VA Form 21-0845)"
        />
        <p>
          Use this form if you want us to release information from your VA
          records with a non-VA (third-party) individual or organization. This
          may include information about your VA claims or benefits.
        </p>
        <h2>What to know before you fill out this form</h2>
        <ul>
          <li>
            If you want to keep some information from your records private, you
            can use this form to authorize us to release only specific
            information.
          </li>
          <li>
            If we’ve determined that you can’t make decisions about VA benefits
            for yourself, then we can’t accept this online form from you. You’ll
            need to have your court-ordered or VA-appointed fiduciary complete
            and sign the PDF version of this form.
          </li>
          <li>
            This form doesn’t give the third-party individual or organization
            permission to manage or change the information in your VA record.
            They can only access the information.
          </li>
          <li>
            You can change your mind and tell us to stop releasing your
            information at any time. We can’t take back any information we may
            have already released based on your authorization.
          </li>
        </ul>
        <h2>How to cancel your authorization</h2>
        <p>
          If you change your mind and don’t want us to release your information,
          you can tell us online through Ask VA.
        </p>
        <p>
          <a href="https://ask.va.gov/">Contact us online through Ask VA</a>
        </p>
        {/* TODO: Use <va-telephone> once DST's fixed the 1-800 display bug: https://github.com/department-of-veterans-affairs/vets-design-system-documentation/issues/1932 */}
        {/* <va-telephone contact="18008271000" /> */}
        <p>
          Or call us at{' '}
          <a href="tel:+18008271000" aria-label="1. 8 0 0. 8 2 7. 1 0 0 0.">
            1-800-827-1000
          </a>{' '}
          (
          <va-telephone tty="true" contact="711">
            TTY:711
          </va-telephone>
          ). We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.
        </p>
        <SaveInProgressIntro
          formConfig={formConfig}
          headingLevel={2}
          alertTitle="Save time and save your work in progress by signing in"
          prefillEnabled={formConfig.prefillEnabled}
          messages={formConfig.savedFormMessages}
          pageList={pageList}
          startText="Start your authorization"
          unauthStartText="Sign in to start your authorization"
          verifiedPrefillAlert={
            <div>
              <div className="usa-alert usa-alert-info schemaform-sip-alert">
                <div className="usa-alert-body">
                  <strong>Note:</strong> Since you’re signed in to your account,
                  you can save your release authorization in progress and come
                  back later to finish filling it out.
                </div>
              </div>
              <br />
            </div>
          }
          hideUnauthedStartLink
          displayNonVeteranMessaging
        >
          Please complete the 21-0845 form to apply for disclosure
          authorization.
        </SaveInProgressIntro>
        <va-omb-info
          res-burden={5}
          omb-number="2900-0736"
          exp-date="02/28/2026"
        />
      </article>
    );
  }
}

export default IntroductionPage;
/* eslint-enable @department-of-veterans-affairs/prefer-telephone-component */
