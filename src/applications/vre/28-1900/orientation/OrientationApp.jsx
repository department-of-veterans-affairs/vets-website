import React, { useState, useEffect } from 'react';
import { ORIENTATION_STATUS } from 'applications/vre/28-1900/constants';
import StepComponent from './StepComponent';

const OrientationApp = props => {
  const [step, setStep] = useState(0);
  const { formStartHandler } = props;
  useEffect(
    () => {
      if (step === 4) {
        sessionStorage.setItem(ORIENTATION_STATUS, true);
      }
    },
    [step],
  );
  return (
    <div className="row vads-u-margin-bottom--1 vads-u-margin-top--2 vads-u-border--1px vads-u-padding--3 orientation-border">
      <StepComponent step={step} />
      <div>
        {step > 0 && (
          <a
            onClick={() => (step === 0 ? step : setStep(step - 1))}
            className="usa-button usa-button-secondary"
          >
            back
          </a>
        )}
        <a
          onClick={() => {
            if (step < 4) {
              setStep(step + 1);
            } else {
              formStartHandler();
            }
          }}
          type="button"
          className="usa-button-primary"
        >
          Continue »
        </a>
      </div>
    </div>
  );
};

export default OrientationApp;
