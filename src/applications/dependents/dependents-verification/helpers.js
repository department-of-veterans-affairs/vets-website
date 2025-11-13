import React from 'react';
import { parse, format } from 'date-fns';

import { calculateAge } from '../shared/utils';

export const hasSession = () => localStorage.getItem('hasSession') === 'true';

/**
 * @typedef DependentsArrayFromAPI
 * @type {Array}
 * @property {Boolean} awardIndicator - Award indicator ('Y' or 'N')
 * @property {String} dateOfBirth - Date of birth in MM/dd/yyyy
 * @property {String} firstName - First name of the dependent
 * @property {String} lastName - Last name of the dependent
 * @property {String} relatedToVet - Related to the veteran ('Y' or 'N')
 * @property {String} relationship - Relationship to the veteran
 * @property {String} removalDate - Removal date of the dependent
 * @property {String} ssn - Full Social Security Number
 * @property {Boolean} veteranIndicator - Is a Veteran ('Y' or 'N')
 */
/**
 * @typedef DependentsArrayProcessed
 * @type {Array}
 * @property {Number} age - Age in years
 * @property {Boolean} awardIndicator - Award indicator ('Y' ONLY)
 * @property {String} dateOfBirth - Date of birth in MM/dd/yyyy
 * @property {String} dob - Formatted date of birth (MMMM d, yyyy)
 * @property {String} firstName - First name of the dependent
 * @property {String} fullName - Full name of the dependent (first + last)
 * @property {String} lastName - Last name of the dependent
 * @property {String} relatedToVet - Related to the veteran ('Y' or 'N')
 * @property {String} relationship - Relationship to the veteran
 * @property {String} removalDate - Removal date of the dependent
 * @property {String} ssn - Social Security Number (only the last four)
 * @property {Boolean} veteranIndicator - Is a Veteran ('Y' or 'N')
 */
/**
 * Process API response for dependent persons
 * @param {DependentsArrayFromAPI} persons - Array of dependents objects
 * @returns {DependentsArrayProcessed} - Processed array of dependents
 */
export const processDependents = (persons = []) => {
  if (persons.length > 0) {
    return persons
      .filter(person => person.awardIndicator === 'Y')
      .map(person => {
        // Format the date of birth and calculate age
        const { dobStr, age } = calculateAge(person.dateOfBirth);
        const removalDate = person.upcomingRemoval
          ? parse(person.upcomingRemoval, 'MM/dd/yyyy', new Date())
          : '';

        return {
          ...person,
          dob: dobStr || '',
          ssn: (person.ssn || '').toString().slice(-4),
          fullName: `${person.firstName || ''} ${person.lastName || ''}`.trim(),
          age,
          removalDate: removalDate ? format(removalDate, 'MMMM d, yyyy') : '',
        };
      });
  }
  return [];
};

export const PRIVACY_ACT_NOTICE = (
  <>
    <p>
      <strong>PRIVACY ACT NOTICE:</strong> The VA will not disclose information
      collected on this form to any source other than what has been authorized
      under the Privacy Act of 1974 or Title 5, Code of Federal Regulations
      1.526 for routine uses (i.e., civil or criminal law enforcement,
      congressional communications, epidemiological or research studies, the
      collection of money owed to the United States, litigation in which the
      United States is a party or has an interest, the administration of VA
      programs and delivery of VA benefits, verification of identity and status,
      and personnel administration) as identified in the VA system of records,
      58VA21/22/28 Compensation, Pension, Education, Veteran Readiness and
      Employment Records - VA, published in the Federal Register. <br />
      Your obligation to respond is required to obtain or retain benefits. You
      must give us your and your dependents SSN account information. Applicants
      are required to provide their SSN and the SSN of any dependents for whom
      benefits are claimed under Title 38 U.S.C. 5101 (c) (1). The VA will not
      deny an individual benefits for refusing to provide his or her SSN unless
      the disclosure of the SSN is required by Federal Statute of law in effect
      prior to January 1, 1975, and still in effect. Information that you
      furnish may be utilized in computer matching programs with other Federal
      or state agencies for the purpose of determining your eligibility to
      receive VA benefits, as well as to collect any amount owed to the United
      States by virtue of your participation in any benefit program administered
      by the Department of Veterans Affairs.
    </p>
    <p>
      <strong>RESPONDENT BURDEN:</strong> We need this information to determine
      continued eligibility for an additional allowance for your spouse and/or
      child(ren). <br /> 38 U.S.C. 1115, Title 38, United States Code, allows us
      to ask for this information. We estimate that you will need an average of
      10 minutes to review the instructions, find the information and complete
      this form. <br /> VA cannot conduct or sponsor a collection of information
      unless a valid OMB control number is displayed. Valid OMB control numbers
      can be located on the OMB Internet page at{' '}
      <va-link
        text="www.reginfo.gov/public/do/PRAMain"
        href="www.reginfo.gov/public/do/PRAMain"
      />
      <br />
      If desired, you may call 1-800-827-1000 to get information on where to
      send comments or suggestions about this form.
    </p>
  </>
);
