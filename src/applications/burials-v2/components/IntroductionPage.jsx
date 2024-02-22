import React from 'react';
import PropTypes from 'prop-types';

import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import { focusElement } from 'platform/utilities/ui';

class IntroductionPage extends React.Component {
  componentDidMount() {
    focusElement('.va-nav-breadcrumbs-list');
  }

  render() {
    const { route } = this.props;
    return (
      <div className="schemaform-intro">
        <FormTitle
          title="Apply for burial benefits"
          subTitle="VA Form 21P-530EZ"
        />
        <h2 className="vads-u-font-size--h4">
          Follow the steps below to apply for burial benefits.
        </h2>
        <va-process-list>
          <li>
            <h3>Check your eligibility</h3>
            <p>
              Make sure you meet our eligibility requirements before you apply.
              <a
                target="_blank"
                href="/burials-memorials/veterans-burial-allowance/"
              >
                Find out if you're eligible for a Veterans burial allowance
                (opens in new tab)
              </a>
            </p>
          </li>
          <li>
            <h3>Gather your information</h3>
            <h4>You'll need this information about the deceased Veteran:</h4>
            <ul>
              <li>Social Security number or VA file number</li>
              <li>Date and place of birth</li>
              <li>Date and place of death</li>
              <li>Military service history</li>
              <li>Date of burial</li>
              <li>Final resting place</li>
            </ul>
            <p>
              And we'll ask for your personal information. This includes your
              Social Security number, date of birth, mailing address, and
              contact information.
            </p>
            <h4>You'll also need to provide copies of these documents:</h4>
            <ul>
              <li>
                The Veteran's death certificate including the cause of death
              </li>
              <li>
                An itemized receipt for transportation costs (only if you paid
                transportation costs for the Veteran's remains)
              </li>
            </ul>
            <p>
              We also recommend providing a copy of the Veteran's DD214 or other
              separation documents including all their service periods.
            </p>
            <p>
              If you don't have their DD214 or other separation documents, you
              can request these documents now.
              <br />
              <a href="/records/get-military-service-records/" target="_blank">
                Learn more about requesting military service records (opens in
                new tab)
              </a>
            </p>
            <h4>What if I need help with my application?</h4>
            <p>
              An accredited representative, like a Veterans Service Officer
              (VSO), can help you fill out your application.
              <a href="/disability/get-help-filing-claim/" target="_blank">
                Learn more about getting help from an accredited representative
                (opens in new tab)
              </a>
            </p>
          </li>
          <li>
            <h3>Apply</h3>
            <p>
              We'll take you through each step of the process. This application
              should take about 30 minutes.
            </p>
          </li>
          <li>
            <h3>After you apply</h3>
            <p>
              We'll contact you by mail if we need more information. Once we
              process your application, we'll mail you a letter with our
              decision
            </p>
          </li>
        </va-process-list>
        <SaveInProgressIntro
          headingLevel={2}
          prefillEnabled={route.formConfig.prefillEnabled}
          pageList={route.pageList}
          downtime={route.formConfig.downtime}
          startText="Start the Burial Benefits Application"
        />
        <p>
          If you don't want to sign in, you can
          <a href="/find-forms/about-form-21p-530ez/" target="_blank">
            apply using the paper form
          </a>
          . Please expect longer processing time for decisions when opting for
          this method.
        </p>
        <div className="omb-info--container" style={{ paddingLeft: '0px' }}>
          <va-omb-info
            res-burden={30}
            omb-number="2900-0009"
            exp-date="08/31/2025"
          />
        </div>
      </div>
    );
  }
}

IntroductionPage.propTypes = {
  route: PropTypes.shape({
    pageList: PropTypes.array,
    formConfig: PropTypes.shape({
      prefillEnabled: PropTypes.bool,
      downtime: PropTypes.object,
    }),
  }),
  router: PropTypes.object,
};

export default IntroductionPage;
