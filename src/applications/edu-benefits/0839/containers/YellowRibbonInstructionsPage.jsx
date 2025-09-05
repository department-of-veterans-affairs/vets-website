import React, { useEffect } from 'react';
import { focusElement, scrollToTop } from 'platform/utilities/ui';

const YellowRibbonInstructionsPage = () => {
  useEffect(() => {
    scrollToTop();
    focusElement('h1');
  }, []);

  return (
    <div className="vads-l-grid-container vads-u-margin-top--4 vads-u-padding-x--0">
      <h1>Instructions for completing the Yellow Ribbon Program agreement</h1>

      <p className="vads-u-margin-top--2">
        Please read through the instructions before completing the Yellow Ribbon
        Program Agreement. If you have any issues completing the form, please
        send an email to{' '}
        <a href="mailto:Yellow.Ribbon@va.gov">Yellow.Ribbon@va.gov</a> with any
        inquiries.
      </p>

      <h2 className="vads-u-margin-top--4">General eligibility</h2>
      <p>
        The institution must be an Institution of Higher Learning (IHL) that
        offers programs of education approved for VA benefits. U.S. schools are
        defined as those located in the United States or as a branch campus of
        such institution located outside of the United States. Foreign schools
        are eligible to participate as of August 1, 2021.
      </p>

      <h2 className="vads-u-margin-top--4">Name, title, and facility code</h2>
      <p>
        Enter your first and last name, official title at your institution, and
        your school’s facility code. You can also select any branch campuses or
        extension schools you want to include in this Yellow Ribbon Program
        agreement.
      </p>
      <p>
        <strong>Note:</strong> Any location with an "X" as the third character
        in its facility code will not be included in this agreement.
      </p>

      <h2 className="vads-u-margin-top--4">Select your agreement type</h2>
      <p>Choose one of the following options:</p>
      <ul>
        <li>Start a new open-ended agreement</li>
        <li>Modify an existing agreement</li>
      </ul>
      <p>
        Both of these options will require you to complete the entire form. If
        you are withdrawing from the Yellow Ribbon Program agreement, you will
        only need to provide your first and last name, official title, your
        school’s facility code, and any additional locations you want to
        withdraw.
      </p>

      <h2 className="vads-u-margin-top--4">Acknowledge program requirements</h2>
      <p>
        By signing and submitting this form to VA, your institution agrees to
        follow the provisions outlined in the acknowledgment section. As part of
        Step 1 and again in Step 4, please add your initials to each statement.
        This confirms your agreement to the terms listed in each item before
        completing and submitting the form.
      </p>

      <h2 className="vads-u-margin-top--4">
        Commitment to Yellow Ribbon Program contributions
      </h2>
      <p>
        Provide the total number of students for whom your institution will
        offer Yellow Ribbon Program contributions. This total must match the
        combined number of students listed in Step 2 of this form.
      </p>
      <p>
        Enter the academic year for which this agreement applies (e.g.,
        2020-2021).
      </p>
      <p>
        <strong>Note:</strong> For VA purposes, an academic year runs from
        August 1 to July 31.
      </p>
      <p>
        Your institution agrees to continue these contributions for all
        subsequent academic years unless VA is notified of changes during a
        future open-enrollment period.
      </p>

      <h2 className="vads-u-margin-top--4">
        U.S. schools only - Provide contribution details
      </h2>
      <p>
        For each specific Yellow Ribbon Program contribution, provide the
        following details:
      </p>
      <div className="vads-u-border--1 vads-u-border-color--primary ">
        <ul>
          <li>
            Maximum number of students: Enter the maximum number of eligible
            students. If your institution will offer contributions to an
            unlimited number of qualifying students, enter 'unlimited.'
          </li>
          <li>
            Degree level: Indicate the applicable degree level (undergraduate,
            graduate, doctoral, or all) for the specific contribution.
          </li>
          <li>
            College or professional school: You may leave this blank, or specify
            the sub-element of your institution (such as a college or
            professional school) in which students must be enrolled to receive
            the contribution.
            <br />
            Note: Do not list specific degree programs (e.g., Master of Business
            Administration, Juris Doctorate, Bachelor of Science in Nursing).
          </li>
          <li>
            Maximum contribution amount: Enter the maximum annual contribution
            amount per eligible student. Do not enter an amount per term or
            credit hour. If your institution will cover 50% of unmet established
            charges, select 'unlimited.'
          </li>
        </ul>
      </div>

      <h2 className="vads-u-margin-top--4">
        Foreign schools only - Provide contribution details
      </h2>
      <p>
        For each Yellow Ribbon Program contribution, provide the following
        information:
      </p>
      <div className="vads-u-border--1 vads-u-border-color--primary">
        <ul>
          <li>
            Maximum number of students: Enter the maximum number of eligible
            students. If your institution will offer contributions to an
            unlimited number of qualifying students, enter 'unlimited.'
          </li>
          <li>
            Degree level: Indicate the applicable degree level (undergraduate,
            graduate, doctoral, or all).
            <br />
            Note: You may not list specific degree programs (e.g., Master of
            Business Administration, Juris Doctorate, Bachelor of Science in
            Nursing).
          </li>
          <li>
            Currency used by school’s billing system: Specify the currency used
            for student billing. You may use the currency’s official name or its
            ISO 4217 code. Example: European Euro or EUR
          </li>
          <li>
            Maximum contribution amount: Enter the maximum annual contribution
            amount per eligible student in your school’s billing currency. Do
            not enter an amount by term or credit hour. If your institution will
            cover 50% of unmet tuition and fees, select 'unlimited.'
          </li>
        </ul>
      </div>
      <p className="vads-u-margin-top--2">
        <strong>Important Note:</strong> You must report your contributions in
        the official currency of record for your institution—not in U.S.
        dollars. The VA will convert this amount to U.S. dollars using the
        Federal Reserve exchange rate effective on July 1 preceding the relevant
        academic year, and will match up to 50% of the unmet tuition and fees.
      </p>

      <h2 className="vads-u-margin-top--4">
        Provide your school’s points of contact
      </h2>
      <p>
        Include contact information for the following individuals at your
        institution (first name, last name, phone number, and email address):
      </p>
      <div className="vads-u-border--1 vads-u-border-color--primary">
        <ul>
          <li>Yellow Ribbon Program Point of Contact</li>
          <li>School’s financial representative</li>
          <li>School Certifying Official (SCO)</li>
        </ul>
      </div>
      <p>
        This information ensures VA can reach the appropriate contacts regarding
        your institution’s Yellow Ribbon Program participation.
      </p>

      <h2 className="vads-u-margin-top--4">
        Signature of authorizing official
      </h2>
      <p>
        The individual signing this agreement must be legally authorized to bind
        your institution to the terms of this agreement with the VA. You must
        also provide their title, phone number, and the date of signature.
        Agreements will not be processed without a valid authorizing signature.
      </p>
      <p>
        By signing this agreement, your institution certifies that, as of the
        date signed, at least one VA-approved program at your institution
        charges tuition and/or fees that exceed the maximum amounts payable in
        your state or territory under the Post-9/11 GI Bill.
      </p>

      <h2 className="vads-u-margin-top--4">Submitting your completed form</h2>
      <p className="vads-u-margin-bottom--4">
        Once you complete all required steps, your form will submit
        automatically to the Yellow Ribbon team for review. Processing typically
        takes up to 30 days. The Yellow Ribbon team will contact the authorized
        official by email or phone with any updates. Please make sure the
        contact information you enter is accurate.
      </p>
    </div>
  );
};

YellowRibbonInstructionsPage.propTypes = {};

export default YellowRibbonInstructionsPage;
