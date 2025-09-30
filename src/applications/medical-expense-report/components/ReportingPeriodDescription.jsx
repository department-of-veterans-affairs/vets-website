import React from 'react';

export default function ReportingPeriodDescription() {
  return (
    <div>
      <p className="vads-u-margin-top--0">
        Add the specific date range your medical expenses were paid.
      </p>
      <p>
        Note: Submit separate forms if reporting information for additional date
        ranges beyond a 1-year period.
      </p>
      <va-additional-info trigger="How to determine dates">
        <p>
          If you are submitting an initial application, please only report
          medical expenses paid on or after your effective date. Your effective
          date is typically the earliest of the following dates:
        </p>
        <ul>
          <li>Date VA receives your initial application</li>
          <li>
            Date VA receives your VA Form 21-0966, Intent to File a Claim for
            Compensation and/or Pension, or Survivors Pension and/or D.I.C.
          </li>
          <li>
            Date of the veteran's death (for Survivors Pension, if within one
            year of the veteran's death)
          </li>
        </ul>
        <p>
          If you are already in receipt of pension benefits, report medical
          expenses you paid on a calendar year basis. If you are responding to a
          letter that identifies a specific date range, please report medical
          expenses you paid during the requested period(s).
        </p>
      </va-additional-info>
    </div>
  );
}
