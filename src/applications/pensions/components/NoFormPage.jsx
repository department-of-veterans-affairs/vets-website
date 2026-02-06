import React, { useEffect, useState } from 'react';
import { apiRequest } from 'platform/utilities/api';

import {
  ApplicantInformation,
  MilitaryHistory,
  WorkHistory,
  HouseholdInformation,
  FinancialDisclosure,
  AdditionalInformation,
} from './SectionField';

export const NoFormPage = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const resource = '/in_progress_forms/21P-527EZ';
    setLoading(true);
    apiRequest(resource)
      .then(responseData => {
        setData(responseData);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <va-loading-indicator
        label="Loading"
        message="Loading your application..."
      />
    );
  }

  return (
    <div className="row vads-u-margin-bottom--4">
      <h1>Review pension benefits application</h1>
      <p>VA Form 21P-527EZ</p>
      {data?.metadata?.inProgressFormId ? (
        <>
          <va-alert
            close-btn-aria-label="Close notification"
            status="info"
            visible
          >
            <h2 id="track-your-status-on-mobile" slot="headline">
              You can’t use our online application right now
            </h2>
            <div>
              <p className="vads-u-margin-y--0">
                We’re updating our online application. While we’re working on
                the application, you have these options:
              </p>
              <ul>
                <li>
                  <p>
                    <strong>You can apply now using a PDF form.</strong>{' '}
                    <va-link
                      download
                      filetype="PDF"
                      href="https://www.vba.va.gov/pubs/forms/VBA-21P-527EZ-ARE.pdf"
                      pages={8}
                      text="Download VA form 21P-527EZ"
                    />
                    <br /> You can refer to your saved information on this page
                    when you fill out the PDF form.
                  </p>
                  <va-link
                    href="/pension/how-to-apply"
                    text="Find out how to submit your completed PDF form"
                  />
                </li>
                <li>
                  <p>
                    <strong>
                      You can wait until the updates are complete and apply
                      online.
                    </strong>{' '}
                  </p>
                </li>
              </ul>
              <p>
                <strong>If you’re not ready to apply yet,</strong> you can
                submit an intent to file form. This sets a potential start date
                for your benefits. If you notify us of your intent to file, you
                may be able to get back payments for the time between when you
                submit your intent to file form and when we approve your claim.
              </p>
              <va-link
                text="Find out how to submit an intent to file form"
                href="/pension/how-to-apply/#should-i-submit-an-intent-to-f"
              />
            </div>
          </va-alert>
          <div>
            <article>
              <h2 className="vads-u-margin-bottom--neg3">Saved information</h2>
              <div className="vads-u-padding-x--1">
                <va-on-this-page />
              </div>
              <ApplicantInformation
                title="Applicant information"
                id="applicant-information"
                formData={data?.formData}
              />
              <MilitaryHistory
                title="Military history"
                id="military-history"
                formData={data?.formData}
              />
              <WorkHistory
                title="Work history"
                id="work-history"
                formData={data?.formData}
              />
              <HouseholdInformation
                title="Household information"
                id="household-information"
                formData={data?.formData}
              />
              <FinancialDisclosure
                title="Financial disclosure"
                id="financial-disclosure"
                formData={data?.formData}
              />
              <AdditionalInformation
                title="Additional information"
                id="additional-information"
                formData={data?.formData}
              />
            </article>
            <p>
              <strong>Note:</strong> According to federal law, there are
              criminal penalties for withholding information on purpose or
              providing information that you know is false. Penalties may
              include a fine, imprisonment for up to 5 years, or both.
              (Reference: 18 U.S.C. 1001)
            </p>
            <h2 className="vads-u-margin-bottom--0 vads-u-padding-bottom--0p5 vads-u-font-size--lg vads-u-border-bottom--2px vads-u-border-color--primary">
              Need help?
            </h2>
            <p>
              Call us at <va-telephone contact="8008271000" />. We’re here
              Monday through Friday, 8:00 a.m to 9:00 p.m ET. If you have
              hearing loss, call <va-telephone contact="711" tty />.
            </p>
          </div>
          <va-back-to-top />
        </>
      ) : (
        <>
          <va-alert
            close-btn-aria-label="Close notification"
            status="info"
            visible
          >
            <h2 id="track-your-status-on-mobile" slot="headline">
              You don’t have any saved online pension form.
            </h2>
            <p>
              You can apply for VA pension benefits by mail, in person at a VA
              regional office, or with the help of a VSO or other accredited
              representative.
            </p>
            <va-link
              href="/pension/how-to-apply/"
              text="Learn more about how to apply for VA pension benefits"
            />
          </va-alert>
          <h2 className="vads-u-margin-bottom--0 vads-u-padding-bottom--0p5 vads-u-font-size--lg vads-u-border-bottom--2px vads-u-border-color--primary">
            Need help?
          </h2>
          <p>
            Call us at <va-telephone contact="8008271000" />. We’re here Monday
            through Friday, 8:00 a.m to 9:00 p.m ET. If you have hearing loss,
            call <va-telephone contact="711" tty />.
          </p>
        </>
      )}
    </div>
  );
};
