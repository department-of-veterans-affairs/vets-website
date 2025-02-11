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
      <div className="vads-u-padding--0 usa-content columns">
        <div className="va-introtext">
          <p itemProp="description">
            Answer a series of questions to get customized step-by-step
            instructions on how to apply for a discharge upgrade or correction.
            If we accept your application and upgrade your discharge, you’ll be
            eligible for the VA benefits you earned during your period of
            service.
          </p>
        </div>
        <p>
          All branches of the military consider you to have a strong case for a
          discharge upgrade if you can show your discharge was connected to any
          of these categories:
        </p>
        <ul>
          <li>
            Mental health conditions, including posttraumatic stress disorder
            (PTSD)
          </li>
          <li>Traumatic brain injury (TBI)</li>
          <li>
            Sexual assault or harassment during military service (at VA, we
            refer to this as military sexual trauma or MST)
          </li>
          <li>
            Sexual orientation (including under the Don’t Ask, Don’t Tell
            policy)
          </li>
        </ul>
        <p>
          The information you enter on the next page is completely confidential.
        </p>
        <p>
          <va-link-action
            data-testid="duw-start-form"
            href="#"
            onClick={startForm}
            text="Get started"
          />
        </p>
        <va-accordion>
          <VABenefitsAccordion />
          <va-accordion-item header="What if I already applied for an upgrade or correction and was denied?">
            <p>
              If your previous upgrade application was denied, you can apply
              again, but you may have to follow a different process. Select the
              Get Started link on this page. When you’re asked if you’ve applied
              before, select Yes. After you’ve answered all the questions,
              you’ll see application instructions specific to your situation.
            </p>
            <p>
              Applying again is most likely to be successful if your application
              is significantly different from when you last applied. For
              example, you may have additional evidence that wasn’t available to
              you when you last applied, or the Department of Defense (DOD) may
              have issued new rules regarding discharges. DOD rules changed for
              discharges related to PTSD, TBI, and mental health in 2014,
              military sexual harassment and assault in 2017, and sexual
              orientation in 2011.
            </p>
          </va-accordion-item>
          <va-accordion-item header="What if I have discharges for more than one period of service?">
            <p>
              If the Department of Defense (DOD) or the Coast Guard determined
              you served honorably in one period of service, you may use that
              honorable characterization to establish eligibility for VA
              benefits, even if you later received a less than honorable
              discharge. You earned your benefits during the period in which you
              served honorably. Make sure you specifically mention your period
              of honorable service when applying for VA benefits.
            </p>
            <p>
              <strong>Note:</strong> The only exception is for service-connected
              disability compensation. You’re only eligible to earn disability
              compensation for disabilities you suffered during a period of
              honorable service. You can’t use an honorable discharge from one
              period of service to establish eligibility for a service-connected
              disability from a different period of service.
            </p>
          </va-accordion-item>
          <va-accordion-item header="What if I served honorably, but didn’t receive discharge paperwork?">
            <p>
              You’re eligible for VA benefits at the end of a period of
              honorable service, even if you didn’t receive a discharge in the
              form of a DD214. If you completed your original contract period
              without any disciplinary problems, you can use this period of
              service to establish your eligibility, even if you re-enlisted or
              extended your service and did not receive an “honorable” DD214 at
              the end of your second period of service. If you completed a
              period of honorable service that’s not reflected on a DD214, make
              sure you specifically mention this period of service when you
              apply for VA benefits. We may do a Character of Discharge review
              to confirm your eligibility.
            </p>
            <p>
              You can also apply to the Department of Defense (DOD) or the Coast
              Guard for a second DD214 only for that honorable period of
              service. Select the Get Started link on this page and answer the
              questions based on your most recent discharge. When you’re asked
              if you completed a period of service in which your character of
              service was honorable or general under honorable conditions,
              select: “Yes, I completed a prior period of service, but I did not
              receive discharge paperwork from that period.”
            </p>
          </va-accordion-item>
          <va-accordion-item header="What if I have a DD215 showing an upgraded discharge, but my DD214 still isn’t correct?">
            <p>
              When the Department of Defense (DOD) or the Coast Guard upgrades a
              Veteran’s discharge, it usually issues a DD215 showing corrections
              to the DD214. The DOD or the Coast Guard attaches the DD215 to the
              old DD214—which still shows the outdated discharge and related
              information. While the discharge on the DD215 is the correct
              discharge, a Veteran may still want a new DD214 that shows no
              record of their earlier characterization of discharge.
            </p>
            <p>
              If you have a DD215 and want an updated DD214, select the Get
              Started link on this page. On the next page, select: “I received a
              discharge upgrade or correction, but my upgrade came in the form
              of a DD215, and I want an updated DD214.” After you’ve answered
              all the questions, you’ll see instructions for how to request a
              new DD214.
            </p>
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

export default connect(
  null,
  mapDispatchToProps,
)(HomePage);
