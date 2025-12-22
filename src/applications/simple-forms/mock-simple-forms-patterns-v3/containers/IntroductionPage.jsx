import React from 'react';
import { Link } from 'react-router';
import FormTitle from '~/platform/forms-system/src/js/components/FormTitle';

const childContent = (
  <>
    <h2>Purpose and usage of sample form</h2>
    <p>
      This form showcases simple patterns in action, highlighting their
      implications on form pages. It is not a starting template for creating
      complete forms, but a visual guide to replicate simple patterns setup and
      page structure
    </p>
    <h2>Form pages links</h2>
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
      <li>
        <Link to="/international-contact">International contact</Link>
      </li>
      <li>
        <Link to="/service-branch">Service branch</Link>
      </li>
      <li>
        <Link to="/upload-file">File upload</Link>
      </li>
      <li>
        <Link to="/supporting-documents">File upload multiple</Link>
      </li>
      <li>
        <Link to="/treatment-records">
          Multiple responses list & loop (required) [Treatment records]
        </Link>
      </li>
      <li>
        <Link to="/employers">
          Multiple responses list & loop (optional) [Employment]
        </Link>
      </li>
    </ul>
    <h2>Form page Figma templates links</h2>
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
      <li>
        <a
          target="_blank"
          rel="noreferrer"
          href="https://www.figma.com/design/afurtw4iqQe6y4gXfNfkkk/VADS-Component-Library?node-id=31366-83&p=f&t=NnDlLac4F9xmwC6o-0"
        >
          International contact
        </a>
      </li>
      <li>
        <a
          target="_blank"
          rel="noreferrer"
          href="https://www.figma.com/design/4A3O3mVx4xDAKfHE7fPF1U/VADS-Templates--Patterns--and-Forms?node-id=2988-28636&p=f&t=6U0yAXfFmWc95Kt9-0"
        >
          Service branch
        </a>
      </li>
      <li>
        <a
          target="_blank"
          rel="noreferrer"
          href="https://www.figma.com/design/4A3O3mVx4xDAKfHE7fPF1U/VADS-Templates--Patterns--and-Forms?node-id=2988-63596&p=f&t=6U0yAXfFmWc95Kt9-0"
        >
          File upload
        </a>
      </li>
      <li>
        <a
          target="_blank"
          rel="noreferrer"
          href="https://www.figma.com/design/4A3O3mVx4xDAKfHE7fPF1U/VADS-Templates--Patterns--and-Forms?node-id=2988-63596&p=f&t=6U0yAXfFmWc95Kt9-0"
        >
          File upload multiple
        </a>
      </li>
      <li>
        <a
          target="_blank"
          rel="noreferrer"
          href="https://www.figma.com/file/4A3O3mVx4xDAKfHE7fPF1U/VADS-Templates%2C-Patterns%2C-and-Forms?type=design&node-id=5751%3A10777&mode=design&t=FYk7L3PJ9a16WGP9-1://www.figma.com/file/4A3O3mVx4xDAKfHE7fPF1U/VADS-Templates%2C-Patterns%2C-and-Forms?type=design&node-id=2988-9602&mode=design&t=G7cHyOgjfgKxCDPo-11"
        >
          Multiple responses list & loop (TBD)
        </a>
      </li>
    </ul>
    <h2>Form page code examples</h2>
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
      <li>
        <a
          target="_blank"
          rel="noreferrer"
          href="https://github.com/department-of-veterans-affairs/vets-website/blob/main/src/applications/simple-forms/mock-simple-forms-patterns-v3/pages/internationalContact.js"
        >
          International Contact
        </a>
      </li>
      <li>
        <a
          target="_blank"
          rel="noreferrer"
          href="https://github.com/department-of-veterans-affairs/vets-website/blob/main/src/applications/simple-forms/mock-simple-forms-patterns-v3/pages/serviceBranch.js"
        >
          Service branch
        </a>
      </li>
      <li>
        <a
          target="_blank"
          rel="noreferrer"
          href="https://github.com/department-of-veterans-affairs/vets-website/blob/main/src/applications/simple-forms/mock-simple-forms-patterns-v3/pages/upload.js"
        >
          File upload
        </a>
      </li>
      <li>
        <a
          target="_blank"
          rel="noreferrer"
          href="https://github.com/department-of-veterans-affairs/vets-website/blob/main/src/applications/simple-forms/mock-simple-forms-patterns-v3/pages/supportingDocuments.js"
        >
          File upload multiple
        </a>
      </li>
      <li>
        <a
          target="_blank"
          rel="noreferrer"
          href="https://github.com/department-of-veterans-affairs/vets-website/blob/main/src/platform/forms-system/src/js/patterns/array-builder/README.md"
        >
          Multiple responses list & loop README.md
        </a>
      </li>
      <li>
        <a
          target="_blank"
          rel="noreferrer"
          href="https://github.com/department-of-veterans-affairs/vets-website/blob/main/src/applications/simple-forms/mock-simple-forms-patterns-v3/pages/treatmentRecords.js"
        >
          Multiple responses list & loop (required) [Treatment records]
        </a>
      </li>
      <li>
        <a
          target="_blank"
          rel="noreferrer"
          href="https://github.com/department-of-veterans-affairs/vets-website/blob/main/src/applications/simple-forms/mock-simple-forms-patterns-v3/pages/employers.js"
        >
          Multiple responses list & loop (optional) [Employment]
        </a>
      </li>
    </ul>
    <h2>Other form patterns</h2>
    <ul>
      <li>
        <a
          target="_blank"
          rel="noreferrer"
          href="https://staging.va.gov/mock-form-minimal-header"
        >
          Mock form minimal header
        </a>
      </li>
      <li>
        <a
          target="_blank"
          rel="noreferrer"
          href="https://staging.va.gov/mock-form-prefill/introduction"
        >
          Mock form prefill
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
