import React from 'react';

export const StudentNameHeader = ({ formData }) => {
  const { first, last } = formData.studentNameAndSSN.fullName;
  return (
    <div>
      <p className="vads-u-font-weight--bold vads-u-font-size--h3 vads-u-border-bottom--2px vads-u-border-color--primary vads-u-font-family--serif">
        {first.toUpperCase()} {last.toUpperCase()}
      </p>
    </div>
  );
};

export const AddStudentsIntro = () => (
  <div>
    <p className="vads-u-margin-top--0">
      In the next few questions, we’ll ask you about your{' '}
      <strong>
        unmarried children between ages 18 and 23 who attend school
      </strong>
      . You’ll need to complete this section of the form, equal to a Request for
      Approval of School Attendance (VA Form 21-674).
    </p>
    <p>
      You must add at least one student. You may add up to 7 students.{' '}
      <strong>
        If we asked you to enter this information in a previous section
      </strong>
      , you’ll need to enter it again.
    </p>
  </div>
);
