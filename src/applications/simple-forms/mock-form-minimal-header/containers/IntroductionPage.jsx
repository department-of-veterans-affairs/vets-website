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
    <h2>Form pages preview</h2>
    <ul>
      <li>
        <Link to="/name-and-date-of-birth">Name and Date of Birth</Link>
      </li>
      <li>
        <Link to="/example-radio">Example with radio</Link>
      </li>
      <li>Example with multiple responses list & loop (TBD)</li>
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
    <h2>Minimal header associated code examples</h2>
    <ul>
      <li>
        <a
          target="_blank"
          rel="noreferrer"
          href="https://github.com/department-of-veterans-affairs/content-build/blob/main/src/applications/registry.json#L1942-L1959"
        >
          Content build
        </a>
      </li>
      <li>
        <a
          target="_blank"
          rel="noreferrer"
          href="https://github.com/department-of-veterans-affairs/vets-website/blob/main/src/applications/simple-forms/mock-form-minimal-header/config/form.js#L10-L26"
        >
          Form config
        </a>
      </li>
      <li>
        <a
          target="_blank"
          rel="noreferrer"
          href="https://github.com/department-of-veterans-affairs/vets-website/blob/main/src/applications/simple-forms/mock-form-minimal-header/components/breadcrumbs.jsx"
        >
          Breadcrumbs
        </a>
      </li>
      <li>
        <a
          target="_blank"
          rel="noreferrer"
          href="https://github.com/department-of-veterans-affairs/vets-website/blob/main/src/applications/simple-forms/mock-form-minimal-header/pages/nameAndDateOfBirth.js"
        >
          Page - Name and Date of Birth
        </a>
      </li>
      <li>
        <a
          target="_blank"
          rel="noreferrer"
          href="https://github.com/department-of-veterans-affairs/vets-website/blob/main/src/applications/simple-forms/mock-form-minimal-header/pages/exampleRadio.js"
        >
          Page - Example Radio
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
        title="Explore Pattern Demonstrations in Our Sample Form"
        subTitle="Mock form minimal header"
      />
      {childContent}
    </article>
  );
};

export default IntroductionPage;
