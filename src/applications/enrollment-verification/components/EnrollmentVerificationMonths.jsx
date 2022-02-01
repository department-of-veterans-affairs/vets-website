import React from 'react';

export default function EnrollmentVerificationMonths(
  // eslint-disable-next-line no-empty-pattern
  {
    /* months */
  },
) {
  return (
    <>
      <div className="ev-enrollment-month">
        <hr />
        <h3>January 2022</h3>
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

      <div className="ev-enrollment-month">
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
      </div>
    </>
  );
}
