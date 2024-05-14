import React from 'react';

import { focusElement } from 'platform/utilities/ui';
import BurialModalContent from 'platform/forms/components/OMBInfoModalContent/BurialModalContent';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import { getAppUrl } from 'platform/utilities/registry-helpers';

class IntroductionPage extends React.Component {
  componentDidMount() {
    focusElement('.va-nav-breadcrumbs-list');
  }

  render() {
    return (
      <div className="schemaform-intro">
        <FormTitle title="Apply for pre-need eligibility determination" />
        <p>
          Equal to VA Form 40-10007 (Application for Pre-Need Determination of
          Eligibility for Burial in a VA National Cemetery).
        </p>
        <SaveInProgressIntro
          headingLevel={2}
          formConfig={this.props.route.formConfig}
          prefillEnabled={this.props.route.formConfig.prefillEnabled}
          messages={this.props.route.formConfig.savedFormMessages}
          pageList={this.props.route.pageList}
          startText="Start the pre-need eligibility application"
        />
        <h2 className="vads-u-font-size--h3">
          Follow these steps to get started
        </h2>
        <div className="process schemaform-process">
          <ol>
            <li className="process-step list-one">
              <h3>Gather your information</h3>
              <h4>Here's what you'll need to apply:</h4>
              <ul>
                <li>
                  Personal information (including Social Security number and
                  date of birth).
                </li>
                <li>
                  Military history or the military history of the Veteran or
                  service member you're connected to.
                </li>
                <li>
                  The name of the VA national cemetery where you’d prefer to be
                  buried.
                  <br />
                  <a
                    href={getAppUrl('facilities')}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Find a VA national cemetery (opens in a new tab)
                  </a>
                </li>
              </ul>
              <h4>
                To help us process your application faster, you can upload:
              </h4>
              <p>
                A copy of your or your sponsor's DD214 or other separation files
              </p>
              <h4>Other information for certain applicants you can provide:</h4>
              <ul>
                <li>
                  <strong>
                    If you're applying as the legally married spouse or
                    surviving spouse of a Veteran or service member
                  </strong>
                  , you'll need your personal details (including Social Security
                  number and date of birth).
                </li>
                <li>
                  <strong>
                    If you're preparing the application on behalf of someone
                    else
                  </strong>
                  , you can upload supporting files or an affidavit showing you
                  can complete the application on their behalf.
                </li>
                <li>
                  <strong>
                    If you're preparing the application for an unmarried adult
                    dependent child of a Veteran or service member
                  </strong>
                  , you can also upload supporting files with details about the
                  adult child's disability.
                </li>
              </ul>
              <h4>What if I need help filling out my application?</h4>
              <p>
                An accredited representative, like a Veterans Service Officer
                (VSO), can help you fill out your application.
                <br />
                <a
                  href="/disability/get-help-filing-claim/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Get help from an accredited representative (opens in a new
                  tab)
                </a>
              </p>
            </li>
            <li className="process-step list-two">
              <h3>Apply</h3>
              <p>
                Complete the pre-need eligibility determination form. After
                submitting the form, you’ll get a confirmation message that you
                can print for your records. This application should take about
                20 minutes.
              </p>

              <div style={{ marginBottom: '-25px' }}>
                <SaveInProgressIntro
                  buttonOnly
                  prefillEnabled={this.props.route.formConfig.prefillEnabled}
                  messages={this.props.route.formConfig.savedFormMessages}
                  pageList={this.props.route.pageList}
                  startText="Start the pre-need eligibility application"
                />
              </div>
            </li>
            <>
              <li className="process-step list-three">
                <h3>After you apply</h3>
                <p>
                  We'll contact you by phone or mail if we need more
                  information. Once we process the application, we'll mail you a
                  letter with our decision.
                </p>
              </li>
            </>
          </ol>
        </div>
        <div className="omb-info--container">
          <va-omb-info
            res-burden={20}
            omb-number="2900-0784"
            exp-date="03/31/2026"
          >
            <BurialModalContent />
          </va-omb-info>
        </div>
      </div>
    );
  }
}

export default IntroductionPage;

export { IntroductionPage };
