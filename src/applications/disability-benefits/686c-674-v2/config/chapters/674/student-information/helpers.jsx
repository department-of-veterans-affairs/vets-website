import React from 'react';
import { capitalize } from 'lodash';

export const NotificationText = () => (
  <div>
    <p className="vads-u-margin-top--0">
      You’re adding one or more unmarried children between ages 18 and 23 who
      attend school. You’ll need to complete this section of the form, equal to
      a Request for Approval of School Attendance (VA Form 21-674).
    </p>
    <p>
      <strong>
        If we asked you to enter this information in a previous section
      </strong>
      , you’ll need to enter it again.
    </p>
  </div>
);

export const benefitSchemaLabels = ['ch35', 'fry', 'feca', 'other'];

export const benefitUiLabels = {
  ch35: 'Chapter 35 (also known as Dependent’s Educational Assistance program)',
  fry: 'Fry Scholarship',
  feca: 'Federal Employees’ Compensation Act (FECA)',
  other: 'Another program',
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
    <a
      href="https://ope.ed.gov/dapip/#/home"
      rel="noopener noreferrer"
      aria-label="Go to the U.S. Department of Education’s website (opens in new tab)"
      target="_blank"
    >
      Go to the U.S. Department of Education’s website (opens in new tab)
    </a>
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

// TODO: Find a better way to do this. Repeats multiple times - still working on a solution from within arrays

const formatPossessive = (first, last) => {
  const lastNamePossessive = last.endsWith('s')
    ? `${capitalize(last)}’`
    : `${capitalize(last)}’s`;
  return `${capitalize(first)} ${lastNamePossessive}`;
};

export const StudentInfoH3 = ({ formData }) => {
  const { first, last } = formData.fullName;
  return (
    <legend className="schemaform-block-title" id="root__title">
      <h3 className="vads-u-color--black vads-u-margin-top--0">
        {formatPossessive(first, last)} information
      </h3>
    </legend>
  );
};

export const StudentAddressH3 = ({ formData }) => {
  const { first, last } = formData.fullName;
  return (
    <legend className="schemaform-block-title" id="root__title">
      <h3 className="vads-u-color--black vads-u-margin-top--0">
        {formatPossessive(first, last)} address
      </h3>
    </legend>
  );
};

export const StudentMarriageH3 = ({ formData }) => {
  const { first, last } = formData.fullName;
  return (
    <legend className="schemaform-block-title" id="root__title">
      <h3 className="vads-u-color--black vads-u-margin-top--0">
        {formatPossessive(first, last)} marital status
      </h3>
    </legend>
  );
};

export const StudentEducationH3 = ({ formData }) => {
  const { first, last } = formData.fullName;
  return (
    <legend className="schemaform-block-title" id="root__title">
      <h3 className="vads-u-color--black vads-u-margin-top--0">
        {formatPossessive(first, last)} education benefits
      </h3>
    </legend>
  );
};

export const StudentProgramH3 = ({ formData }) => {
  const { first, last } = formData.fullName;
  return (
    <legend className="schemaform-block-title" id="root__title">
      <h3 className="vads-u-color--black vads-u-margin-top--0">
        {formatPossessive(first, last)} education program or school
      </h3>
    </legend>
  );
};

export const StudentAdditionalInfoH3 = ({ formData }) => {
  const { first, last } = formData.fullName;
  return (
    <legend className="schemaform-block-title" id="root__title">
      <h3 className="vads-u-color--black vads-u-margin-top--0">
        Additional information for {capitalize(first)} {capitalize(last)}
      </h3>
    </legend>
  );
};

export const StudentCurrentTermH3 = ({ formData }) => {
  const { first, last } = formData.fullName;
  return (
    <legend className="schemaform-block-title" id="root__title">
      <h3 className="vads-u-color--black vads-u-margin-top--0">
        {formatPossessive(first, last)} term dates
      </h3>
    </legend>
  );
};

export const StudentPrevTermH3 = ({ formData }) => {
  const { first, last } = formData.fullName;
  return (
    <legend className="schemaform-block-title" id="root__title">
      <h3 className="vads-u-color--black vads-u-margin-top--0">
        {formatPossessive(first, last)} previous term
      </h3>
    </legend>
  );
};

export const StudentIncomeAtSchoolH3 = ({ formData }) => {
  const { first, last } = formData.fullName;
  return (
    <legend className="schemaform-block-title" id="root__title">
      <h3 className="vads-u-color--black vads-u-margin-top--0">
        {formatPossessive(first, last)} income in the year their current school
        term began
      </h3>
    </legend>
  );
};

export const StudentExpectedIncomeH3 = ({ formData }) => {
  const { first, last } = formData.fullName;
  return (
    <legend className="schemaform-block-title" id="root__title">
      <h3 className="vads-u-color--black vads-u-margin-top--0">
        {formatPossessive(first, last)} expected income next year
      </h3>
    </legend>
  );
};

export const StudentAssetsH3 = ({ formData }) => {
  const { first, last } = formData.fullName;
  return (
    <legend className="schemaform-block-title" id="root__title">
      <h3 className="vads-u-color--black vads-u-margin-top--0">
        {formatPossessive(first, last)} assets
      </h3>
    </legend>
  );
};

export const RemarksH3 = () => {
  return (
    <legend className="schemaform-block-title" id="root__title">
      <h3 className="vads-u-color--black vads-u-margin-top--0">
        Additional information
      </h3>
    </legend>
  );
};
