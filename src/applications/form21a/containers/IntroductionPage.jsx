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
          title="Form VA21a"
          subtitle="Equal to VA Form VA21A (Form VA21a)"
        />
        <SaveInProgressIntro
          headingLevel={2}
          prefillEnabled={formConfig.prefillEnabled}
          messages={formConfig.savedFormMessages}
          pageList={pageList}
          startText="Start the Application"
        >
          Please complete the VA21A form to apply for accreditation as a claims
          agent or attorney.
        </SaveInProgressIntro>
        <h2 className="vads-u-font-size--h3 vad-u-margin-top--0">
          Follow the steps below to apply for accreditation as a claims agent or
          attorney.
        </h2>
        <va-process-list>
          <li>
            <h3>Apply</h3>
            <p>
              Complete this accreditation as a claims agent or attorney form.
            </p>
            <p>
              After submitting the form, you’ll get a confirmation message. You
              can print this for your records.
            </p>
          </li>
          <li>
            <h3>VA Review</h3>
          </li>
          <li>
            <h3>Decision</h3>
            <p>
              Once we’ve processed your application, you’ll get a notice in the
              mail with our decision.
            </p>
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
        <va-omb-info
          exp-date="3/31/2022"
          omb-number="2900-0605"
          res-burden={45}
        />
      </article>
    );
  }
}

export default IntroductionPage;
