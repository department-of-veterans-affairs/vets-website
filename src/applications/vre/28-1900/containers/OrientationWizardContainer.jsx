import React, { useState, useEffect } from 'react';
import Scroll from 'react-scroll';
import { focusElement } from 'platform/utilities/ui';
import { WIZARD_STATUS_COMPLETE } from 'platform/site-wide/wizard';
import Wizard from 'applications/static-pages/wizard';
import { CHAPTER_31_ROOT_URL } from 'applications/vre/28-1900/constants';
import pages from 'applications/vre/28-1900/wizard/pages';
import recordEvent from 'platform/monitoring/record-event';
import OrientationApp from 'applications/vre/28-1900/orientation/OrientationApp';

const scroller = Scroll.scroller;
const scrollToTop = () => {
  scroller.scrollTo('topScrollElement', {
    duration: 500,
    delay: 0,
    smooth: true,
  });
};

const OrientationWizardContainer = props => {
  const [showOrientation, setShowOrientation] = useState(false);
  const { wizardStateHandler } = props;
  // pass this down to wizard children so showOrientation can be updated once
  // a user makes it through a valid wizard flow
  const showOrientationHandler = status => {
    setShowOrientation(status);
  };

  // Focus on the header on first load
  useEffect(() => {
    focusElement('h1');
    scrollToTop();
  }, []);

  return (
    <div className="row vads-u-margin-bottom--1">
      <div className="usa-width-two-thirds medium-8 columns">
        <h1 className="vads-u-margin-top--1">
          Apply for Veteran Readiness and Employment with VA Form 28-1900
        </h1>
        <p>
          Equal to VA Form 28-1900 (Vocational Rehabilitation for Claimants With
          Service-Connected Disabilities)
        </p>
        <h2>Is this the form I need?</h2>
        <p>
          Our online Veteran Readiness and Employment (VR&E) orientation can
          help you decide if this program will provide the type of support you
          need to obtain suitable employment or to live independently. The
          orientation takes just 15 minutes to complete.
        </p>
        <p>
          First, answer a few questions below to find out if you’re eligible to
          apply. If you are, we encourage you to complete the orientation before
          you apply.
        </p>
        <p id="skip-wizard-description">
          <strong>If you already know you want to apply for VR&E</strong>, you
          can go directly to the online application without answering the
          questions below.{' '}
          <a
            href={CHAPTER_31_ROOT_URL}
            aria-describedby="skip-wizard-description"
            onClick={() => {
              recordEvent({
                event: 'howToWizard-skip',
              });
              wizardStateHandler(WIZARD_STATUS_COMPLETE);
            }}
          >
            Apply online with VA Form 28-1900
          </a>
        </p>
        <Wizard
          pages={pages}
          expander={false}
          setWizardStatus={showOrientationHandler}
        />
        {showOrientation && (
          <OrientationApp wizardStateHandler={wizardStateHandler} />
        )}
      </div>
    </div>
  );
};

export default OrientationWizardContainer;
