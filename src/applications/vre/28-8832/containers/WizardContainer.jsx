import React from 'react';
import Wizard from 'applications/static-pages/wizard';
import {
  WIZARD_STATUS,
  WIZARD_STATUS_COMPLETE,
  PCPG_ROOT_URL,
  CHAPTER_31_ROOT_URL,
} from '../constants';
import pages from '../wizard/pages';

const WizardContainer = () => (
  <div className="row vads-u-margin-bottom--1">
    <div className="usa-width-two-thirds medium-8 columns">
      <h1 className="vads-u-margin-top--1">
        Apply for Personalized Career Planning and Guidance with VA Form 28-8832
      </h1>
      <p>
        Equal to VA Form 28-8832 (Education/Vocational Counseling Application)
      </p>
      <h2>Is this the form I need?</h2>
      <p>
        This application is for Veterans, service members, or their dependents
        to apply for career counseling and support to help them find a training
        program or job.
      </p>
      <p>
        To see if this is the right form for you,{' '}
        <strong>please answer a few questions.</strong>
      </p>
      <Wizard pages={pages} expander={false} />
      <h2>I know this is the form I need. How do I apply?</h2>
      <p>
        Click on the link below to go straight to the application without
        answering the questions above.
      </p>
      <a
        href={`${PCPG_ROOT_URL}/introduction`}
        onClick={() => {
          sessionStorage.setItem(WIZARD_STATUS, WIZARD_STATUS_COMPLETE);
        }}
      >
        Apply online with VA Form 28-8832
      </a>
      <h2>Do you have a service-connected disability?</h2>
      <p>
        You may <strong>also</strong> be eligible for Chapter 31 Veteran
        Readiness and Employment (VR&E) benefits. If you have a
        service-connected disability or a memorandum (pre-discharge) rating, or
        are you participating in the Integrated Disability Evaluation System
        (IDES) process, you should:
      </p>
      <ul>
        <li>Complete this form first</li>
        <li>
          Click the link at the end of the form to <strong>also</strong> apply
          for VR&E benefits
        </li>
      </ul>
      <p>
        Would you rather <strong>only apply for VR&E benefits?</strong>
      </p>
      <a href={CHAPTER_31_ROOT_URL}>Apply online with VA Form 28-1900</a>
    </div>
  </div>
);

export default WizardContainer;
