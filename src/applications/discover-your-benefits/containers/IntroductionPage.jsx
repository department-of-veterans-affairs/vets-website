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
      <div>
        <p>
          If you’re a Veteran or transitioning service member, answer a few
          questions about your goals and experiences. We’ll help you find
          benefits you may want to apply for.
        </p>
      </div>

      <va-link-action
        href="#"
        onClick={startForm}
        label="Get started"
        text="Get started"
        data-testid="get-started"
      />

      <div>
        <p>
          <b>Note:</b> This tool is not an application for VA benefits and it
          doesn’t confirm your eligibility. On the results page, we’ll help you
          learn more about eligibility and how to apply.
        </p>
        <p>
          If you’re a family member, caregiver, or survivor of a Veteran, you
          may also be eligible for VA benefits.
          <br />
          <va-link
            href="https://www.va.gov/family-and-caregiver-benefits/"
            external
            text="Learn about family and caregiver benefits"
            type="secondary"
            label="Learn about family and caregiver benefits"
          />
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
