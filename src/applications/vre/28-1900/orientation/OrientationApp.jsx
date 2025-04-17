import React, { useState, useEffect } from 'react';

import scrollTo from 'platform/utilities/ui/scrollTo';
import { focusElement } from 'platform/utilities/ui';
import StepComponent from './StepComponent';
import { orientationSteps } from './utils';

const OrientationApp = props => {
  const [step, setStep] = useState(0);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const { wizardStateHandler } = props;

  // do this to prevent focus skip on prior link tag
  useEffect(() => {
    if (isFirstRender && step === 0) {
      setIsFirstRender(false);
    } else {
      focusElement('#StepTitle');
      scrollTo(document.getElementById('StepTitle'));
    }
  }, [step]);

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
        <StepComponent step={step} clickHandler={wizardStateHandler} />
        <div>
          {step > 0 && (
            <button
              onClick={() => (step === 0 ? step : setStep(step - 1))}
              className="usa-button usa-button-secondary vads-u-padding-x--4"
            >
              Previous slide
            </button>
          )}
          {step < orientationSteps.length - 1 && (
            <button
              onClick={() => {
                setStep(step + 1);
              }}
              type="button"
              className="usa-button-primary"
            >
              {step === 0 ? 'Start VR&E orientation slideshow' : 'Next slide'}
            </button>
          )}
        </div>
      </article>
    </>
  );
};

export default OrientationApp;
