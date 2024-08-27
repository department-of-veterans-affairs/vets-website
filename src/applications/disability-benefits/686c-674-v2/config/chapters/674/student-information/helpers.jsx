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

export const benefitSchemaLabels = ['CH35', 'FRY', 'FECA', 'OTHER'];

export const benefitUiLabels = {
  CH35: 'Chapter 35 (also known as Dependent’s Educational Assistance program)',
  FRY: 'Fry Scholarship',
  FECA: 'Federal Employees’ Compensation Act (FECA)',
  OTHER: 'Another program',
};

export const ProgramExamples = (
  <>
    <p>Examples of federally funded programs or schools</p>
    <ul>
      <li>U.S Department of Labor’s Job Corps program</li>
      <li>Military academies</li>
      <li>Federally funded Native American schools</li>
    </ul>
  </>
);

// TODO: Find a better way.

export const StudentHeader = ({ formData, text = null }) => {
  const { first, last } = formData.fullName;

  return (
    <legend className="schemaform-block-title" id="root__title">
      <h3 className="vads-u-color--black vads-u-margin-top--0">
        {capitalize(first)} {capitalize(last)}
        {text}
      </h3>
    </legend>
  );
};

export const StudentInfoH3 = ({ formData }) => {
  const { first, last } = formData.fullName;

  return (
    <legend className="schemaform-block-title" id="root__title">
      <h3 className="vads-u-color--black vads-u-margin-top--0">
        {capitalize(first)} {capitalize(last)}
        ’s information
      </h3>
    </legend>
  );
};

export const StudentAddressH3 = ({ formData }) => {
  const { first, last } = formData.fullName;

  return (
    <legend className="schemaform-block-title" id="root__title">
      <h3 className="vads-u-color--black vads-u-margin-top--0">
        {capitalize(first)} {capitalize(last)}
        ’s address
      </h3>
    </legend>
  );
};

export const StudentMarriageH3 = ({ formData }) => {
  const { first, last } = formData.fullName;

  return (
    <legend className="schemaform-block-title" id="root__title">
      <h3 className="vads-u-color--black vads-u-margin-top--0">
        {capitalize(first)} {capitalize(last)}
        ’s marital status
      </h3>
    </legend>
  );
};

export const StudentEducationH3 = ({ formData }) => {
  const { first, last } = formData.fullName;

  return (
    <legend className="schemaform-block-title" id="root__title">
      <h3 className="vads-u-color--black vads-u-margin-top--0">
        {capitalize(first)} {capitalize(last)}
        ’s education benefits
      </h3>
    </legend>
  );
};

export const StudentEducationPaymentH3 = ({ formData }) => {
  const { first, last } = formData.fullName;

  return (
    <legend className="schemaform-block-title" id="root__title">
      <h3 className="vads-u-color--black vads-u-margin-top--0">
        {capitalize(first)} {capitalize(last)}
        ’s education benefit payments
      </h3>
    </legend>
  );
};

export const StudentProgramH3 = ({ formData }) => {
  const { first, last } = formData.fullName;

  return (
    <legend className="schemaform-block-title" id="root__title">
      <h3 className="vads-u-color--black vads-u-margin-top--0">
        {capitalize(first)} {capitalize(last)}
        ’s education program or school
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

export const StudentTermH3 = ({ formData }) => {
  const { first, last } = formData.fullName;

  return (
    <legend className="schemaform-block-title" id="root__title">
      <h3 className="vads-u-color--black vads-u-margin-top--0">
        {capitalize(first)} {capitalize(last)}
        ’s previous term
      </h3>
    </legend>
  );
};

export const StudentPrevTermDatesH3 = ({ formData }) => {
  const { first, last } = formData.fullName;

  return (
    <legend className="schemaform-block-title" id="root__title">
      <h3 className="vads-u-color--black vads-u-margin-top--0">
        {capitalize(first)} {capitalize(last)}
        ’s previous term dates
      </h3>
    </legend>
  );
};

export const StudentIncomeH3 = ({ formData }) => {
  const { first, last } = formData.fullName;

  return (
    <legend className="schemaform-block-title" id="root__title">
      <h3 className="vads-u-color--black vads-u-margin-top--0">
        {capitalize(first)} {capitalize(last)}
        ’s income
      </h3>
    </legend>
  );
};

export const StudentIncomeAtSchoolH3 = ({ formData }) => {
  const { first, last } = formData.fullName;

  return (
    <legend className="schemaform-block-title" id="root__title">
      <h3 className="vads-u-color--black vads-u-margin-top--0">
        {capitalize(first)} {capitalize(last)}
        ’s income in the year their current school term began
      </h3>
    </legend>
  );
};

export const StudentExpectedIncomeH3 = ({ formData }) => {
  const { first, last } = formData.fullName;

  return (
    <legend className="schemaform-block-title" id="root__title">
      <h3 className="vads-u-color--black vads-u-margin-top--0">
        {capitalize(first)} {capitalize(last)}
        ’s expected income next year
      </h3>
    </legend>
  );
};

export const StudentAssetsH3 = ({ formData }) => {
  const { first, last } = formData.fullName;

  return (
    <legend className="schemaform-block-title" id="root__title">
      <h3 className="vads-u-color--black vads-u-margin-top--0">
        {capitalize(first)} {capitalize(last)}
        ’s assets
      </h3>
    </legend>
  );
};
