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
          href="https://github.com/department-of-veterans-affairs/VA.gov-team-forms/tree/main/Product/Minimal%20header"
        >
          Minimal Header README.md - Designs, decisions, etc...
        </a>
      </li>
    </ul>
    <h2>Code example</h2>
    <ul>
      <li>
        <a
          target="_blank"
          rel="noreferrer"
          href="https://github.com/department-of-veterans-affairs/vets-website/blob/main/src/platform/forms-system/src/js/patterns/minimal-header/README.md"
        >
          Minimal header README.md for developers
        </a>
      </li>
      <li>
        <a
          target="_blank"
          rel="noreferrer"
          href="https://github.com/department-of-veterans-affairs/content-build/blob/main/src/applications/registry.json#L1695-L1699"
        >
          Content build
        </a>
      </li>
      <li>
        <a
          target="_blank"
          rel="noreferrer"
          href="https://github.com/department-of-veterans-affairs/vets-website/blob/main/src/applications/simple-forms/mock-form-minimal-header/config/form.js#L17-L28"
        >
          Form config
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
    </ul>
  </>
);

export const IntroductionPage = () => {
  return (
    <article className="schemaform-intro">
      <FormTitle
        title="Explore pattern demonstrations in our sample form"
        subTitle="Mock Form Minimal Header"
      />
      {childContent}
    </article>
  );
};

export default IntroductionPage;
