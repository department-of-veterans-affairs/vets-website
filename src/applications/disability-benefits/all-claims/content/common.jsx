import React from 'react';
import { CONTACTS } from '@department-of-veterans-affairs/component-library/contacts';
import { DBQ_URL } from '../constants';

export const editNote = name => (
  <p>
    <strong>Note:</strong> If you need to update your {name}, please call
    Veterans Benefits Assistance at{' '}
    <va-telephone contact={CONTACTS.VA_BENEFITS} />, Monday through Friday, 8:00
    a.m. to 9:00 p.m. ET.
  </p>
);

export const ContactCrisis = () => (
  <>
    <p>
      If you’re in crisis, we can support you. Our Veterans Crisis Line is
      confidential (private), free, and available 24/7.
    </p>
    <p>
      To connect with a Veterans Crisis Line responder anytime, day or night:
    </p>
    <ul>
      <li>
        Call the Veterans Crisis Line at{' '}
        <va-telephone contact={CONTACTS.CRISIS_LINE} /> and press 1,{' '}
        <strong>or</strong>
      </li>
      <li>
        Visit{' '}
        <a href="https://www.veteranscrisisline.net/get-help-now/chat/">
          Veterans Crisis Line
        </a>{' '}
        to start a confidential chat online, <strong>or</strong>
      </li>
      <li>
        Send a{' '}
        <a href="sms:838255" aria-label="8 3 8 2 5 5.">
          text to 838255
        </a>
        .
      </li>
    </ul>
    <p>
      If you have hearing loss, please call TTY at{' '}
      <va-telephone contact={CONTACTS.CRISIS_TTY} />.
    </p>
  </>
);

export const bddAlertBegin = (
  <>
    <p className="vads-u-font-size--base">
      You’ll need to upload your completed{' '}
      <a href={DBQ_URL} target="_blank" rel="noreferrer">
        Separation Health Assessment - Part A Self-Assessment (opens in new tab)
      </a>{' '}
      so we can request your VA exams. Use a desktop computer or laptop to
      download and fill out the form.
    </p>
    <p />
  </>
);
