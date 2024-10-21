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
          Note: This tool is not an application for VA benefits and it doesn’t
          determine your eligibility for benefits.
        </b>{' '}
        After you use this tool, you can learn more about eligibility and how to
        apply.
      </p>
      <p>
        To find VA benefits that may be relevant for you, answer a few questions
        about your goals and experiences.
      </p>
      <p>
        This is our first version. Right now, this tool focuses on education and
        career benefits. We’ll add more types of benefits soon.
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
