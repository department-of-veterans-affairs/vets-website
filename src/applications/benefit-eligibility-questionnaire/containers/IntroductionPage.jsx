import React from 'react';
import PropTypes from 'prop-types';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import formConfig from '../config/form';

const IntroductionPage = ({ router }) => {
  const startForm = event => {
    event.preventDefault();
    router.push('/goals');
  };
  return (
    <article className="schemaform-intro">
      <FormTitle title={formConfig.title} subtitle="" />
      <div role="heading" aria-level="2">
        <p>
          If you’re a Veteran or transitioning service member, answer a few
          questions
          <br />
          about your goals and experiences. We’ll help you find benefits
          <br />
          you may want to apply for.
        </p>
      </div>

      <va-link-action
        href="#"
        onClick={startForm}
        message-aria-describedby="Get started"
        text="Get started"
        data-testid="get-started"
      />

      <div role="heading" aria-level="2">
        <p>
          <b>Note:</b> This tool is not an application for VA benefits. And it
          doesn’t confirm your eligibility. On the results page, we’ll help you
          learn more about eligibility and how to apply.
        </p>
        <p>
          If you’re a family member, caregiver, or survivor of a Veteran,
          <br />
          <va-link
            href="https://www.va.gov/family-and-caregiver-benefits/"
            external
            text="visit this page (opens in a new tab)"
            type="secondary"
            label="visit this page"
          />
          to learn about potential benefits for you.
        </p>
      </div>
    </article>
  );
};

IntroductionPage.propTypes = {
  router: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

export default IntroductionPage;
