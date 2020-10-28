import React, { useState, useEffect } from 'react';
import {
  CHAPTER_31_ROOT_URL,
  ORIENTATION_STATUS,
} from 'applications/vre/28-1900/constants';
import StepComponent from './StepComponent';

const orientationSteps = [
  {
    title: 'Re-Employment',
    path: '1Yh6fTxvBPw',
  },
  {
    title: 'Rapid Access to Employment',
    path: '4DVbOy8iJbU',
  },
  {
    title: 'Self Employment',
    path: 'xkqhMmWzt74',
  },
  {
    title: 'Employment Through Long-Term Services',
    path: 'IXlJndX93R8',
  },
  {
    title: 'Independent Living',
    path: 'hHgPTZNAMxo',
  },
];

const OrientationApp = () => {
  const [step, setStep] = useState(0);
  const orientationStep = orientationSteps[step];
  useEffect(
    () => {
      if (step === 4) {
        sessionStorage.setItem(ORIENTATION_STATUS, true);
      }
    },
    [step],
  );
  return (
    <div className="row vads-u-margin-bottom--1">
      <div className="usa-width-two-thirds medium-8 columns">
        <h2>Please watch each video to learn about Chapter 31 benefits</h2>
        <StepComponent step={orientationStep} />
        <div>
          <a
            onClick={() => (step === 0 ? step : setStep(step - 1))}
            className="usa-button usa-button-secondary"
          >
            back
          </a>
          <a
            onClick={() => {
              if (step < 4) {
                setStep(step + 1);
              } else {
                window.location = `${CHAPTER_31_ROOT_URL}`;
                sessionStorage.setItem(ORIENTATION_STATUS, true);
              }
            }}
            type="button"
            className="usa-button-primary va-button-primary"
          >
            {step < 4 ? 'next' : 'Apply for chapter 31 benefits'}
          </a>
        </div>
        <h2>Already know this is the right form?</h2>
        <p>
          If you know VA Form 28-1900 is correct, or if you were directed to
          complete this application, You can go straight to the application
          without answering the questions above.
        </p>
        <a
          href={`${CHAPTER_31_ROOT_URL}/introduction`}
          onClick={() => {
            sessionStorage.setItem(ORIENTATION_STATUS, true);
          }}
        >
          If you know VA form 28-1900 is right, apply now
        </a>
      </div>
    </div>
  );
};

export default OrientationApp;
