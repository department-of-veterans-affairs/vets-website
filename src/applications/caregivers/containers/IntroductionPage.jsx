import React, { useEffect } from 'react';
import OMBInfo from '@department-of-veterans-affairs/formation-react/OMBInfo';

import recordEvent from 'platform/monitoring/record-event';
import { focusElement } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import { withRouter } from 'react-router';
import {
  CaregiverSupportInfo,
  PowerOfAttorneyInfo,
  RepresentativeInfo,
} from 'applications/caregivers/components/AdditionalInfo';

const IntroductionPage = ({ route, router }) => {
  useEffect(() => {
    focusElement('.va-nav-breadcrumbs-list');
  }, []);

  const startForm = () => {
    recordEvent({ event: 'no-login-start-form' });
    const pageList = route.pageList;
    return router.push(pageList[1].path);
  };

  const FamilyBenefits = () => (
    <>
      <p>
        If you’re a family member caring for a Veteran with disabilities, we
        want to support you. We recognize that family caregivers enhance the
        health and well-being of Veterans they care for in their home.
      </p>

      <a
        href="https://www.va.gov/health-care/family-caregiver-benefits/comprehensive-assistance/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn more about family caregiver benefits and find out if you qualify
      </a>
    </>
  );

  const ProcessTimeline = () => (
    <>
      <h2 className="vads-u-font-size--h3 vads-u-margin-bottom--2p5">
        Follow the steps below to apply for Caregiver benefits
      </h2>
      <article className="schemaform-process vads-u-padding-bottom--2p5">
        <div>
          {/* prepare */}
          <section className="process-step list-one">
            <h3 className="vads-u-font-size--h4">Prepare</h3>
            <p>
              To fill out this application, you'll need the Veteran and
              Caregiver(s):
            </p>

            <ul>
              <li>Address</li>
              <li>Phone Number</li>
              <li>Email address</li>
              <li>Social Security number or tax identification number.</li>
              <li>Health care coverage information</li>
            </ul>

            <div>
              <h4 className="vads-u-font-size--h6">
                What if I need help filling out my application?
              </h4>
              <p>
                An accredited representative, like a Veterans Service Officer
                (VSO), can help you fill out your claim.
                <a
                  href="https://www.caregiver.va.gov/help_landing.asp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Get help filing your claim.
                </a>
              </p>

              <CaregiverSupportInfo />
            </div>
          </section>

          {/* Apply */}
          <section className="process-step list-two">
            <h3 className="vads-u-font-size--h4">Apply</h3>
            <p>
              Complete this Caregiver benefits form or have a Power of
              Attorney/Representative complete form. You’ll get a confirmation
              message after submitting the form. You can print this for your
              records.
            </p>

            <div className="vads-u-margin-bottom--2p5">
              <PowerOfAttorneyInfo />
            </div>
            <RepresentativeInfo />
          </section>

          {/* Review */}
          <section className="process-step list-three">
            <h3 className="vads-u-font-size--h4">VA Review</h3>
            <p>
              A caregiver support coordinator will review the application and
              contact you or your caregiver about your eligibility.
            </p>

            <strong>
              If the Veteran initially meets eligibility requirements, the next
              steps are:
            </strong>

            <ul>
              <li>
                You or your caregiver will visit the medical center where you
                receive care
              </li>
              <li>Your caregiver will receive education and training</li>
              <li>
                A caregiver support coordinator will schedule a visit to your
                home
              </li>
            </ul>
          </section>
          {/* Decision */}
          <div className="process-step list-four vads-u-padding-bottom--0">
            <h3 className="vads-u-font-size--h4">Decision</h3>
            <p>
              Once we’ve reviewed your application, you’ll get a notice in the
              mail with our decision.
            </p>
          </div>
        </div>
      </article>
    </>
  );

  return (
    <div className="schemaform-intro">
      <FormTitle title="Apply for Caregiver Benefits" />
      <p>Equal to VA Form 10-10CG (Application for Caregiver Benefits)</p>

      <FamilyBenefits />

      <button className="vads-u-margin-top--5" onClick={startForm}>
        Start your Application
      </button>

      <ProcessTimeline />

      <button className="vads-u-margin-bottom--5" onClick={startForm}>
        Start your Application
      </button>

      <div className="omb-info--container vads-u-padding-left--0">
        <OMBInfo resBurden={15} ombNumber="2900-0768" expDate="04/30/2018" />
      </div>
    </div>
  );
};

export default withRouter(IntroductionPage);
