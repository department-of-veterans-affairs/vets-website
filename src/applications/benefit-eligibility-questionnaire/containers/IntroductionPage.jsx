import React from 'react';
import PropTypes from 'prop-types';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';

const IntroductionPage = ({ router }) => {
  const startForm = event => {
    event.preventDefault();
    router.push('/goals');
  };
  return (
    <article className="schemaform-intro">
      <FormTitle title="Benefit and resource recommendation tool" subtitle="" />
      <p>
        <b>
          Please note that this is a recommendation tool, not an eligibility
          determination tool.
        </b>{' '}
        VA determines your eligibility once you apply for a benefit. You’ll need
        to review the eligibility requirements before applying for VA benefits.
      </p>
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
        href="#"
        onClick={startForm}
        message-aria-describedby="Get started"
        text="Get started"
        data-testid="get-started"
      />
      <p />
    </article>
  );
};

IntroductionPage.propTypes = {
  router: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

export default IntroductionPage;
