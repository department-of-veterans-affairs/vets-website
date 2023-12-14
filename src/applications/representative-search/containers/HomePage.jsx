import React from 'react';
import PropTypes from 'prop-types';

import FormTitle from '@department-of-veterans-affairs/platform-forms-system/FormTitle';
import { claimsAgentIsEnabled } from '../config';

export default function HomePage() {
  // const handleSearchRedirect = e => {
  //   e.preventDefault();
  //   router.replace('/search');
  // };

  const renderBreadcrumbs = () => {
    return [
      <a href="/" key="home">
        Home
      </a>,
      <a href="/" key="disability">
        Disability
      </a>,
      <a href="/" key="disability">
        Find an Accredited Representative
      </a>,
    ];
  };

  return (
    <>
      <va-breadcrumbs>{renderBreadcrumbs()}</va-breadcrumbs>
      <div>
        {/* <div className="columns welcome-page-container"> */}
        <div
          // className="usa-width-two-thirds medium-8 columns"
          className="usa-grid usa-width-three-fourths"
          style={{ marginBottom: 20 }}
        >
          <FormTitle title="Find an accredited representative" />
          {claimsAgentIsEnabled ? (
            <p className="vads-u-font-family--serif vads-u-font-size--h3 vads-u-font-weight--normal vads-u-padding-bottom--1">
              An accredited attorney, claims agent, or Veterans Service
              Organization (VSO) can help you file VA claims and appeals.
            </p>
          ) : (
            <p className="vads-u-font-family--serif vads-u-font-size--h3 vads-u-font-weight--normal vads-u-padding-bottom--1">
              Accredited attorneys and Veterans Service Organizations (VSO) can
              help you file VA claims and appeals.
            </p>
          )}
          <h2>Follow these steps to find and appoint a representative</h2>

          <va-process-list>
            <li>
              <h3>Find a representative</h3>
              <p>Use our tool to find a representative near you.</p>
            </li>
            <li>
              <h3>Contact an accredited representative</h3>
              <p>
                Contact the accredited representative you want to use to find
                out if they're available.
              </p>
            </li>
            <li>
              <h3>Fill out your form</h3>
              <p>Use our tool to fill out your printable form.</p>
            </li>
            <li>
              <h3>
                Print and submit your form to appoint your accredited
                representative
              </h3>
              <p>
                Please subit your form only after an accredited representative
                has agreed to help you.
              </p>
              <va-additional-info
                trigger="Where can I submit by completed Appoint a Representative Form
                21-22a?"
              >
                <h4>Online</h4>
                <ul>
                  <li>Upload to VA.gov Claim Status Tool</li>
                  <li>Or upload to Access VA Quick Submit Tool</li>
                </ul>
                <h4>By Mail</h4>
                <ul>
                  <li>
                    <p>
                      <strong>Compensation Claims</strong>
                    </p>
                    <p>Department of Veterans Affairs Evidence Intake Center</p>
                    <p>PO Box 4444</p>
                    <p>Janesville, WI 53547-4444</p>
                  </li>
                  <li>
                    <p>
                      <strong>Board of Veterans Appeals</strong>
                    </p>
                    <p>
                      Department of Veterans Affairs Board of Veterans' Appeals
                    </p>
                    <p>PO Box 27063</p>
                    <p>Washington, DC 20038</p>
                  </li>
                  <li>
                    <p>
                      <strong>Fidcuiary</strong>
                    </p>
                    <p>Department of Veterans Affairs Fiduciary Intake</p>
                    <p>PO Box 95211</p>
                    <p>Lakeland, FL 33804-5211</p>
                  </li>
                  <li>
                    <p>
                      <strong>Pension & Survivors Benefit Claims</strong>
                    </p>
                    <p>Department of Veterans Affairs Pension Intake Center</p>
                    <p>PO Box 5365</p>
                    <p>Janesville, WI 53547-5365</p>
                  </li>
                </ul>
                <h4>In Person</h4>
                <p>
                  <a href="/representative/welcome">
                    Upload to VA.gov Claim Status Tool
                  </a>
                </p>
                <p>
                  <a href="/representative/welcome">
                    Or upload to Access VA Quick Submit Tool
                  </a>
                </p>
              </va-additional-info>
            </li>
          </va-process-list>

          <a
            className="vads-c-action-link--green"
            href="/representative/search"
          >
            Find an Accredited Representative
          </a>
          <h2>Learn more about accredited representatives</h2>
          <p>
            Appointing an accredited representative assigns power of attorney so
            you can get help with your VA claim or appeal. Find out how an
            accredited representative can help you.
          </p>
          <a href="/representative/welcome">
            Get help filing your claim or appeal
          </a>
          <h2>Manually print and fill out your form</h2>
          <p>
            If you'd like to appoint a VSO, fill out an Appointment of Veterans
            Service Organization as Claimant's Representative (VA Form 21-22).
          </p>

          <va-link
            download
            filetype="PDF"
            href="https://www.va.gov"
            pages={5}
            text="Download VA Form 21-22"
          />
          <p>
            If you'd like to appoint an attorney{' '}
            {claimsAgentIsEnabled && `or claims agent`}, fill out an Appointment
            of individual as Claimant's Representative (VA Form 21-22a).
          </p>
          <va-link
            download
            filetype="PDF"
            href="https://www.va.gov"
            pages={5}
            text="Download VA Form 21-22"
          />
        </div>
      </div>
    </>
  );
}

HomePage.propTypes = {
  router: PropTypes.object,
};
