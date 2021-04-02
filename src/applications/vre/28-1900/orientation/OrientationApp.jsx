import React, { useState, useEffect } from 'react';
import Scroll from 'react-scroll';
import { focusElement } from 'platform/utilities/ui';
import { WIZARD_STATUS_COMPLETE } from 'platform/site-wide/wizard';
import StepComponent from './StepComponent';
import { orientationSteps } from './utils';
import { CHAPTER_31_ROOT_URL } from 'applications/vre/28-1900/constants';

const scroller = Scroll.scroller;
const scrollToTop = () => {
  scroller.scrollTo('topScrollElement', {
    duration: 500,
    delay: 0,
    smooth: true,
  });
};

const OrientationApp = props => {
  const [step, setStep] = useState(0);
  const [formStartControl, setFormStartControl] = useState(false);
  const { wizardStateHandler } = props;

  // do this to prevent focus skip on prior link tag
  useEffect(() => {
    if (formStartControl) {
      focusElement('#FormStartControl');
    } else if (step > 0) {
      focusElement('#StepTitle');
      scrollToTop();
    }
  });

  return (
    <>
      <article
        aria-labelledby="vre-orientation"
        aria-roledescription="carousel"
        className="row vads-u-margin-bottom--1 vads-u-margin-top--2 vads-u-border--1px vads-u-padding--3 orientation-border"
      >
        <h2 id="vre-orientation" className="vads-u-margin-top--0">
          VR&E Orientation
        </h2>
        <p id="orientation-step" className="vads-u-font-weight--bold">
          Slide {step + 1} of {orientationSteps.length}
        </p>
        <StepComponent step={step} />
        <div>
          {step > 0 && (
            <button
              onClick={() => (step === 0 ? step : setStep(step - 1))}
              className="usa-button usa-button-secondary vads-u-padding-x--4"
            >
              Previous slide
            </button>
          )}
          <button
            onClick={() => {
              if (step < orientationSteps.length - 1) {
                setStep(step + 1);
              } else {
                setFormStartControl(true);
              }
            }}
            type="button"
            className="usa-button-primary"
          >
            {/* eslint-disable-next-line no-nested-ternary */}
            {step === 0
              ? 'Start VR&E orientation slideshow'
              : step < orientationSteps.length - 1
                ? 'Next slide'
                : 'Finish VR&E Orientation'}
          </button>
        </div>
      </article>
      {formStartControl && (
        <div className="vads-u-padding--3 vads-u-background-color--gray-lightest">
          <p>
            <strong>Thank you for viewing the VR&E orientation.</strong> To
            apply for Veteran Readiness & Employment benefits now, click the
            button below.
          </p>
          <a
            id="FormStartControl"
            href={CHAPTER_31_ROOT_URL}
            className="va-action-link--green vads-u-padding-left--0"
            onClick={() => {
              wizardStateHandler(WIZARD_STATUS_COMPLETE);
            }}
          >
            Apply for Veteran Readiness and Employment
          </a>
        </div>
      )}
    </>
  );
};

export default OrientationApp;
