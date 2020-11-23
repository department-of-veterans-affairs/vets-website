import React, { useState } from 'react';
import Wizard from 'applications/static-pages/wizard';
import {
  WIZARD_STATUS,
  WIZARD_STATUS_COMPLETE,
  CHAPTER_31_ROOT_URL,
} from 'applications/vre/28-1900/constants';
import pages from 'applications/vre/28-1900/wizard/pages';
import OrientationApp from 'applications/vre/28-1900/orientation/OrientationApp';

const OrientationWizardContainer = () => {
  const [showOrientation, setShowOrientation] = useState(false);
  const [showFormStartButton, setShowFormStartButton] = useState(false);
  // pass this down to wizard children so showOrientation can be updated once
  // a user makes it through a valid wizard flow
  const showOrientationHandler = () => {
    const wizardStatus = sessionStorage.getItem(WIZARD_STATUS);
    setShowOrientation(wizardStatus);
  };

  const showChapter31FormStartButton = () => {
    setShowFormStartButton(true);
  };

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
            href={`${CHAPTER_31_ROOT_URL}/introduction`}
            onClick={() => {
              sessionStorage.setItem(WIZARD_STATUS, WIZARD_STATUS_COMPLETE);
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
          <OrientationApp formStartHandler={showChapter31FormStartButton} />
        )}
        {showFormStartButton && (
          <div className="vads-u-padding--3 vads-u-background-color--gray-lightest">
            <p>
              <strong>Thank you for viewing the VR&E orientation.</strong>
            </p>
            <a
              className="usa-button-primary va-button-primary"
              onClick={() => {
                window.location = `${CHAPTER_31_ROOT_URL}`;
              }}
            >
              Apply for Veteran Readiness and Employment benefits
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrientationWizardContainer;
