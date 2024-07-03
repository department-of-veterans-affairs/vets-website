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
          title="Welcome to the VA - we're glad you're here."
          subtitle="Equal to VA Form NA (Veteran Transition Experience)"
        />
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eu
          sollicitudin dolor. Aenean vitae faucibus metus. Proin placerat sapien
          sed dui faucibus, in fermentum mi molestie. Fusce maximus ex ac leo
          placerat finibus. Integer aliquet congue tellus ac tincidunt. Nunc
          ultricies commodo tempus. Fusce vitae nisl vulputate, sodales ante
          vel, tincidunt lorem. Curabitur pulvinar porttitor odio, aliquam
          viverra lacus dictum nec. Pellentesque quis justo quam. Nullam at
          justo fermentum, dapibus mauris ac, lacinia massa.
        </p>
        <h2 className="vads-u-font-size--h3 vad-u-margin-top--0">
          To get started, tell us a little about yourself.
        </h2>
        <SaveInProgressIntro
          headingLevel={2}
          prefillEnabled={formConfig.prefillEnabled}
          messages={formConfig.savedFormMessages}
          pageList={pageList}
          formConfig={formConfig}
        />
        <p />
      </article>
    );
  }
}

export default IntroductionPage;
