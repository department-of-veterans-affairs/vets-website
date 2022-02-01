import React from 'react';

export default function EnrollmentVerificationMonths({ status }) {
  const months = status?.months?.map((month, index) => {
    return (
      <div className="ev-enrollment-month" key={index}>
        <hr />
        <h3>{month.month}</h3>
        <p>
          <i className="fas fa-exclamation-circle vads-u-color--secondary-dark" />{' '}
          Contact your School Certifying Official to update enrollment
          information
        </p>
        <va-additional-info trigger="More information">
          <p>
            <strong>[Start date] &ndash; [End date]</strong> at Wake Forest
            University School of Business
          </p>
          <p>
            <strong>Total credit hours:</strong> [#]
          </p>
          <p>
            <strong>[Start date] &ndash; [End date]</strong> at Adirondack
            Community College
          </p>
          <p>
            <strong>Total credit hours:</strong>
            [#]
          </p>
        </va-additional-info>
      </div>
    );
  });

  return (
    <>
      <h2>Your monthly enrollment verifications</h2>

      <va-additional-info trigger="What if I notice an error with my enrollment information?">
        <ul>
          <li>
            Work with your School Certifying Official (SCO) to make sure they
            have the correct enrollment information and can update the
            information on file.
          </li>
          <li>
            After your information is corrected, verify the corrected
            information.
          </li>
        </ul>
        <p>
          If you notice a mistake, it’s best if you reach out to your SCO soon.
          The sooner VA knows about changes to your enrollment, the less likely
          you are to be overpaid and incur a debt.
        </p>
      </va-additional-info>

      <p>
        Showing 1-10 of {months?.length} monthly enrollments listed by most
        recent
      </p>

      {months}

      {/* <div className="ev-enrollment-month">
        <hr />
        <h3>December 2021</h3>
        <p>
          <i className="fas fa-exclamation-circle vads-u-color--secondary-dark" />{' '}
          You need to verify this month
        </p>
        <a
          className="vads-c-action-link--blue"
          href="/enrollment-history/verify-enrollments"
        >
          Verify your enrollments
        </a>
        <va-additional-info trigger="More information">
          <p>
            <strong>[Start date] &ndash; [End date]</strong> at Wake Forest
            University School of Business
          </p>
          <p>
            <strong>Total credit hours:</strong> [#]
          </p>
          <p>
            <strong>[Start date] &ndash; [End date]</strong> at Adirondack
            Community College
          </p>
          <p>
            <strong>Total credit hours:</strong>
            [#]
          </p>
        </va-additional-info>
      </div>

      <div className="ev-enrollment-month">
        <hr />
        <h3>November 2021</h3>
        <p>
          <i className="fas fa-exclamation-triangle" /> You haven’t verified
          this month
        </p>
        <a
          className="vads-c-action-link--blue"
          href="/enrollment-history/verify-enrollments"
        >
          Verify your enrollments
        </a>
        <va-additional-info trigger="More information">
          <p>
            <strong>[Start date] &ndash; [End date]</strong> at Wake Forest
            University School of Business
          </p>
          <p>
            <strong>Total credit hours:</strong> [#]
          </p>
          <p>
            <strong>[Start date] &ndash; [End date]</strong> at Adirondack
            Community College
          </p>
          <p>
            <strong>Total credit hours:</strong>
            [#]
          </p>
        </va-additional-info>
      </div>

      <div className="ev-enrollment-month">
        <hr />
        <h3>October 2021</h3>
        <p>
          <i className="fa fa-check-circle vads-u-color--green" /> You verified
          this month
        </p>
        <va-additional-info trigger="More information">
          <p>
            <strong>[Start date] &ndash; [End date]</strong> at Wake Forest
            University School of Business
          </p>
          <p>
            <strong>Total credit hours:</strong> [#]
          </p>
          <p>
            <strong>[Start date] &ndash; [End date]</strong> at Adirondack
            Community College
          </p>
          <p>
            <strong>Total credit hours:</strong>
            [#]
          </p>
        </va-additional-info>
      </div>

      <div className="ev-enrollment-month">
        <hr />
        <h3>September 2021</h3>
        <p>
          <i className="fa fa-check-circle vads-u-color--green" /> You verified
          this month
        </p>
        <va-additional-info trigger="More information">
          <p>
            <strong>[Start date] &ndash; [End date]</strong> at Wake Forest
            University School of Business
          </p>
          <p>
            <strong>Total credit hours:</strong> [#]
          </p>
          <p>
            <strong>[Start date] &ndash; [End date]</strong> at Adirondack
            Community College
          </p>
          <p>
            <strong>Total credit hours:</strong>
            [#]
          </p>
        </va-additional-info>
      </div> */}
    </>
  );
}
