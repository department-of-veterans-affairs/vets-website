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
    <>
      <h2 className="vads-u-font-size--h3 vads-u-margin-bottom--2p5">
        Follow the steps below to apply for the Program of Comprehensive
        Assistance of Family Caregivers:
      </h2>
      <article className="schemaform-process vads-u-padding-bottom--2p5">
        <div>
          {/* prepare */}
          <section className="process-step list-one">
            <h3 className="vads-u-font-size--h4">Prepare</h3>

            <p>
              To fill out this application, the Veteran and each family
              caregiver applicant will need to provide specific information.
              You’ll need:
            </p>
            <ul>
              <li>Address</li>
              <li>Telephone Number</li>
              <li>Date of birth</li>
              <li>Email address</li>
              <li>Social Security number or tax identification number</li>
            </ul>

            <p>You will also need:</p>
            <ul>
              <li>The VA medical center where the Veteran will receive care</li>
              <li>
                Health insurance information for the Primary Family Caregiver
              </li>
            </ul>

            <div>
              <h4 className="vads-u-font-size--h6">
                Where can I get help filling out the form and answers to
                questions?
              </h4>

              <span>
                You may use any of the following to request assistance:
              </span>

              <ul>
                <li>
                  Ask VA to help you fill out the form by calling us at
                  {''}
                  <a href={links.VAHelpLine.label}>877-222-VETS (8387)</a>
                </li>
                <li>
                  Locate and contact the Caregiver Support Coordinator at your
                  nearest VA health care facility. You may use the online
                  Caregiver Support Coordinator locator
                </li>
                <li>
                  Contact the VA National Caregiver Support Line by calling
                  855-260-3274 or a Veterans Service Organization
                </li>
                <a href={links.caregiverHelp.link}>
                  {links.caregiverHelp.label}
                </a>
              </ul>
              <p>
                An accredited representative, like a Veterans Service Officer
                (VSO), can help you fill out your claim.
                <a
                  href={links.caregiverHelp.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {links.caregiverHelp.label}
                </a>
              </p>

              <CaregiverSupportInfo />
            </div>
          </section>

          {/* Apply */}
          <section className="process-step list-two">
            <h3 className="vads-u-font-size--h4">Apply</h3>
            <p>
              Each applicant needs to complete all form fields before submitting
              the form. Once the form is submitted, you’ll receive a
              confirmation message. You can print this for your records.
            </p>

            <p>
              Note: If the Veteran isn’t enrolled in VA health care or is
              currently on active duty with a medical discharge, they’ll need to
              fill out an Application for Health Benefits (VA Form 10-10EZ).
            </p>
          </section>

          {/* Next Steps */}
          <section className="process-step list-three">
            <h3 className="vads-u-font-size--h4">Next Steps</h3>
            <p>
              A member of the Caregiver Support Program at the VA medical center
              where the Veteran plans to receive care will contact you to
              discuss your application and next steps to determine your
              eligibility.
            </p>

            <p>
              If you aren’t eligible for PCAFC you may be eligible for the
              Program of General Caregiver Support Services (PGCSS). To find out
              more, contact VA’s Caregiver Support Line at{' '}
              <a href={links.caregiverHelp.phoneLink}>
                {links.caregiverHelp.phoneLabel}
              </a>
              , visit www.va.caregiver.com or discuss these options with your
              local Caregiver Support Coordinator.
            </p>
          </section>
        </div>
      </article>
    </>
  );

  return (
    <div className="schemaform-intro">
      <FormTitle title="Apply for Caregiver Benefits" />
      <p>Equal to VA Form 10-10CG (Application for Caregiver Benefits)</p>
      <p>
        We recognize the important role of family caregivers in supporting the
        health and wellness of Veterans.
      </p>
      <a href="#">
        Learn more about the Program of Comprehensive Assistance for Family
        Caregivers (PCAFC) and find out if you may be eligible
      </a>
      <button
        style={{ display: 'inherit ' }}
        className="va-button-primary vads-u-margin-y--5"
        onClick={startForm}
      >
        Start your application
      </button>
      <ProcessTimeline />
      <button
        className="va-button-primary vads-u-margin-bottom--5"
        onClick={startForm}
      >
        Start your Application
      </button>
      <div className="omb-info--container vads-u-padding-left--0">
        <OMBInfo resBurden={15} ombNumber="2900-0768" expDate="04/30/2018" />
      </div>
    </div>
  );
};

export default withRouter(IntroductionPage);
