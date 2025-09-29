import React from 'react';
import { useSelector } from 'react-redux';

export const MERGED_URL =
  '/family-and-caregiver-benefits/health-and-disability/champva/apply-champva-form-10-10d';
export const STANDALONE_URL =
  '/family-and-caregiver-benefits/health-and-disability/champva/apply-form-10-10d';

export const App = () => {
  const isMergedFormEnabled = useSelector(
    state => state.featureToggles?.form1010dExtended,
  );
  const appUrl = isMergedFormEnabled ? MERGED_URL : STANDALONE_URL;

  const downloadLink = (
    <va-link
      href="/find-forms/about-form-10-10d"
      text="Get VA Form 10-10d to download"
    />
  );

  return (
    <>
      <p>
        You can apply online, by mail, or by fax. Make sure to submit the
        required supporting documents with your application.
      </p>

      <p>
        <va-link
          href="/family-and-caregiver-benefits/health-and-disability/champva/#supporting-documents-for-your-"
          text="Find out what supporting documents you need"
        />
      </p>

      <h3>Option 1: Online</h3>
      <p>You can apply online now.</p>
      <p>
        <va-link-action href={appUrl} text="Apply for CHAMPVA online" />
      </p>

      <h3>Option 2: By mail</h3>
      <p>
        You’ll need to fill out an Application for CHAMPVA Benefits (VA Form
        10-10d).
      </p>
      <p>{downloadLink}</p>
      <p>
        Mail your completed application and supporting documents to this
        address:
      </p>
      <p className="va-address-block">
        VHA Office of Community Care
        <br role="presentation" />
        CHAMPVA Eligibility
        <br role="presentation" />
        PO Box 137
        <br role="presentation" />
        Spring City, PA 19475
      </p>

      <h3>Option 3: By fax</h3>
      <p>
        You’ll need to fill out an Application for CHAMPVA Benefits (VA Form
        10-10d).
      </p>
      <p>{downloadLink}</p>
      <p>
        Fax your completed application and supporting documents to{' '}
        <va-telephone contact="3033317809" />.
      </p>

      <h3>If you’re age 65 or older and you don’t qualify for Medicare</h3>
      <p>
        You’ll need to submit a document called a “notice of disallowance” from
        the Social Security Administration. This document confirms that you
        don’t qualify for Medicare benefits under anyone’s Social Security
        number.
      </p>

      <h3>If you’re the spouse or surviving spouse of a Veteran</h3>
      <p>
        To help us process your application faster, submit a copy of one of
        these optional supporting documents:
      </p>
      <ul>
        <li>
          Marriage certificate, <strong>or</strong>
        </li>
        <li>
          Certificate of civil union, <strong>or</strong>
        </li>
        <li>Common-law marriage affidavit</li>
      </ul>
      <p>
        <strong>
          If you’re a surviving spouse who remarried before age 55 and your
          remarriage has ended,
        </strong>{' '}
        submit a copy of one of these optional supporting documents:
      </p>
      <ul>
        <li>
          Divorce decree, <strong>or</strong>
        </li>
        <li>
          Annulment decree, <strong>or</strong>
        </li>
        <li>Death certificate</li>
      </ul>
      <h3>If you’re a dependent child or applying for a dependent child</h3>
      <p>
        To help us process your application faster, submit a copy of the child’s
        birth certificate. You may need to submit additional supporting
        documents in certain cases.
      </p>

      <p>
        <strong>If the child is adopted,</strong> you’ll need to submit a copy
        of the adoption papers.
      </p>

      <p>
        <strong>If the child is the Veteran sponsor’s stepchild,</strong> you’ll
        need to submit proof of the marriage between the Veteran sponsor and the
        child’s other parent.
      </p>

      <p>
        <strong>
          If the child is between ages 18 to 23 and enrolled in school,
        </strong>{' '}
        you’ll need to submit a school certification letter as proof of
        enrollment. And you’ll need to recertify once a year.
      </p>

      <p>
        <va-link
          href="/resources/getting-care-through-champva#champva-and-school-enrollment-"
          text="Learn how to submit a school certification letter"
        />
      </p>

      <p>
        <strong>
          If the child became permanently unable to support themselves before
          age 18,
        </strong>{' '}
        you can submit a disability rating letter for the child (sometimes
        called a “helpless child” rating) to help us process your application
        faster. Contact your nearest VA regional office and ask how to get this
        rating letter.
      </p>

      <p>
        <va-link
          href="/find-locations/?page=1&facilityType=benefits"
          text="Find a VA regional office near you"
        />
      </p>
    </>
  );
};

export default App;
