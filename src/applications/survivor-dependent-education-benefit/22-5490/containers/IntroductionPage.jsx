import React from 'react';

import { focusElement } from 'platform/utilities/ui';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
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
          title="Apply for VA education benefits"
          subTitle="Form 22-5490 (Dependent's Application for VA Education Benefits)"
        />
        <p>
          <strong>Note:</strong> Note: This application is only for these 2
          education benefits:
        </p>
        <ul>
          <li>Fry Scholarship (Chapter 33)</li>
          <li>
            Survivors’ and Dependents’ Educational Assistance (DEA, Chapter 35)
          </li>
        </ul>
        <SaveInProgressIntro
          headingLevel={2}
          prefillEnabled={formConfig.prefillEnabled}
          messages={formConfig.savedFormMessages}
          pageList={pageList}
          startText="Start the Application"
        >
          Please complete the 22-5490 form to apply for DEPENDENTS&#39;
          APPLICATION FOR VA EDUCATION BENEFITS .
        </SaveInProgressIntro>
        <h2 className="vads-u-font-size--h3 vad-u-margin-top--0">
          Follow these steps to get started
        </h2>
        <va-process-list>
          <li>
            <h3>Check your Eligibility</h3>
            <p>
              Make sure you meet our eligibility requirements before you apply.
            </p>
            <va-additional-info trigger="What are the Fry Scholarship (Chapter 33) eligibility requirements?">
              <p>
                <strong>
                  You may be eligible for Fry Scholarship benefits if you're the
                  child or surviving spouse of:
                </strong>
              </p>
              <ul className="vads-u-margin-bottom--0">
                <li>
                  {' '}
                  A member of the Armed Forces who died in the line of duty
                  while serving on active duty on or after September 11, 2001,{' '}
                  <strong>or</strong>
                </li>
                <li>
                  A member of the Armed Forces who died in the line of duty
                  while not on active duty on or after September 11, 2001,{' '}
                  <strong>or</strong>
                </li>
                <li>
                  A member of the Selected Reserve who died from a
                  service-connected disability on or after September 11, 2001,{' '}
                  <strong>and</strong>
                </li>
                <li>You meet other requirements</li>
              </ul>
            </va-additional-info>

            <va-additional-info trigger="What are the Survivors' and Dependents' Educational Assistance (DEA, Chapter 35)?">
              <p>
                <strong>
                  You may be eligible to get these benefits if both you and the
                  Veteran or service member meet certain eligibility
                  requirements:
                </strong>
              </p>
              <ul className="vads-u-margin-bottom--0">
                <li>
                  {' '}
                  The Veteran or service member is permanently and totally
                  disabled due to a service-connected disability,{' '}
                  <strong>or</strong>
                </li>
                <li>
                  The Veteran or service member died in the line of duty,{' '}
                  <strong>or</strong>
                </li>
                <li>
                  The Veteran or service member died as a result of a
                  service-connected disability, <strong>or</strong>
                </li>
                <li>
                  The Veteran or service member is missing in action or was
                  captured in the line of duty by a hostile force for more than
                  90 days, <strong>or</strong>
                </li>
                <li>
                  The Veteran or service member was forcibly detained (held) or
                  interned in the line of duty by a foreign entity for more than
                  90 days, <strong>or</strong>
                </li>
                <li>
                  The service member is in the hospital or getting outpatient
                  treatment for a service-connected permanent and total
                  disability and is likely to be discharged for the disability,{' '}
                  <strong>and</strong>
                </li>
                <li>You meet other requirements</li>
              </ul>
            </va-additional-info>
          </li>
          <li>
            <h3>Gather your information</h3>
            <h4>Here's what you'll need to apply:</h4>
            <div>
              <ul>
                <li>Knowledge of your military service history</li>
                <li>Your current address and contact information</li>
                <li>Bank account direct deposit information</li>
              </ul>
            </div>
          </li>
          <li>
            <h3>Start your application</h3>
            <p>
              We'll take you through each step of the process. It should take
              about 15 minutes.
            </p>
            <va-additional-info trigger="What happens after I apply?">
              <p>
                <strong>
                  You may be eligible for Fry Scholarship benefits if you're the
                  child or surviving spouse of:
                </strong>
              </p>
              <ul className="vads-u-margin-bottom--0">
                <li>
                  {' '}
                  After you apply, you may get an automatic decision. If we
                  approve your application, you'll be able to download your
                  Certificate of Eligibility (or award letter) right away. If we
                  deny your application, you can download your denial letter.
                  We'll also mail you a copy of your decision letter.
                </li>
                <li>
                  <strong>Note:</strong> In some cases, we may need more time to
                  make a decision. If you don't get an automatic decision right
                  after you apply, you'll receive a decision letter in the mail
                  in about 30 days. And we'll contact you if we need more
                  information.
                </li>
              </ul>
            </va-additional-info>
          </li>
        </va-process-list>
        <SaveInProgressIntro
          buttonOnly
          headingLevel={2}
          prefillEnabled={formConfig.prefillEnabled}
          messages={formConfig.savedFormMessages}
          pageList={pageList}
          startText="Start the Application"
        />
        <p />
        <div className="help-footer-box">
          <h2 className="help-heading">Need help?</h2>
          <div className="help-talk">
            <p className="vads-u-margin-top--0">
              If you need help with your application or have questions about
              enrollment or eligibility, submit a request with{' '}
              <a target="_blank" href="https://ask.va.gov/" rel="noreferrer">
                Ask VA.
              </a>
            </p>
            <p className="vads-u-margin-bottom--0">
              If you have technical difficulties using this online application,
              call our MyVA411 main information line at{' '}
              <va-telephone contact={CONTACTS.VA_411} /> (
              <va-telephone contact={CONTACTS['711']} tty />
              ). We're here 24/7.
            </p>
          </div>
        </div>
      </article>
    );
  }
}

export default IntroductionPage;
