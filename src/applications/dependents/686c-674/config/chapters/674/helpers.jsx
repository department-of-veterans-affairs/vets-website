import React from 'react';

export const AddStudentsIntro = (
  <>
    <p className="vads-u-margin-top--0">
      In the next few questions, we’ll ask you about your unmarried children
      between ages 18 and 23 who attend school. You’ll need to complete this
      section of the form, equal to a Request for Approval of School Attendance
      (VA Form 21-674).
    </p>
    <p>
      You must add at least one student.{' '}
      <strong>
        If we asked you to enter this information in a previous section
      </strong>
      , you’ll need to enter it again.
    </p>
  </>
);

export const benefitSchemaLabels = ['ch35', 'fry', 'feca', 'other'];

export const benefitUiLabels = {
  ch35: 'Chapter 35 (also known as Dependent’s Educational Assistance program)',
  fry: 'Fry Scholarship',
  feca: 'Federal Employees’ Compensation Act (FECA)',
  other: 'Another program',
};

export const relationshipToStudentLabels = {
  biological: 'They’re my biological child',
  stepchild: 'They’re my stepchild',
  adopted: 'They’re my adopted child',
};

export const ProgramExamples = (
  <va-additional-info trigger="Examples of federally funded programs or schools">
    <ul>
      <li>U.S Department of Labor’s Job Corps program</li>
      <li>Military academies</li>
      <li>Federally funded Native American schools</li>
    </ul>
  </va-additional-info>
);

export const AccreditedSchool = (
  <va-additional-info trigger="How to tell if a school is accredited">
    <p>
      You can go to the U.S. Department of Education’s website to check if a
      school is accredited.
    </p>
    <va-link
      href="https://ope.ed.gov/dapip/#/home"
      external
      text="Go to the U.S. Department of Education’s website"
    />
  </va-additional-info>
);

export const TermDateHint = (
  <va-additional-info
    className="vads-u-margin-top--2"
    trigger="What is a regular school term or course?"
  >
    <p>
      For example, if the student’s school uses semesters, tell us when the
      student’s current semester started. Or if the student’s school uses
      quarters, tell us when the student’s current quarter started.
    </p>
    <br />
    <p>
      If the student is currently on academic break between semesters, tell us
      when the student’s previous term started
    </p>
  </va-additional-info>
);

export const studentIncomeNote = (
  <p>
    <strong>Note:</strong> Don’t report VA benefits as income
  </p>
);

/**
 * @typedef {object} StudentNetworthInformation
 * @property {string} otherAssets - Other assets amount
 * @property {string} realEstate - Real estate amount
 * @property {string} savings - Savings amount
 * @property {string} securities - Securities amount
 *
 * @param {StudentNetworthInformation} studentNetworthInformation - Student networth info
 * @returns {number} Total student assets
 */
export const calculateStudentAssetTotal = (studentNetworthInformation = {}) => {
  const parseCurrency = value => {
    if (!value) return 0;
    return parseFloat(value) || 0;
  };

  return (
    parseCurrency(studentNetworthInformation.otherAssets) +
    parseCurrency(studentNetworthInformation.realEstate) +
    parseCurrency(studentNetworthInformation.savings) +
    parseCurrency(studentNetworthInformation.securities)
  ).toFixed(2);
};
