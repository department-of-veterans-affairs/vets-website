import React from 'react';
import { Link } from 'react-router';
import { FormTitle } from '@department-of-veterans-affairs/va-forms-system-core';

const childContent = (
  <>
    <h2>Purpose and usage of sample form</h2>
    <p>
      This form showcases simple patterns in action, highlighting their
      implications on form pages. It is not a starting template for creating
      complete forms, but a visual guide to replicate simple patterns setup and
      page structure
    </p>
    <h2>Form Pages Links</h2>
    <ul>
      <li>
        <Link to="/name-and-date-of-birth">Name and Date of Birth</Link>
      </li>
      <li>
        <Link to="/identification-information">Identification information</Link>
      </li>
      <li>
        <Link to="/relationship-to-veteran">Relationship to Veteran</Link>
      </li>
      <li>
        <Link to="/mailing-address">Mailing address</Link>
      </li>
      <li>
        <Link to="/phone-and-email-address">Phone and email address</Link>
      </li>
    </ul>
    <h2>Form Page Sketch Templates Links</h2>
    <ul>
      <li>
        <a
          target="_blank"
          rel="noreferrer"
          href="https://www.sketch.com/s/dc844743-277e-41d4-81ba-a48fd0743952/p/303BA3DA-853A-471B-9A2E-53C72F08368D/canvas"
        >
          Name and Date of Birth
        </a>
      </li>
      <li>
        <a
          target="_blank"
          rel="noreferrer"
          href="https://www.sketch.com/s/dc844743-277e-41d4-81ba-a48fd0743952/p/3CB011B6-F1AD-4B21-BF45-B9FE3B033552/canvas"
        >
          Identification information
        </a>
      </li>
      <li>
        <a
          target="_blank"
          rel="noreferrer"
          href="https://www.sketch.com/s/dc844743-277e-41d4-81ba-a48fd0743952/p/C57A479C-4AB8-4F09-8BD1-F5E659C453F4/canvas"
        >
          Relationship to Veteran
        </a>
      </li>
      <li>
        <a
          target="_blank"
          rel="noreferrer"
          href="https://www.sketch.com/s/dc844743-277e-41d4-81ba-a48fd0743952/p/E1492AFF-DF32-4C70-AAE4-0B6B1F16C2A3/canvas"
        >
          Mailing address
        </a>
      </li>
      <li>
        <a
          target="_blank"
          rel="noreferrer"
          href="https://www.sketch.com/s/dc844743-277e-41d4-81ba-a48fd0743952/p/7F447374-E091-4BA2-90FC-06AE6DF82F92/canvas"
        >
          Phone and email address
        </a>
      </li>
    </ul>
    <h2>Form Page Code Examples</h2>
    <ul>
      <li>
        <a
          target="_blank"
          rel="noreferrer"
          href="https://github.com/department-of-veterans-affairs/vets-website/blob/main/src/applications/simple-forms/mock-simple-forms-patterns-v3/pages/nameAndDateOfBirth.js"
        >
          Name and Date of Birth
        </a>
      </li>
      <li>
        <a
          target="_blank"
          rel="noreferrer"
          href="https://github.com/department-of-veterans-affairs/vets-website/blob/main/src/applications/simple-forms/mock-simple-forms-patterns-v3/pages/identificationInformation.js"
        >
          Identification information
        </a>
      </li>
      <li>
        <a
          target="_blank"
          rel="noreferrer"
          href="https://github.com/department-of-veterans-affairs/vets-website/blob/main/src/applications/simple-forms/mock-simple-forms-patterns-v3/pages/relationshipToVeteran.js"
        >
          Relationship to Veteran
        </a>
      </li>
      <li>
        <a
          target="_blank"
          rel="noreferrer"
          href="https://github.com/department-of-veterans-affairs/vets-website/blob/main/src/applications/simple-forms/mock-simple-forms-patterns-v3/pages/mailingAddress.js"
        >
          Mailing address
        </a>
      </li>
      <li>
        <a
          target="_blank"
          rel="noreferrer"
          href="https://github.com/department-of-veterans-affairs/vets-website/blob/main/src/applications/simple-forms/mock-simple-forms-patterns-v3/pages/phoneAndEmailAddress.js"
        >
          Phone and email address
        </a>
      </li>
    </ul>
  </>
);

export const IntroductionPage = () => {
  return (
    <article className="schemaform-intro">
      <FormTitle title="Explore Pattern Demonstrations in Our Sample Form" />
      {childContent}
    </article>
  );
};

export default IntroductionPage;
