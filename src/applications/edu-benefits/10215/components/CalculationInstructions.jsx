import React from 'react';
import PropTypes from 'prop-types';
import NeedHelp from './NeedHelp';
import Breadcrumbs from './Breadcrumbs';

export const CalculationInstructions = () => {
  return (
    <div className="vads-l-grid-container vads-u-margin-top--4">
      <div className="desktop-lg:vads-u-padding-left--0">
        <Breadcrumbs />
      </div>
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
      <div className="bottom-border">
        <h2 className="vads-u-margin-top--2">
          Number of supported students FTE
        </h2>
        <ul className="vads-u-margin-left--2 list-style">
          <li>
            Provide the number of Supported Students for identified approved
            program.
          </li>
          <li>
            You must compute the full-time equivalency for part-time students
            based on the total number of hours in which the student is enrolled
            for the term and add it to the number of full-time students. A
            student is counted as a full-time or part-time student under each
            approved program, concentration or track based on the student’s
            overall rate of pursuit or overall training time.{' '}
            <strong>Example:</strong> Take the total number of one-half time
            students, divide by two, and add the quotient to the number of
            full-time students.
          </li>
        </ul>
        <p>
          <strong>Note:</strong> If the student is receiving multiple types of
          aid and any of it is Supported, the student must be counted as a
          Supported Student.
        </p>
      </div>
      <div className="bottom-border">
        <h2 className="vads-u-margin-top--2">
          Number of non-supported students FTE
        </h2>
        <ul className="vads-u-margin-left--2 list-style">
          <li>
            Provide the number of Non-Supported Students for identified approved
            program.
          </li>
          <li>
            You must compute the full-time equivalency for part-time students
            based on the total number of hours in which the student is enrolled
            for the term and add it to the number of full-time students. A
            student is counted as a full-time or part-time student under each
            approved program, concentration or track based on the student’s
            overall rate of pursuit or overall training time. Example: Take the
            total number of one-half time students, divide by two, and add the
            quotient to the number of full-time students.
          </li>
        </ul>
        <p>
          A student must be considered a "Non-Supported Student" when any of the
          following conditions are met:
        </p>
        <ul className="vads-u-margin-left--2 list-style">
          <li>
            Any student who pays the full amount of tuition, fees, and other
            mandatory charges to the school prior to the reporting date (i.e.,
            within 30 days of the beginning of the term if the school is
            term-based or within 30 days of the end of the quarter if the school
            is non-term-based).
          </li>
          <li>
            Any student participating in a <strong>compliant</strong>{' '}
            institutionally funded payment plan that meets <strong>ALL</strong>{' '}
            the following criteria:
            <ul className="list-style">
              <li>
                The payment plan policy is published in the school’s approved
                catalog.
              </li>
              <li>
                The payment plan is generally applicable to all students
                interested in applying for such plans (although every student
                may not be guaranteed acceptance into such an installment plan).
              </li>
              <li>
                The payment plan explicitly requires the student to pay the
                outstanding balance no later than 180 days from the end of the
                term, quarter, semester, or enrollment period, whichever is
                later.
              </li>
              <li>
                The school’s policy prevents the student from continuing to
                train for the next term beginning on or after the expiration of
                the payment plan until the outstanding balance is paid in full.
              </li>
            </ul>
          </li>
          <li>Any student receiving Title IV Department of Education aid.</li>
          <li>
            Any student receiving Tuition Assistance through the Department of
            Defense.
          </li>
          <li>
            Any student receiving non-institutional aid (scholarships, grants,
            or other types of aid offered by a third-party entity not affiliated
            with the school).{' '}
          </li>
          <li>Graduate students in receipt of institutional aid.</li>
          <li>
            Any student receiving an institutionally funded loan, scholarship,
            or grant, if the policy for determining the recipient of such aid is
            equal with respect to veterans and non-veterans alike.
          </li>
          <li>
            Any student who is granted any waiver or forgiveness of tuition,
            fees, or other charges, where the institutional policy for
            determining the recipient of such aid is equal with respect to
            Veterans and nonveterans alike (i.e., restricted aid), excluding
            graduate students.
          </li>
        </ul>
      </div>
      <div className="bottom-border">
        <h2 className="vads-u-margin-top--2">
          Total enrollment FTE - Calculated for you
        </h2>
        <p>
          The result of students provided in the Number of Supported Students
          FTE added to the Number of NonSupported Students FTE.
        </p>
      </div>
      <div>
        <h2 className="vads-u-margin-top--2">
          Supported student percentage FTE - Calculated for you
        </h2>
        <p>
          The result of students provided in the Number of Supported Students
          FTE (Column 5D), divided by the Total Enrolled FTE.
        </p>
      </div>
      <NeedHelp />
    </div>
  );
};

CalculationInstructions.propTypes = {
  props: PropTypes.shape({
    router: PropTypes.shape({
      location: PropTypes.shape({
        pathname: PropTypes.string,
      }),
    }),
  }),
};
