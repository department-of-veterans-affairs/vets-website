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
        <FormTitle title="Order medical supplies" />
        <p>
          Use this form to order hearing aid batteries and accessories and CPAP
          supplies.
        </p>
        <SaveInProgressIntro
          prefillEnabled={formConfig.prefillEnabled}
          messages={formConfig.savedFormMessages}
          pageList={pageList}
          startText="Start a new order"
        >
          <div className="vads-u-background-color--primary-alt-lightest vads-u-padding--2 vads-u-margin-y--2">
            <strong>Note:</strong> Since you're signed in to your account, you
            can save your order in progress and come back later to finish
            filling it out.
          </div>
        </SaveInProgressIntro>
      </article>
    );
  }
}

export default IntroductionPage;
