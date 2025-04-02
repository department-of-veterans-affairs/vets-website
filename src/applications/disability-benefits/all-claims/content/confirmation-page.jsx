import React from 'react';

export const howLongForDecision = (
  <>
    <h2>How long will it take VA to make a decision on my claim?</h2>
    <p>
      We process applications in the order we receive them. The amount of time
      it takes us to review your claim depends on:
    </p>
    <ul>
      <li>The type of claim you filed. </li>
      <li>
        How many injuries or conditions you claimed and how complex they are.{' '}
      </li>
      <li>
        How long it takes us to collect the evidence needed to decide your
        claim. We may contact you if we have questions or need more information.
      </li>
    </ul>
  </>
);

/**
 * Create markup needed to display an external pdf link
 * @param {string} docName - name of the pdf
 * @param {string} href - link to the pdf
 * @param {number} pages - number of pages
 * @returns {element} va-link for downloading a pdf
 */
const createExternalPDFLink = (docName, href, pages) => {
  return (
    <>
      <va-link
        download
        filetype="PDF"
        href={href}
        onClick={e => {
          e.preventDefault();
          window.open(href, '_blank');
        }}
        pages={pages}
        text={`Download ${docName} (opens in new tab)`}
      />
    </>
  );
};

export const dependentsAdditionalBenefits = (
  <>
    <h2>If I have dependents, how can I receive additional benefits?</h2>
    <p>
      <strong>If you have a spouse or child</strong>, you may be entitled to
      additional payments.
    </p>
    <va-link-action
      href="https://www.va.gov/view-change-dependents/"
      text="Apply online to add a dependent"
      type="secondary"
    />
    <p>
      Or you can fill out and submit an Application Request to Add and/or Remove
      Dependents (VA Form 21-686c)
    </p>
    <p>
      {createExternalPDFLink(
        'VA Form 21-686c',
        'https://www.vba.va.gov/pubs/forms/VBA-21-686c-ARE.pdf',
        15,
      )}
    </p>
    <p>
      <strong>Note:</strong> If you’re claiming your child who became
      permanently disabled before they turned 18, you’ll need to submit all
      military and private medical records relating to the child’s disabilities
      with your application.
    </p>
    <p>
      <strong>
        If you’re claiming a child who’s between 18 and 23 years old and
        attending school full time
      </strong>
      , you’ll need to fill out and submit a Request for Approval of School
      Attendance (VA Form 21-674) so we can verify their attendance.
    </p>
    <p>
      {createExternalPDFLink(
        'VA Form 21-674',
        'https://www.vba.va.gov/pubs/forms/VBA-21-674-ARE.pdf',
        3,
      )}
    </p>
    <p>
      <strong>If you have dependent parents</strong>, you may be entitled to
      additional payments. Fill out and submit a Statement of Dependency of
      Parent(s) (VA Form 21P-509).
    </p>
    <p>
      {createExternalPDFLink(
        'VA Form 21P-509',
        'https://www.vba.va.gov/pubs/forms/VBA-21P-509-ARE.pdf',
        4,
      )}
    </p>
  </>
);
