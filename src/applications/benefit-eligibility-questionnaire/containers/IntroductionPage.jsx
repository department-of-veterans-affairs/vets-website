import React from 'react';
import PropTypes from 'prop-types';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import formConfig from '../config/form';
import { Heading } from '../components/Heading';

const IntroductionPage = ({ router }) => {
  const startForm = event => {
    event.preventDefault();
    router.push('/goals');
  };
  return (
    <article className="schemaform-intro">
      <FormTitle title={formConfig.title} subtitle="" />
      <Heading />
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
            text="visit this page"
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
