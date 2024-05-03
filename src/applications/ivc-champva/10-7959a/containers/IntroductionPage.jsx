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
          title="10-7959a CHAMPVA Claim Form"
          subtitle="Equal to VA Form 10-7959A (10-7959a CHAMPVA Claim Form)"
        />
        <SaveInProgressIntro
          headingLevel={2}
          prefillEnabled={formConfig.prefillEnabled}
          messages={formConfig.savedFormMessages}
          pageList={pageList}
          startText="Start the Application"
        >
          Please complete the 10-7959A form to apply for CHAMPVA claim form.
        </SaveInProgressIntro>
        <h2 className="vads-u-font-size--h3 vad-u-margin-top--0">
          Follow the steps to get started
        </h2>
        <va-process-list uswds>
          <va-process-list-item header="Gather this information">
            <p>
              <b>Here’s what you’ll need to apply:</b>
              Make sure you meet our eligibility requirements before you apply
            </p>
            <ul>
              <li>
                <b>Personal information about you</b> and anyone else you’re
                applying for
              </li>
            </ul>
            <p>
              You may also need to submit supporting documents, like copies of
              your Medicare or other health insurance cards
            </p>
          </va-process-list-item>
          <va-process-list-item header="Apply">
            <p>
              We’ll take you through each step of the process. This application
              should take about [XX] minutes.
            </p>
          </va-process-list-item>
          <va-process-list-item header="After you apply">
            <p>
              We’ll contact you if we have questions or need more information.
            </p>
          </va-process-list-item>
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
        <va-omb-info
          res-burden={10}
          omb-number="2900-0219"
          exp-date="10/31/2024"
        />
      </article>
    );
  }
}

export default IntroductionPage;
