import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { apiRequest } from 'platform/utilities/api';

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
  const [loading, setLoading] = useState(true);
  const loggedIn = useSelector(isLoggedIn);

  useEffect(() => {
    const resource = '/in_progress_forms/21P-527EZ';

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

  const { formData } = data;

  return loggedIn ? (
    <div className="row vads-u-margin-bottom--4">
      <h1>Review Pension Benefits Application</h1>
      <p>VA Form 21P-527EZ</p>
      {data?.metadata?.inProgressFormId ? (
        <>
          <va-alert
            close-btn-aria-label="Close notification"
            status="info"
            visible
          >
            <h2 id="track-your-status-on-mobile" slot="headline">
              This online form isn’t working right now
            </h2>
            <div>
              <p className="vads-u-margin-y--0">
                You can still refer to the information here to apply by mail.
              </p>
            </div>
            <br />
            <va-link
              href="https://www.va.gov/burials-memorials/veterans-burial-allowance/"
              text="Learn more about how to apply for VA pension benefits"
            />
          </va-alert>
          <h3>Apply by mail</h3>
          <p>
            Fill out an Application for Veterans Pension (VA Form 21P-527EZ).
          </p>
          <div>
            <va-link
              download
              filetype="PDF"
              href="https://www.vba.va.gov/pubs/forms/VBA-21P-530EZ-ARE.pdf"
              pages={8}
              text="Download VA form 21P-527EZ"
            />
            <p>
              We’ve captured your intent to file date of
              <strong>XX/XX/XXXX</strong>. You have 12 months from that date to
              submit a claim.
            </p>
            <p className="vads-u-margin-bottom--4">
              Mail your pension form to the pension management center:
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
            <article>
              <va-on-this-page />
              <ApplicantInformation
                title="Applicant information"
                id="applicant-information"
                formData={formData}
              />
              <MilitaryHistory
                title="Military history"
                id="military-history"
                formData={formData}
              />
              <WorkHistory
                title="Work history"
                id="work-history"
                formData={formData}
              />
              <HouseholdInformation
                title="Household information"
                id="household-information"
                formData={formData}
              />
              <FinancialDisclosure
                title="Financial disclosure"
                id="financial-disclosure"
                formData={formData}
              />
              <AdditionalInformation
                title="Additional information"
                id="additional-information"
                formData={formData}
              />
            </article>
            <p>
              <strong>Note:</strong> According to federal law, there are
              criminal penalties for withholding information on purpose or
              providing information that you know is false. Penalties may
              include a fine, imprisonment for up to 5 years, or both.
              (Reference: 18 U.S.C. 1001)
            </p>
            <va-alert
              background-only
              class="vads-u-margin-bottom--1"
              close-btn-aria-label="Close notification"
              disable-analytics="false"
              full-width="false"
              status="info"
              visible="true"
            >
              <p className="vads-u-margin-y--0">
                <strong>
                  Veterans Pension (VA Form 21P-527EZ) can not be currently
                  completed online.
                </strong>
                <br />
                We have saved your application so you can use it as a reference.
                You will need to fill out a new form to apply by mail.
              </p>
            </va-alert>
            <h2 className="vads-u-margin-bottom--0p5 vads-u-font-size--lg">
              Need help?
            </h2>
            <hr className="vads-u-border-color--primary vads-u-margin-y--0 vads-u-border-bottom--2px" />
            <p>
              Call us at <va-link href="tel:800-827-1000" text="800-827-1000" />
              . We’re here Monday through Friday, 8:00 a.m to 9:00 p.m ET. If
              you have hearing loss, call TTY:{' '}
              <va-link href="tel:711" text="711" />.
            </p>
          </div>
        </>
      ) : (
        <>
          <va-alert
            close-btn-aria-label="Close notification"
            status="info"
            visible
          >
            <h2 id="track-your-status-on-mobile" slot="headline">
              You don’t have any saved online burial forms.
            </h2>
            <div>
              <p className="vads-u-margin-y--0">
                You can apply for VA burial benefits by mail, in person at a VA
                regional office, or with the help of a VSO or other accredited
                representative.
              </p>
            </div>
            <br />
            <va-link
              href="https://www.va.gov/burials-memorials/veterans-burial-allowance/"
              text="Learn more about how to apply for VA burial benefits"
            />
          </va-alert>
          <h2 className="vads-u-margin-bottom--0p5 vads-u-font-size--lg">
            Need help?
          </h2>
          <hr className="vads-u-border-color--primary vads-u-margin-y--0 vads-u-border-bottom--2px" />
          <p>
            Call us at <va-link href="tel:800-827-1000" text="800-827-1000" />.
            We’re here Monday through Friday, 8:00 a.m to 9:00 p.m ET. If you
            have hearing loss, call TTY: <va-link href="tel:711" text="711" />.
          </p>
        </>
      )}
    </div>
  ) : (
    <div className="row vads-u-margin-bottom--4">
      <va-alert close-btn-aria-label="Close notification" status="info" visible>
        <h2 id="track-your-status-on-mobile" slot="headline">
          You don’t have any saved online burial forms.
        </h2>
        <div>
          <p className="vads-u-margin-y--0">
            You can apply for VA burial benefits by mail, in person at a VA
            regional office, or with the help of a VSO or other accredited
            representative.
          </p>
        </div>
        <br />
        <va-link
          href="https://www.va.gov/burials-memorials/veterans-burial-allowance/"
          text="Learn more about how to apply for VA burial benefits"
        />
      </va-alert>
      <h2 className="vads-u-margin-bottom--0p5 vads-u-font-size--lg">
        Need help?
      </h2>
      <hr className="vads-u-border-color--primary vads-u-margin-y--0 vads-u-border-bottom--2px" />
      <p>
        Call us at <va-link href="tel:800-827-1000" text="800-827-1000" />.
        We’re here Monday through Friday, 8:00 a.m to 9:00 p.m ET. If you have
        hearing loss, call TTY: <va-link href="tel:711" text="711" />.
      </p>
    </div>
  );
};
