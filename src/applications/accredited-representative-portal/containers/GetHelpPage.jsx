import React, { useEffect } from 'react';
import { VaBreadcrumbs } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from 'platform/utilities/ui';
import { HELP_BC_LABEL, HelpBC } from '../utilities/poaRequests';

const GetHelpPage = title => {
  useEffect(() => {
    focusElement('h1');
    document.title = title.title;
  }, [title]);

  return (
    <section className="help">
      <VaBreadcrumbs
        breadcrumbList={HelpBC}
        label={HELP_BC_LABEL}
        homeVeteransAffairs={false}
      />
      <h1 data-testid="get-help-page-heading">Get help using the portal</h1>
      <h2>Email the portal team</h2>
      <p>
        You can email the portal team for help at
        RepresentativePortalHelp@va.gov. We monitor the email Monday through
        Friday from 8am to 4pm ET. Someone from the team will respond to your
        email within 1-2 business days.
      </p>
      <va-link
        data-testid="get-help-page-link"
        href="mailto:RepresentativePortalHelp@va.gov"
        text="Email the portal team at RepresentativePortalHelp@va.gov"
      />

      <h2 data-testid="download-instructions-heading">
        Download instructions for submitting VA Form 21-22 online
      </h2>

      <p>
        You can accept power of attorney (POA) requests in the portal as long as
        the claimant submits the request using the online{' '}
        <va-link
          href="https://www.va.gov/get-help-from-accredited-representative/appoint-rep/introduction/"
          text="VA Form 21-22 (on
        VA.gov)"
        />
        . Download detailed, step by step instructions on how to submit the
        request online.
      </p>
      <a
        data-testid="download-instructions-pdf-link"
        href="/files/How to submit VA Form 21-22 online_updated March 2025.pdf"
        download
      >
        <va-icon
          icon="file_download"
          size={1}
          tabIndex={-1}
          aria-hidden="true"
        />
        Download How to submit VA Form 21-22 online (PDF, 17 pages)
      </a>
    </section>
  );
};

export default GetHelpPage;
