import React from 'react';

import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import SaveInProgressIntro from 'platform/forms/save-in-progress/SaveInProgressIntro';

const IntroductionPage = props => {
  const { route } = props;
  const { formConfig, pageList } = route;

  return (
    <article className="schemaform-intro">
      <FormTitle title="Benefit and resource recommendation tool" subtitle="" />
      <p>
        Our recommendation tool can help you find benefits and resources that
        are specific to your goals, needs, and circumstances. This is our first
        version — it’s mostly focused on employment benefits and resources.
        Please check in the future for additional benefits and resources.
        Welcome to VA — we’re glad to have you.
      </p>
      <p>
        We’ll ask you to answer a few quick questions to personalize our
        recommendations.
      </p>
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
};

export default IntroductionPage;
