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
        Fax your completed application and supporting documents to 303-331-7809.
      </p>
    </>
  );
};

export default App;
