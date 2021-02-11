import React, { useState, useEffect } from 'react';
import StepComponent from './StepComponent';
import { orientationSteps } from './utils';

const OrientationApp = props => {
  const [step, setStep] = useState(0);
  const { formStartHandler, formControlStatus } = props;

  // if a user has gone through the orientation already, reset this so the form start controls are once again hidden.
  useEffect(() => {
    if (formControlStatus) {
      formStartHandler(false);
    }
  }, []);
  return (
    <div className="row vads-u-margin-bottom--1 vads-u-margin-top--2 vads-u-border--1px vads-u-padding--3 orientation-border">
      <StepComponent step={step} />
      <div>
        {step > 0 && (
          <a
            onClick={() => (step === 0 ? step : setStep(step - 1))}
            className="usa-button usa-button-secondary vads-u-padding-x--4"
          >
            « Back
          </a>
        )}
        <a
          onClick={() => {
            if (step < orientationSteps.length - 1) {
              setStep(step + 1);
            } else {
              formStartHandler(true);
            }
          }}
          type="button"
          className="usa-button-primary"
        >
          {step === 0 ? 'Start VR&E orientation' : 'Continue »'}
        </a>
      </div>
    </div>
  );
};

export default OrientationApp;
