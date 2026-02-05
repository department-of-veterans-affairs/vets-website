import React, { useEffect } from 'react';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { ROUTES } from '../constants';
import { updateIntroPageViewed } from '../actions';
import { pageSetup } from '../utilities/page-setup';
import { QUESTION_MAP } from '../constants/question-data-map';
import { NeedHelp } from './NeedHelp';
import VABenefitsAccordion from './VABenefitsAccordion';

const HomePage = ({ router, setIntroPageViewed }) => {
  const H1 = QUESTION_MAP.HOME;

  useEffect(() => {
    pageSetup(H1);
    setIntroPageViewed(true);
  });

  const startForm = event => {
    event.preventDefault();
    router.push(ROUTES.SERVICE_BRANCH);
  };

  return (
    <>
      <h1>{H1}</h1>
      <div className="va-introtext">
        <p itemProp="description">
          If you have a discharge that isn’t honorable, you can apply for a
          discharge upgrade. Or you can request a correction to change incorrect
          information on your discharge paperwork.
        </p>
      </div>
      <h2>Can I apply for a discharge upgrade or correction?</h2>
      <div className="vads-u-padding--0 usa-content columns">
        <div className="va-introtext">
          <p itemProp="description">
            If you believe your character of discharge is incorrect for any
            reason, you can apply for a discharge upgrade or correction.
          </p>
        </div>
        <p>
          You have a strong case for a discharge upgrade or correction if you
          can show your discharge was connected to any of these factors:
        </p>
        <ul>
          <li>
            Mental health conditions, including posttraumatic stress disorder
            (PTSD)
          </li>
          <li>Traumatic brain injury (TBI)</li>
          <li>
            Sexual assault or harassment during military service ( referred to
            this as military sexual trauma or MST)
          </li>
          <li>
            Sexual orientation, including under the Don’t Ask, Don’t Tell policy
          </li>
        </ul>
        <h2>How do I apply for a discharge upgrade or correction?</h2>
        <p>
          Use our tool to find out how to apply for a discharge upgrade or
          correction. We’ll ask you some questions about your situation. Then,
          we’ll tell you how to apply based on your answers.
        </p>
        <p>We’ll keep the information you enter confidential.</p>
        <p>
          <strong>Note:</strong> This tool provides instructions on how to apply
          for a discharge upgrade or correction. But it won’t start your
          application for a discharge upgrade or correction.
        </p>
        <p>
          <va-link-action
            data-testid="duw-start-form"
            href="#"
            onClick={startForm}
            text="Get started"
          />
        </p>
        <h2>
          Other questions about applying for a discharge upgrade or correction
        </h2>
        <va-accordion>
          <VABenefitsAccordion />
          <va-accordion-item header="Can I get VA benefits if my discharge wasn’t honorable?">
            <p>
              You may qualify for VA benefits, even if you have a discharge that
              isn’t honorable.
            </p>
            <p>
              When you apply for VA benefits, we’ll automatically review your
              record to determine if your service was honorable for VA purposes.
              We call this a Character of Discharge review. This review can take
              up to 1 year. After we receive your benefit claim, we’ll send you
              a letter to request documents and other evidence we may need.
            </p>
            <p>
              You can get a Character of Discharge review at the same time
              you’re applying for a discharge upgrade or correction.
            </p>
            <p>
              If you’re not currently applying for VA benefits, you can still
              request a Character of Discharge review. Send us a written request
              online through Ask VA.
            </p>
            <va-link
              href="/contact-us/ask-va/introduction"
              text="Contact us online through Ask VA"
            />
            <p>Or mail your written request to us at this address.</p>
            <p className="va-address-block">
              Department of Veterans Affairs <br />
              Evidence Intake Center
              <br />
              P.O. Box 4444
              <br />
              Janesville, WI 53547-4444
              <br />
              United States of America
            </p>
            <p>
              <strong>Note:</strong> A Character of Discharge review won’t
              change your DD214. The review will only affect whether you’re
              eligible for certain VA benefits based on your service. If you
              want to change your DD214, you’ll need to apply for a discharge
              upgrade or correction.
            </p>
          </va-accordion-item>
          <va-accordion-item header="What if I already applied for an upgrade or correction and was denied?">
            <p>
              You can apply for a discharge upgrade or correction again. But you
              may have to apply a different way. Select Get started on this
              page. When we ask if you’ve applied before, select Yes. After you
              answer all the questions, we’ll tell you what to do next based on
              your situation.
            </p>
            <p>
              You’re likely to have more success if your new application is
              different from when you last applied. For example, you may have
              additional evidence, or the Defense Department (DOD) may have
              issued new rules about discharges since the last time you applied.
              DOD released new guidance for discharges related to sexual
              orientation in 2011, PTSD, TBI, and mental health in 2014, and
              military sexual harassment and assault in 2017.
            </p>
          </va-accordion-item>
          <va-accordion-item header="What if I have discharges for more than 1 period of service?">
            <p>
              If the Defense Department (DOD) or the Coast Guard determined you
              served honorably in 1 period of service, you may use that
              honorable characterization to establish eligibility for VA
              benefits, even if you later received a discharge that wasn’t
              honorable. You earned your benefits during the period in which you
              served honorably. Make sure you specifically mention your period
              of honorable service when applying for VA benefits.
            </p>
            <p>
              <strong>Note:</strong> You’re only eligible to receive disability
              compensation for service-connected disabilities you suffered
              during a period of honorable service. You can’t use an honorable
              discharge from 1 period of service to establish eligibility for a
              service-connected disability from a different period of service.
            </p>
          </va-accordion-item>
          <va-accordion-item header="What if I served honorably, but didn’t receive discharge paperwork?">
            <p>
              You’re eligible for VA benefits at the end of a period of
              honorable service, even if you didn’t receive a DD214. If you
              completed your original contract period without any disciplinary
              issues, you can use this period of service to establish your
              eligibility, even if you re-enlisted or extended your service and
              didn’t receive an honorable DD214 at the end of your second period
              of service. If you completed a period of honorable service that’s
              not reflected on a DD214, make sure you specifically mention this
              period of service when you apply for VA benefits. We may do a
              Character of Discharge review to confirm your eligibility.
            </p>
            <p>
              You can also apply to the Defense Department (DOD) or the Coast
              Guard for a second DD214 only for that honorable period of
              service.
            </p>
            <p>
              Select <strong>Get Started</strong> on this page. Answer the
              questions based on your most recent discharge. When we ask if you
              completed a period of service in which your character of service
              was honorable or general under honorable conditions, select Yes, I
              completed a prior period of service, but I did not receive
              discharge paperwork from that period.
            </p>
          </va-accordion-item>
          <va-accordion-item header="What if I have a DD215 showing an upgraded discharge, but my DD214 still isn’t correct?">
            <p>
              When the Defense Department (DOD) or the Coast Guard upgrades your
              discharge, it usually issues a DD215 showing corrections to the
              DD214. The DOD or the Coast Guard will attach the DD215 to the old
              DD214. The old DD214 will show the outdated discharge. And the new
              DD215 will show the corrected discharge.
            </p>
            <p>
              If you have a DD215 and want an updated DD214, select Get Started
              on this page. When we ask you to select the description that
              matches your situation, select{' '}
              <strong>
                I received a discharge upgrade or correction, but my upgrade
                came in the form of a DD215, and I want an updated DD214
              </strong>
              . After you answered all the questions, we’ll tell you how to
              request a new DD214.
            </p>
          </va-accordion-item>
          <va-accordion-item header="What if I need help applying for a discharge upgrade or correction?">
            <p>
              You can get help from an accredited attorney, claims agent, or
              Veterans Service Organization representative.
            </p>
            <p>
              An accredited representative can help you complete your
              application. They can also help you collect and submit supporting
              documents.
            </p>
            <va-link
              href="/disability/get-help-filing-claim/"
              text="Find out how to get help from an accredited representative"
            />
          </va-accordion-item>
        </va-accordion>
        <NeedHelp />
      </div>
    </>
  );
};

HomePage.propTypes = {
  router: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  setIntroPageViewed: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  setIntroPageViewed: updateIntroPageViewed,
};

export default connect(null, mapDispatchToProps)(HomePage);
