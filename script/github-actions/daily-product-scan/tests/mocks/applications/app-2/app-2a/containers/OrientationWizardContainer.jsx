import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';

import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { focusElement } from 'platform/utilities/ui';
import { WIZARD_STATUS_COMPLETE } from 'platform/site-wide/wizard';
import Wizard from 'applications/static-pages/wizard';
import pages from 'applications/vre/28-1900/wizard/pages';
import recordEvent from 'platform/monitoring/record-event';
import OrientationApp from 'applications/vre/28-1900/orientation/OrientationApp';

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
    scrollToTop('topScrollElement');
    document.title =
      'Veteran Readiness and Employment Orientation | Veteran Affairs';
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
        <h2>How do I know if this program is right for me?</h2>
        <p>
          Our online Veteran Readiness and Employment (VR&E) orientation can
          help you decide if this program can assist you in finding good
          employment or living independently. We encourage you to go through the
          orientation before you fill out the application.
        </p>
        <p>
          First, answer a few questions below to find out if you’re eligible to
          apply. If you are, you can start the 15 minute orientation.
        </p>
        <p id="skip-wizard-description">
          <strong>If you already know you want to apply for VR&E</strong>, you
          can go directly to the online application without answering the
          questions below.{' '}
          <Link
            to="/"
            aria-describedby="skip-wizard-description"
            onClick={() => {
              recordEvent({
                event: 'howToWizard-skip',
              });
              wizardStateHandler(WIZARD_STATUS_COMPLETE);
            }}
          >
            Apply for Veteran Readiness and Employment with VA Form 28-1900
          </Link>
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
