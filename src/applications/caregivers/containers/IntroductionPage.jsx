import React, { useEffect } from 'react';
import OMBInfo from '@department-of-veterans-affairs/formation-react/OMBInfo';

import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import recordEvent from 'platform/monitoring/record-event';
import { focusElement } from 'platform/utilities/ui';
import { links } from 'applications/caregivers/definitions/content';
import { withRouter } from 'react-router';
import { CaregiverSupportInfo } from 'applications/caregivers/components/AdditionalInfo';

const IntroductionPage = ({ route, router }) => {
  useEffect(() => {
    focusElement('.va-nav-breadcrumbs-list');
  }, []);

  const startForm = () => {
    recordEvent({ event: 'no-login-start-form' });
    const pageList = route.pageList;
    return router.push(pageList[1].path);
  };

  const ProcessTimeline = () => (
    <div>
      <h2 className="vads-u-font-size--h3 vads-u-margin-bottom--2p5">
        Follow the steps below to apply for the Program of Comprehensive
        Assistance for Family Caregivers:
      </h2>
      <div className="process schemaform-process">
        <ol>
          {/* Prepare */}
          <li className="process-step list-one">
            <h3 className="vads-u-font-size--h4">Prepare</h3>

            <p>
              To fill out this application, the Veteran and each family
              caregiver applicant will need to provide specific information.
              You’ll need:
            </p>
            <ul className="process-lists">
              <li>Address</li>
              <li>Telephone number</li>
              <li>Date of birth</li>
              <li>Social Security Number or Tax Identification Number</li>
            </ul>

            <p>You will also need:</p>
            <ul className="process-lists">
              <li>The VA medical center where the Veteran will receive care</li>
              <li>
                Health insurance information for the Primary Family Caregiver
              </li>
            </ul>

            <div>
              <h4 className="vads-u-font-size--h6">
                What if I have questions or need help filling out the form?
              </h4>

              <span>
                If you have a question or need help, you can contact us in any
                of these ways:
              </span>

              <ul className="process-lists">
                <li>
                  Call us at
                  <a
                    href={links.VAHelpLine.label}
                    aria-label={links.VAHelpLine.phoneAriaLabel}
                    className="vads-u-margin-x--0p5"
                  >
                    877-222-8387
                  </a>
                  and ask for help filling out the form
                </li>
                <li>
                  Use the online
                  <a
                    href={links.caregiverSupportCoordinators.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="vads-u-margin-x--0p5"
                  >
                    Caregiver Support Coordinator locator
                  </a>
                  to find a coordinator at your nearest VA health care facility
                </li>
                <li>
                  Contact the National Caregiver Support Line at
                  <a
                    className="vads-u-margin-x--0p5"
                    href="tel:8552603274"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    855-260-3274
                  </a>
                  or a
                  <a
                    className="vads-u-margin-x--0p5"
                    href="https://www.va.gov/disability/get-help-filing-claim/"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Veterans Service Organization
                  </a>
                  to get help filling out the form
                </li>
              </ul>

              <CaregiverSupportInfo />
            </div>
          </li>

          {/* Apply */}
          <li className="process-step list-two">
            <h3 className="vads-u-font-size--h4">Apply</h3>
            <p>
              Please remember, whether you’re the Veteran or a family caregiver,
              you’ll need to complete all form questions before submitting the
              form. After submitting the form, you’ll receive a confirmation
              screen that you can print for your records.
            </p>

            <p>
              Each time the Veteran wants to add a new family caregiver, the
              Veteran and the new caregiver will need to submit a new
              application. There can only be 1 Primary and up to 2 Secondary
              Family Caregivers at any one time.
            </p>

            <p>
              <b>Note:</b> If the Veteran isn’t enrolled in VA health care or is
              currently on active duty with a medical discharge, they’ll need to
              fill out an
              <a
                rel="noopener noreferrer"
                target="_blank"
                href={links.applyVAHealthCare.link}
                className="vads-u-margin-x--0p5"
              >
                {links.applyVAHealthCare.label}
              </a>
              (VA Form 10-10EZ).
            </p>
          </li>

          {/* Next steps */}
          <li className="process-step list-three">
            <h3 className="vads-u-font-size--h4">Next steps</h3>
            <p>
              A member of the Caregiver Support Program at the VA medical center
              where the Veteran plans to receive care will contact you to
              discuss your application and eligibility.
            </p>

            <p>
              If you aren’t eligible for PCAFC you may be eligible for the
              Program of General Caregiver Support Services (PGCSS). To find out
              more, contact VA’s Caregiver Support Line at
              <a
                href={links.caregiverHelp.phoneLink}
                aria-label={links.caregiverHelp.phoneAriaLabel}
                className="vads-u-margin-left--0p5"
              >
                {links.caregiverHelp.phoneLabel}
              </a>
              , visit
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={links.caregiverHelpPage.link}
                className="vads-u-margin-x--0p5"
              >
                www.caregiver.va.gov
              </a>
              or discuss these options with your local Caregiver Support
              Coordinator.
            </p>
          </li>
        </ol>
      </div>
    </div>
  );

  return (
    <div className="caregivers-intro schemaform-intro">
      <FormTitle
        className="form-title"
        title="Apply for the Program of Comprehensive Assistance for Family Caregivers"
      />
      <p>
        Equal to VA Form 10-10CG (Application for Family Caregiver Benefits)
      </p>
      <p className="va-introtext">
        We recognize the important role of family caregivers in supporting the
        health and wellness of Veterans.
      </p>

      <a
        href={links.caregiverHelpPage.link}
        target="_blank"
        rel="noopener noreferrer"
        className="vads-u-margin-x--0p5"
      >
        Learn more about the Program of Comprehensive Assistance for Family
        Caregivers (PCAFC)
      </a>

      <button
        style={{ display: 'inherit ' }}
        className="usa-button vads-u-margin-y--3"
        onClick={startForm}
      >
        Start your application
      </button>
      <ProcessTimeline />
      <button
        className="usa-button vads-u-margin-bottom--3"
        onClick={startForm}
      >
        Start your Application
      </button>
      <div className="omb-info--container vads-u-padding-left--0">
        <OMBInfo resBurden={15} ombNumber="2900-0091" expDate="09/30/2021" />
      </div>
    </div>
  );
};

export default withRouter(IntroductionPage);
