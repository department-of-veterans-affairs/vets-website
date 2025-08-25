import React, { useState, useEffect } from 'react';

import { scrollTo } from 'platform/utilities/scroll';
import { focusElement } from 'platform/utilities/ui';
import StepComponent from './StepComponent';
import { orientationSteps } from './utils';

const OrientationApp = props => {
  const [step, setStep] = useState(0);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const { wizardStateHandler } = props;

  // do this to prevent focus skip on prior link tag
  useEffect(
    () => {
      if (isFirstRender && step === 0) {
        setIsFirstRender(false);
      } else {
        focusElement('#StepTitle');
        scrollTo(document.getElementById('StepTitle'));
      }
    },
    [step],
  );

  // Adding another change in a file using <button> to see if this auto changes
  // happen here as well

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
            <va-button
              onClick={() => (step === 0 ? step : setStep(step - 1))}
              className="vads-u-padding-x--4"
              variant="secondary"
              text="Previous slide"
            />
          )}
          {step < orientationSteps.length - 1 && (
            <va-button
              onClick={() => {
                setStep(step + 1);
              }}
              className=""
              text=""
            />
          )}
        </div>
      </article>
    </>
  );
};

export default OrientationApp;
