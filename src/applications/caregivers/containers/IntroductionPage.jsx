import React, { useEffect } from 'react';
import OMBInfo from '@department-of-veterans-affairs/formation-react/OMBInfo';

import recordEvent from 'platform/monitoring/record-event';
import { focusElement } from 'platform/utilities/ui';
import FormTitle from 'platform/forms-system/src/js/components/FormTitle';
import { withRouter } from 'react-router';
import {
  PrimaryCaregiverInfo,
  SecondaryCaregiverInfo,
  CHAMPVAInfo,
  CaregiverSupportInfo,
  PowerOfAttorneyInfo,
  RepresentativeInfo,
  InjuredLineOfDutyInto,
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

  const IntoHighlight = () => (
    <div className="info-highlight">
      <h4>
        Can I get benefits through the Program of Comprehensive Assistance for
        Family Caregivers?
      </h4>

      <p>
        A caregiver of a Veteran qualifies for this program based on the
        Veteran's qualifications. The caregiver may be eligible if the Veteran
        meets both of these requirements:
      </p>

      <ul>
        <li>
          The Veteran requires ongoing supervision or assistance with
          performance basic functions of everyday life due to a serious injury
          or mental disorder incurred or aggravated in the line of duty. This
          includes traumatic brain injury, psychological trauma or another
          mental disorder.
          <InjuredLineOfDutyInto />
        </li>
        <li>
          The Veteran needs personal care services because they can’t perform
          one or more activities of daily living and/or they need supervision or
          protection because they have lasting neurological damage or injury.
        </li>
      </ul>

      <span>
        Answer a few questions to find out if you meet the criteria for this
        program.{' '}
        <a
          href="https://www.va.gov/health-care/family-caregiver-benefits/comprehensive-assistance/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Find out if you qualify
        </a>
      </span>
    </div>
  );

  const Benifits = () => (
    <>
      <h4>What benefits can I get with this program?</h4>
      <p>
        The Veteran can appoint 1 primary (main) caregiver and up to 2 secondary
        caregivers. Secondary Caregivers serve as backup support to the primary
        caregiver when needed). Your benefits will depend on whether you’re the
        primary caregiver or a secondary caregiver.
      </p>
      <PrimaryCaregiverInfo />
      <SecondaryCaregiverInfo />

      <div>
        <h5>If you’re the primary caregiver, you may receive:</h5>
        <ul>
          <li>Caregiver education and training</li>
          <li>A monthly stipend (payment)</li>
          <li>
            Travel, lodging, and financial assistance when traveling with
            Veteran to receive care
          </li>
          <li>
            Health care benefits through the Civilian Health and Medical Program
            of the Department of Veterans Affairs (CHAMPVA)—if you don’t already
            qualify for care or services under another health care plan.
          </li>
          <li>Mental health services and counseling</li>
          <li>Up to 30 days per year of short-term relief, or respite care</li>
        </ul>
        <CHAMPVAInfo />
      </div>
    </>
  );

  const ProcessTimeline = () => (
    <>
      <h4>Follow the steps below to apply for Caregiver benefits</h4>
      <article className="process schemaform-process">
        <div>
          {/* prepare */}
          <section className="process-step list-one">
            <h5>Prepare</h5>
            <h6>
              To fill out this application, you'll need the Veteran and
              Caregiver(s):
            </h6>

            <ul>
              <li>Social Security number or Tax Identification Number.</li>
              <li>
                Basic information about Veteran and Caregiver health insurance.
              </li>
            </ul>

            <div>
              <h5>What if I need help filling out my application?</h5>
              <p>
                An accredited representative, like a Veterans Service Officer
                (VSO), can help you fill out your claim. {''}
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
            <h5>Apply</h5>
            <p>
              Complete this Caregiver benefits form or have a Power of
              Attorney/Representative complete form. You’ll get a confirmation
              message after submitting the form. You can print this for your
              records.
            </p>
            <PowerOfAttorneyInfo />
            <RepresentativeInfo />
            <span>You can Also:</span>
            <ul>
              <li>Call us at 877-222-VETS (877-222-8387)</li>
              <li>
                Find a{' '}
                <a
                  href="https://www.caregiver.va.gov/support/New_CSC_Page.asp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Caregiver Support Coordinator
                </a>
              </li>
              <li>Contact the Nation Caregiver Support line at 855-260-3274</li>
              <li>Contact a Veterans Service Organization</li>
            </ul>
          </section>

          {/* Review */}
          <section className="process-step list-three">
            <h5>VA Review</h5>
            <p>
              Once the form has been received at a medical center, the Caregiver
              Support Coordinator (CSC) will review the application and contact
              the Veteran and Caregiver.
            </p>

            <strong>
              If the Veteran initially meets eligibility requirements, the next
              steps are:
            </strong>

            <ul>
              <li>
                A visit with the Veteran and Caregiver at the medical center
                where the Veteran Receives Care
              </li>
              <li>Caregiver training</li>
              <li>A home visit</li>
            </ul>
          </section>
          {/* Decision */}
          <div className="process-step list-four">
            <h5>Decision</h5>
            <p>You’ll get a notice in the mail with our decision.</p>
          </div>
        </div>
      </article>
    </>
  );

  return (
    <div className="schemaform-intro caregiver-intro-page">
      <FormTitle title="Apply for Caregiver Benefits" />
      <p>Equal to VA Form 10-10CG (Application for Caregiver Benefits)</p>

      <IntoHighlight />

      <button className="va-button-link" onClick={startForm}>
        Start your Application
      </button>

      <Benifits />

      <ProcessTimeline />

      <button className="vads-u-margin-bottom--2p5" onClick={startForm}>
        Start your Application
      </button>

      <div className="omb-info--container vads-u-padding-left--0">
        <OMBInfo resBurden={15} ombNumber="2900-0768" expDate="04/30/2018" />
      </div>
    </div>
  );
};

export default withRouter(IntroductionPage);
