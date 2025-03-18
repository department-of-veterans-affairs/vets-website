import React from 'react';
import { Link } from 'react-router-dom-v5-compat';

export const evidenceDictionary = {
  '21-4142/21-4142a': {
    longDescription: (
      <>
        <p>
          For your benefits claim, we need your permission to request your
          personal information from a non-VA source, like a private doctor or
          hospital.
        </p>
        <p>Personal information may include:</p>
        <ul className="bullet-disc">
          <li>Medical treatments</li>
          <li>Hospitalizations</li>
          <li>Psychotherapy</li>
          <li>Outpatient care</li>
        </ul>
      </>
    ),
    nextSteps: (
      <>
        <p>
          Use VA Form 21-4142 to give us permission to request your personal
          information.
        </p>
        <p>
          You can complete and sign this form online, or use a PDF version and
          upload or mail it.
        </p>
        <Link
          className="active-va-link"
          data-testid="VA Form 21-4142"
          to="https://www.va.gov/find-forms/about-form-21-4142a/"
        >
          VA Form 21-4142
          <va-icon icon="chevron_right" size={3} aria-hidden="true" />
        </Link>
      </>
    ),
  },
};
