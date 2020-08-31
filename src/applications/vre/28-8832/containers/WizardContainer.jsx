import React from 'react';
import Wizard from 'applications/static-pages/wizard';
import pages from '../wizard/pages';

const WizardContainer = () => (
  <div className="row vads-u-margin-bottom--1">
    <div className="usa-width-two-thirds medium-8 columns">
      <h1>Apply for Personalized Career Planning and Guidance</h1>
      <p>
        Equal to VA Form 28-8832 (Education/Vocational Counseling Application)
      </p>
      <h2>Is this the form I need?</h2>
      <p>
        Thi application is for Veterans, service members, or their dependents to
        apply for career counseling and support to help them find a training
        program or job.
      </p>
      <p>
        To see if this is the right form for you, please answer a few questions.
      </p>
      <Wizard pages={pages} expander={false} />
      <h2>I know this is the form I need. How do I apply?</h2>
      <p>
        Click on the link below to go to our online application without
        answering the questions above.
      </p>
      <a>Apply online with VA Form 28-8832</a>
    </div>
  </div>
);

export default WizardContainer;
