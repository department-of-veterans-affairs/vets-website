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
          title="Authorize the release of medical information to the VA"
          subTitle="Authorization to disclose information to the Department of Veterans Affairs (VA) (VA Form 21-4142 and 21-4142a)"
        />
        <h2>Here&rsquo;s how to apply online</h2>
        <p>
          Complete this form. After you submit the form, you&rsquo;ll get a
          confirmation message. You can print this page for your records.
        </p>
        <SaveInProgressIntro
          headingLevel={2}
          prefillEnabled={formConfig.prefillEnabled}
          messages={formConfig.savedFormMessages}
          pageList={pageList}
          startText="Start the medical release authorization"
        >
          Please complete the 21-4142 form to apply for authorize release of
          medical information.
        </SaveInProgressIntro>

        <p />
        <va-omb-info
          res-burden="10"
          omb-number="2900-0858"
          exp-date="07/31/2024"
        />
      </article>
    );
  }
}

export default IntroductionPage;
