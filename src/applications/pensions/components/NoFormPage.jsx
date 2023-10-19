import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { apiRequest } from 'platform/utilities/api';
import format from 'date-fns/format';
import getUnixTime from 'date-fns/fromUnixTime';

import { isLoggedIn } from '@department-of-veterans-affairs/platform-user/selectors';
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
  const loggedIn = useSelector(isLoggedIn);

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

  return loggedIn ? (
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
              You can’t apply online right now
            </h2>
            <div>
              <p className="vads-u-margin-y--0">
                We’re updating our online form. Our new online form will be
                available in January 2024. If you want to continue applying
                online then, we’ll transfer your saved information to the new
                form.
              </p>
              <p>
                Or, you can apply now using a PDF form.
                <br />
                <va-link
                  download
                  filetype="PDF"
                  href="https://www.vba.va.gov/pubs/forms/VBA-21P-527EZ-ARE.pdf"
                  pages={8}
                  text="Download VA form 21P-527EZ"
                />
              </p>
              <p>
                <strong>Note:</strong> You can refer to your saved information
                on this page to fill out the PDF form.
              </p>
            </div>
          </va-alert>
          <div>
            <div>
              <h2>Apply by mail</h2>
              <p className="vads-u-margin-bottom--4">
                Mail your completed PDF form to the pension management center:
              </p>
              <p className="va-address-block">
                Department of Veterans Affairs <br />
                Pension Intake Center
                <br />
                PO Box 5365
                <br />
                Janesville, WI 53547-5365
                <br />
              </p>
            </div>
            <va-link
              href="/pension/survivors-pension/"
              text="Learn about how to apply in person, or with the help of a VSO"
            />
            <h2>Your intent to file date</h2>
            <div className="vads-u-background-color--gray-lightest vads-u-padding-y--2 vads-u-padding-x--3">
              <h3 className="vads-u-margin-y--0 vads-u-padding-bottom--0p5 vads-u-border-bottom--2px vads-u-border-color--gray-light vads-u-display--inline">
                {format(
                  getUnixTime(data?.metadata?.createdAt),
                  'MMMM do, yyyy',
                )}
              </h3>
              <p>
                We’ve recorded the potential start date of your benefits (also
                known as your intent to file date) as the date you first saved
                your online application. You have 12 months from this date to
                submit a claim.
              </p>
            </div>
            <article>
              <h2>Saved information</h2>
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
              href="/pension/survivors-pension/"
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
  ) : (
    <div className="row vads-u-margin-bottom--4">
      <h1>Review pension benefits application</h1>
      <p>VA Form 21P-527EZ</p>
      <va-alert close-btn-aria-label="Close notification" status="info" visible>
        <h2 id="track-your-status-on-mobile" slot="headline">
          You don’t have any saved online pension form.
        </h2>
        <p>
          You can apply for VA pension benefits by mail, in person at a VA
          regional office, or with the help of a VSO or other accredited
          representative.
        </p>
        <va-link
          href="/pension/survivors-pension/"
          text="Learn more about how to apply for VA pension benefits"
        />
      </va-alert>
      <h2 className="vads-u-margin-bottom--0 vads-u-padding-bottom--0p5 vads-u-font-size--lg vads-u-border-bottom--2px vads-u-border-color--primary">
        Need help?
      </h2>
      <p>
        Call us at <va-telephone contact="8008271000" />. We’re here Monday
        through Friday, 8:00 a.m to 9:00 p.m ET. If you have hearing loss, call{' '}
        <va-telephone contact="711" tty />.
      </p>
    </div>
  );
};
