import React from 'react';

import FormTitle from 'platform/forms-system/src/js/components/FormTitle';

const IntroductionPage = () => {
  return (
    <article className="schemaform-intro">
      <FormTitle
        title="Complete the benefit eligibility questionnaire"
        subtitle=""
      />
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
      <va-link-action
        href="/benefit-eligibility-questionnaire/goals"
        message-aria-describedby="Get started"
        text="Get started"
      />
      <p />
    </article>
  );
};

export default IntroductionPage;
