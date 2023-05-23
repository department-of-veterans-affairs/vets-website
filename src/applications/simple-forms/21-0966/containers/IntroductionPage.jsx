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
          title="Notify the VA of your intent to file a claim"
          subtitle="Intent to file a claim for compensation and/or pension, or survivors pension and/or DIC (VA Form 21-0966)"
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
          startText="Start the intent to file"
        >
          Please complete the 21-0966 form to apply for benefits claims.
        </SaveInProgressIntro>

        <p />
        <va-omb-info
          res-burden="5"
          omb-number="2900-0858"
          exp-date="07/31/2024"
        />
      </article>
    );
  }
}

export default IntroductionPage;
