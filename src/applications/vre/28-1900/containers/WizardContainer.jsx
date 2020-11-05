import React from 'react';
import Wizard from 'applications/static-pages/wizard';
import {
  WIZARD_STATUS,
  WIZARD_STATUS_COMPLETE,
  CHAPTER_31_ROOT_URL,
} from 'applications/vre/28-1900/constants';
import pages from 'applications/vre/28-1900/wizard/pages';

const WizardContainer = () => (
  <div className="row vads-u-margin-bottom--1">
    <div className="usa-width-two-thirds medium-8 columns">
      <h1 className="vads-u-margin-top--1">
        Apply for Veteran Readiness and Employment
      </h1>
      <p>
        Equal to VA Form 28-1900 (Vocational Rehabilitation for Claimants With
        Service-Connected Disabilities)
      </p>
      <h2>Find out if this is the right form</h2>
      <p>
        This application is for service members or Veterans who have a
        service-connected disability that limits their ability to work or
        prevents them from working. If you qualify, you may be able to get
        employment support or services to help you live as independently as
        possible. To see if this is the right form for you, please answer a few
        questions.
      </p>
      <Wizard pages={pages} expander={false} />
      <h2>Already know this is the right form?</h2>
      <p>
        If you know VA Form 28-1900 is correct, or if you were directed to
        complete this application, You can go straight to the application
        without answering the questions above.
      </p>
      <a
        href={`${CHAPTER_31_ROOT_URL}/introduction`}
        onClick={() => {
          sessionStorage.setItem(WIZARD_STATUS, WIZARD_STATUS_COMPLETE);
        }}
      >
        If you know VA form 28-1900 is right, apply now
      </a>
    </div>
  </div>
);

export default WizardContainer;
