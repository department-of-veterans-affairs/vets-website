import React from 'react';

export const TITLE = 'Request personal records';
export const SUBTITLE =
  'Freedom of Information Act (FOIA) or Privacy Act (PA) Request (VA Form 20-10206)';

export const PREPARER_TYPES = Object.freeze({
  CITIZEN: 'citizen',
  NON_CITIZEN: 'non-citizen',
});
export const PREPARER_TYPE_LABELS = Object.freeze({
  [PREPARER_TYPES.CITIZEN]:
    'I’m a U.S. citizen requesting my own personal VA records',
  [PREPARER_TYPES.NON_CITIZEN]:
    'I’m a non-U.S. citizen requesting my own personal VA records',
});

export const RECORD_TYPES = Object.freeze({
  DD214: 'dd214',
  C_FILE: 'c-file',
  DISABILITY_EXAMS: 'disability-exams',
  OMPF: 'ompf',
  PENSION: 'pension',
  TREATMENT: 'treatment',
  OTHER_COMP_PEN: 'other-comp-pen',
  EDUCATION: 'education',
  FIDUCIARY: 'fiduciary',
  FINANCIAL: 'financial',
  HOME_LOAN: 'home-loan',
  LIFE_INS: 'life-ins',
  VRE: 'vre',
  OTHER: 'other',
});
export const RECORD_TYPE_LABELS = Object.freeze({
  [RECORD_TYPES.DD214]:
    'Certificate of Release or Discharge from Active Duty (DD Form 214)',
  [RECORD_TYPES.C_FILE]: 'Claims File (C-file)',
  [RECORD_TYPES.DISABILITY_EXAMS]: 'Disability examinations (C&P exams)',
  [RECORD_TYPES.OMPF]: 'Official military personnel file (OMPF)',
  [RECORD_TYPES.PENSION]: 'Pension benefit documents',
  [RECORD_TYPES.TREATMENT]: 'Service or military treatment',
  [RECORD_TYPES.OTHER_COMP_PEN]: 'Other compensation and/or pension record',
  [RECORD_TYPES.EDUCATION]: 'Education benefit',
  [RECORD_TYPES.FIDUCIARY]: 'Fiduciary services',
  [RECORD_TYPES.FINANCIAL]: 'Financial records',
  [RECORD_TYPES.HOME_LOAN]: 'Home loan benefit',
  [RECORD_TYPES.LIFE_INS]: 'Life insurance benefit',
  [RECORD_TYPES.VRE]: 'Vocational rehabilitation and employment',
  [RECORD_TYPES.OTHER]: 'Other benefit records',
});

export const ADDITIONAL_INFO_THIRD_PARTY = Object.freeze(
  <va-additional-info trigger="How do I request personal records for someone else?">
    <div>
      <p>
        If you’re asking for someone else’s records,{' '}
        <a
          href="https://www.va.gov/FOIA/index.asp"
          target="_blank"
          rel="noopener noreferrer"
        >
          submit a FOIA request (opens in new tab)
        </a>
        . You’ll need to have proper authorization on record for your request to
        be processed.
      </p>
      <ul>
        <li>
          <strong>If you’re a third-party representative</strong> (a family
          member or other assigned person who is not a power of attorney, agent,
          or fiduciary) requesting VA records for someone else, we must have an
          authorization form on record (VA Form 21-0845) for us to release their
          information.
          <a
            href="https://www.va.gov/find-forms/about-form-21-0845/"
            target="_blank"
            rel="noopener noreferrer"
            className="vads-u-display--block vads-u-margin-top--2"
          >
            Go to VA Form 21-0845 Authorization to Disclose Personal Information
            to a Third-Party (opens in new tab)
          </a>
        </li>
        <li className="vads-u-margin-top--2">
          <strong>If you’re a power of attorney</strong> requesting VA records
          for someone else, we must have an official record that you were
          appointed as their representative (VA Form 21-22 or VA Form 21-22a).
          <a
            href="https://www.va.gov/find-forms/about-form-21-22/"
            target="_blank"
            rel="noopener noreferrer"
            className="vads-u-display--block vads-u-margin-top--2"
          >
            Go to VA Form 21-22 Appointment of Veterans Service Organization as
            Claimant’s Representative (opens in new tab)
          </a>
          <a
            href="https://www.va.gov/find-forms/about-form-21-22a/"
            target="_blank"
            rel="noopener noreferrer"
            className="vads-u-display--block vads-u-margin-top--2"
          >
            Go to VA Form 21-22a Appointment of Individual as Claimant’s
            Representative (opens in new tab)
          </a>
        </li>
      </ul>
    </div>
  </va-additional-info>,
);
