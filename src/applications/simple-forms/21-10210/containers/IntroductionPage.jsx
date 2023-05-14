import React from 'react';

import { focusElement } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
// import SaveInProgressIntro from '../components/SaveInProgressIntro';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';

// TODO: Before launch, refactor platform's original component to replace this copy.
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
          title="Submit a Lay/Witness Statement"
          subTitle="Equal to submitting a Lay/Witness Statement (VA Form 21-10210)"
        />
        <h2>Here’s how to apply online</h2>
        <p>
          Complete this form. After you submit the form, you’ll get a
          confirmation message. You can print this page for your records.
        </p>
        <p>
          A Veteran may submit a Lay/Witness statement on their own.
          Alternatively, a claimant or witness may submit on behalf on a
          Veteran.
        </p>
        <SaveInProgressIntro
          customHeading="Sign in now to save time and save your work in progress"
          headingLevel={2}
          prefillEnabled={formConfig.prefillEnabled}
          messages={formConfig.savedFormMessages}
          pageList={pageList}
          startText="Start the Application"
          unauthStartLinkText="Start your application without signing in - or if you are not a Veteran"
        >
          <p>Please complete the 21-10210 form to apply for claims.</p>
        </SaveInProgressIntro>
        <p />

        <va-omb-info
          res-burden={10}
          omb-number="2900-z"
          exp-date="06/30/2024"
        />
      </article>
    );
  }
}

export default IntroductionPage;
