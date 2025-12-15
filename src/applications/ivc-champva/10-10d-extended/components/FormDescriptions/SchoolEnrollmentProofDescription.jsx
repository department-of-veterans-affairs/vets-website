import React from 'react';
import PropTypes from 'prop-types';
import {
  applicantWording,
  nameWording,
  privWrapper,
} from '../../../shared/utilities';
import FileUploadDescription from './FileUploadDescription';

const SchoolEnrollmentProofDescription = ({ formData, formContext }) => {
  const itemIndex = Number(formContext?.pagePerItemIndex) || 0;
  const certifierRole = formData?.['view:certifierRole'];

  // For item 0, allow `you/your` wording if the certifier is the applicant.
  // For subsequent items, force `applicant` wording.
  const wordingSource = ({ isPossessive = true, capitalize = false } = {}) =>
    itemIndex === 0
      ? nameWording({ ...formData, certifierRole }, isPossessive, capitalize)
      : applicantWording(formData, isPossessive, capitalize);

  // Non-possessive (`you` or `Full Name`)
  const nonPossessiveText = wordingSource({ isPossessive: false });
  const nonPossessive = privWrapper(nonPossessiveText);

  // Possessive (`your/Applicant’s`)
  const possessiveLower = privWrapper(wordingSource());
  const possessiveCap = privWrapper(wordingSource({ capitalize: true }));

  // `You’re` vs `[Name] is` with a safe fallback if name is missing
  const nameBeingVerb =
    certifierRole === 'applicant' ? (
      'you’re'
    ) : (
      <>{nonPossessiveText?.trim() ? nonPossessive : 'the applicant'} is</>
    );

  return (
    <>
      <p>
        <strong>If {nameBeingVerb} already enrolled in school</strong>
      </p>
      <p>
        Ask the school for a letter on their letterhead that includes this
        information:
      </p>
      <ul>
        <li>
          {possessiveCap} first and last name, <strong>and</strong>
        </li>
        <li>
          Last 4 digits of {possessiveLower} Social Security number,{' '}
          <strong>and</strong>
        </li>
        <li>
          Start and end dates for each semester or enrollment term,{' '}
          <strong>and</strong>
        </li>
        <li>
          Enrollment status (full-time or part-time), <strong>and</strong>
        </li>
        <li>
          Expected graduation date, <strong>and</strong>
        </li>
        <li>
          Signature and title of a school official, such as director or
          principal
        </li>
      </ul>
      <p>
        <strong>If {nameBeingVerb} planning to enroll</strong>
      </p>
      <p>
        Submit a copy of {possessiveLower} acceptance letter from the school.
      </p>
      <FileUploadDescription />
    </>
  );
};

SchoolEnrollmentProofDescription.propTypes = {
  formContext: PropTypes.shape({
    pagePerItemIndex: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }),
  formData: PropTypes.shape({
    'view:certifierRole': PropTypes.string,
    applicantName: PropTypes.shape({
      first: PropTypes.string,
      middle: PropTypes.string,
      last: PropTypes.string,
      suffix: PropTypes.string,
    }),
  }),
};

export default SchoolEnrollmentProofDescription;
