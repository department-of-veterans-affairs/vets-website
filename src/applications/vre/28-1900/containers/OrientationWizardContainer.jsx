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
          This application is for service members or Veterans who have a
          service-connected disability and want to apply for employment support
          and services to help them find and keep a job and live as
          independently as possible. To see if this is right for you,{' '}
          <strong>
            just answer a few questions, then go through the VR&E orientation.
          </strong>
        </p>
        <p>
          <strong>If you already know this is the correct form,</strong> you can
          go directly to the online application without answering questions.{' '}
          <a
            href={CHAPTER_31_ROOT_URL}
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
