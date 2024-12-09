import React from 'react';

export const CalculationInstructions = () => {
  return (
    <div>
      <h1 className="vads-u-margin-top--2">
        Calculation instructions for VA Form 22-10215: Statement of Assurance of
        Compliance with 85% Enrollment Ratios
      </h1>
      <p className="vads-u-color--gray-medium">
        Use these calculation instructions to help you accurately complete your
        form and ensure that the information reported to the VA is correct.
        Refer to this page as needed while filling out your form.
      </p>
      <div className="bottom-border">
        <h2 className="vads-u-margin-top--2">Program name</h2>
        <ul className="vads-u-margin-left--2 list-style">
          <li>
            Provide all approved programs as listed on your most recent WEAMS
            22-1998 Report. All programs must be listed, and calculations
            provided, even if the program has a Supported Student or Total
            Enrollment of “0”.
          </li>
          <li>
            Specific concentrations approved as part of a program, as defined in
            38 CFR §21.420(f)(2), require separate calculations. You must
            provide all concentrations requiring their own calculations on their
            own identifying line.
          </li>
          <li>
            For students taking more than one program, or concentration/track,
            which requires its own 85/15% calculation, they must be counted for
            each program in which they are enrolled. A student is counted as a
            full-time or part-time student under each approved program,
            concentration or track based on the student’s overall rate of
            pursuit or overall training time. For instance, a full-time student
            pursuing a dual degree program should be counted as a full-time
            student for both program entries.
          </li>
        </ul>
      </div>
      <div className="bottom-border">
        <h2 className="vads-u-margin-top--2">
          Total number of students enrolled in the program
        </h2>
        <ul className="vads-u-margin-left--2 list-style">
          <li>
            Enter the total number of students who are enrolled in the program.
          </li>
        </ul>
      </div>
      <div className="bottom-border">
        <h2 className="vads-u-margin-top--2">
          Total number of supported students enrolled in the program
        </h2>
        <p>
          Enter the total number of supported students who are enrolled in the
          program. If the total number of supported students is fewer than ten
          (10), no additional information is required for this listing. Move to
          the next approved program and/or variation.
        </p>
        <p>
          <strong>Note:</strong> If the student is receiving multiple types of
          aid and any of it is Supported, the student must be counted as a
          Supported Student.
        </p>
        <p>
          A student must be considered a "Supported Student" when any of the
          following conditions are met:
        </p>
        <ul className="vads-u-margin-left--2 list-style">
          <li>Any student receiving any amount of VA Education benefits.</li>
          <li>
            Any student who receives an institutionally funded scholarship or
            grant, if the institutional policy for determining the recipient of
            such aid is not equal with respect to veterans and non-veterans
            alike (excluding graduate students).
          </li>
          <li>
            Any student who is granted any waiver or forgiveness of tuition,
            fees, or other charges, where the institutional policy for
            determining the recipient of such aid is <strong>not</strong> equal
            with respect to Veterans and non-veterans alike (i.e., restricted
            aid), excluding graduate students.
          </li>
          <li>
            Any student who receives an institutionally funded scholarship or
            grant, if the institutional policy for determining the recipient of
            such aid is <strong>not</strong> equal with respect to veterans and
            non-veterans alike (excluding graduate students).
          </li>
          <li>
            Any student where the full amount of tuition and fees HAS NOT been
            paid to the school prior to the reporting date (i.e., within 30 days
            of the beginning of the term if the school is term-based or within
            30 days of the end of the quarter if the school is non-term-based),
            <strong>UNLESS </strong>
            the student is participating in a <strong>compliant</strong>{' '}
            institutionally funded payment plan. See the compliance requirements
            for an institutionally funded payment plan in the instructions for
            Block 5E.
          </li>
        </ul>
        <p>
          <strong>Note:</strong> If the student is receiving multiple types of
          aid and any of it is Supported, the student must be counted as a
          Supported Student.
        </p>
      </div>
    </div>
  );
};
