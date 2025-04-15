import React from 'react';
import { Link } from 'react-router';
import FormTitle from '~/platform/forms-system/src/js/components/FormTitle';

const childContent = (
  <>
    <p>
      This form showcases minimal header in action. It is not a starting
      template for creating a form, but a visual guide with code and design
      references.
    </p>
    <va-alert
      close-btn-aria-label="Close notification"
      status="warning"
      visible
    >
      <h2 slot="headline">Use with caution: Candidate</h2>
      <>
        <p className="vads-u-margin-y--0">
          This pattern is still undergoing research and validation. Best
          practices and user experience assumptions are not yet fully
          established.
        </p>
      </>
    </va-alert>
    <h2>Form pages preview</h2>
    <ul>
      <li>
        <Link to="/name-and-date-of-birth">Name and Date of Birth</Link>
      </li>
      <li>
        <Link to="/example-radio">Example with radio</Link>
      </li>
      <li>
        <Link to="/employers-summary">
          Example with multiple responses list & loop
        </Link>
      </li>
    </ul>
    <h2>Reference links</h2>
    <ul>
      <li>
        <a
          target="_blank"
          rel="noreferrer"
          href="https://github.com/department-of-veterans-affairs/vets-website/blob/main/src/platform/forms-system/src/js/patterns/minimal-header/README.md"
        >
          For developers - README.md and how to implement
        </a>
      </li>
      <li>
        <a
          target="_blank"
          rel="noreferrer"
          href="https://design.va.gov/templates/forms/form-step-minimal"
        >
          Design guidance for using Form Step - Minimal template
        </a>
      </li>
      <li>
        <a
          target="_blank"
          rel="noreferrer"
          href="https://www.figma.com/design/WzqnYSC2B42aFaSCu7L3Dk/Minimal-Form-Flow-Template?node-id=2-13012&p=f&t=Ird6yObA057l9RHY-11"
        >
          Design guidance for migrating existing forms to use the new minimal
          form flow
        </a>
      </li>
      <li>
        <a
          target="_blank"
          rel="noreferrer"
          href="https://github.com/department-of-veterans-affairs/VA.gov-team-forms/tree/main/Product/Minimal%20header"
        >
          Design decisions - About the Minimal Header
        </a>
      </li>
    </ul>
    <h2>Other form patterns</h2>
    <ul>
      <li>
        <a
          target="_blank"
          rel="noreferrer"
          href="https://staging.va.gov/mock-form-patterns"
        >
          Mock form patterns
        </a>
      </li>
      <li>
        <a
          target="_blank"
          rel="noreferrer"
          href="https://staging.va.gov/mock-simple-forms-patterns"
        >
          Mock form patterns sandbox
        </a>
      </li>
    </ul>
  </>
);

export const IntroductionPage = () => {
  return (
    <article className="schemaform-intro">
      <FormTitle
        title="Explore pattern demonstrations in our sample form"
        subTitle="Mock Form Minimal Form Flow"
      />
      {childContent}
    </article>
  );
};

export default IntroductionPage;
