import React from 'react';

import { focusElement } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';
import { unauthStartText } from '../../constants/labels';

class IntroductionPage extends React.Component {
  componentDidMount() {
    focusElement('.va-nav-breadcrumbs-list');
  }

  render() {
    return (
      <div className="schemaform-intro">
        <FormTitle title="Contact Us" />
        <p>Equal to VA Form 0873 (Ask a Question).</p>
        <SaveInProgressIntro
          prefillEnabled={this.props.route.formConfig.prefillEnabled}
          messages={this.props.route.formConfig.savedFormMessages}
          pageList={this.props.route.pageList}
          formConfig={{
            customText: this.props.route.formConfig.customText,
          }}
          unauthStartText={unauthStartText}
        >
          Please complete the 0873 form to send a message.
        </SaveInProgressIntro>
        <div className="omb-info--container" style={{ paddingLeft: '0px' }}>
          <va-omb-info
            res-burden={10}
            omb-number="2900-0619"
            exp-date="11/30/2019"
          />
        </div>
      </div>
    );
  }
}

export default IntroductionPage;
