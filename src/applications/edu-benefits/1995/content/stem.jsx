import React from 'react';
import AdditionalInfo from '@department-of-veterans-affairs/formation-react/AdditionalInfo';
import environment from '../../../../platform/utilities/environment';

export const rogersStemScholarshipInfo = (
  <AdditionalInfo triggerText="What is the Rogers STEM Scholarship?">
    {environment.isProduction() && (
      <div>
        <p>
          The Edith Nourse Rogers STEM Scholarship provides up to 9 months of
          additional Post-9/11 GI Bill benefits, to a maximum of $30,000.
        </p>
        <p>
          Veterans and Fry Scholars may qualify for this scholarship if they're
          enrolled in an undergraduate program for Science, Technology,
          Engineering, or Math (STEM), or if they've earned a STEM degree and
          are getting a teaching certification.
        </p>
        <p>
          To learn more about the STEM Scholarship,{' '}
          <a
            href="https://benefits.va.gov/gibill/fgib/stem.asp"
            target="_blank"
            rel="noopener noreferrer"
          >
            {' '}
            visit the VBA STEM website.
          </a>
        </p>
      </div>
    )}
    {!environment.isProduction() && (
      <div>
        <p>
          The Edith Nourse Rogers STEM Scholarship provides up to 9 months of
          additional Post-9/11 GI Bill benefits, to a maximum of $30,000.
          <br />
          <br />
          Veterans and Fry Scholars may qualify for this scholarship if they're
          enrolled in an undergraduate program for Science, Technology,
          Engineering, or Math (STEM), or if they've earned a STEM degree and
          are getting a teaching certification.
          <br />
          <br />
          To learn more about the STEM Scholarship,{' '}
          <a
            href="https://benefits.va.gov/gibill/fgib/stem.asp"
            target="_blank"
            rel="noopener noreferrer"
          >
            {' '}
            visit the VBA STEM website.
          </a>
        </p>
      </div>
    )}
  </AdditionalInfo>
);
