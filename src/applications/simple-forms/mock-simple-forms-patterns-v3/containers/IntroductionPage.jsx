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
    <h2>Form Page Figma Templates Links</h2>
    <ul>
      <li>
        <a
          target="_blank"
          rel="noreferrer"
          href="https://www.figma.com/file/4A3O3mVx4xDAKfHE7fPF1U/VADS-Templates%2C-Patterns%2C-and-Forms?type=design&node-id=2988-2763&mode=design&t=G7cHyOgjfgKxCDPo-11"
        >
          Name and Date of Birth
        </a>
      </li>
      <li>
        <a
          target="_blank"
          rel="noreferrer"
          href="https://www.figma.com/file/4A3O3mVx4xDAKfHE7fPF1U/VADS-Templates%2C-Patterns%2C-and-Forms?type=design&node-id=2988-23560&mode=design&t=G7cHyOgjfgKxCDPo-11"
        >
          Identification information
        </a>
      </li>
      <li>
        <a
          target="_blank"
          rel="noreferrer"
          href="https://www.figma.com/file/4A3O3mVx4xDAKfHE7fPF1U/VADS-Templates%2C-Patterns%2C-and-Forms?type=design&node-id=2988-17640&mode=design&t=G7cHyOgjfgKxCDPo-11"
        >
          Relationship to Veteran
        </a>
      </li>
      <li>
        <a
          target="_blank"
          rel="noreferrer"
          href="https://www.figma.com/file/4A3O3mVx4xDAKfHE7fPF1U/VADS-Templates%2C-Patterns%2C-and-Forms?type=design&node-id=2987-36363&mode=design&t=G7cHyOgjfgKxCDPo-11"
        >
          Mailing address
        </a>
      </li>
      <li>
        <a
          target="_blank"
          rel="noreferrer"
          href="https://www.figma.com/file/4A3O3mVx4xDAKfHE7fPF1U/VADS-Templates%2C-Patterns%2C-and-Forms?type=design&node-id=2988-9602&mode=design&t=G7cHyOgjfgKxCDPo-11"
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
