import React from 'react';
import AdditionalInfo from '@department-of-veterans-affairs/formation-react/AdditionalInfo';
import captureEvents from '../analytics-functions';

export const rogersStemScholarshipInfo = (
  <div>
    <p>
      The{' '}
      <a
        href="https://benefits.va.gov/gibill/fgib/stem.asp"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => captureEvents.navigateStemScholarship()}
      >
        Edith Nourse Rogers STEM Scholarship
      </a>{' '}
      is offered to students training in high-demand STEM (science, technology,
      engineering, and math) fields.
      <br />
      <br />
      <b>To be considered, you must meet all the requirements below. You:</b>
    </p>
    <ul>
      <li>
        Are using or recently used Post-9/11 GI Bill or Fry Scholarship benefits
      </li>
      <li>
        Have used all your education benefits or are within 6 months of doing
        so.
        <br />
        <a
          href="/education/gi-bill/post-9-11/ch-33-benefit/"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => captureEvents.checkRemainingBenefits()}
        >
          Check your remaining benefits
        </a>
      </li>
      <li>
        Are enrolled in an undergraduate degree program for STEM,{' '}
        <strong>or</strong> have already earned a STEM degree and are pursuing a
        teaching certification <br />
        <a
          href="https://benefits.va.gov/gibill/docs/fgib/STEM_Program_List.pdf"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => captureEvents.seeApprovedStemPrograms()}
        >
          See approved STEM programs
        </a>
      </li>
    </ul>
  </div>
);

export const prodRogersStemScholarshipInfo = (
  <AdditionalInfo triggerText="What is the Rogers STEM Scholarship?">
    <div>
      <p>
        The Edith Nourse Rogers STEM Scholarship provides up to 9 months of
        additional Post-9/11 GI Bill benefits, to a maximum of $30,000.
        <br />
        <br />
        Veterans and Fry Scholars may qualify for this scholarship if they're
        enrolled in an undergraduate program for Science, Technology,
        Engineering, or Math (STEM), or if they've earned a STEM degree and are
        getting a teaching certification.
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
  </AdditionalInfo>
);
