import React from 'react';

import { formatDate } from '../utils/helpers';

const StemDeniedDetails = ({ deniedAt }) => {
  const date = formatDate(deniedAt);

  return (
    <>
      <h1>Your Edith Nourse Rogers STEM Scholarship Application</h1>
      <div className="vads-u-background-color--primary-alt-lightest vads-u-padding--2 vads-u-margin-bottom--3">
        <h3 className="claims-alert-header vads-u-font-size--h4">
          Your application was denied on {date}.
        </h3>
      </div>
      <h2 className="vads-u-font-family--sans vads-u-margin-y--0">
        Why we denied your claim
      </h2>
      <p className="vads-u-margin--0">
        You must meet all 3 of the eligibility criteria to be considered for the
        Rogers STEM Scholarship.
      </p>
      <h3 className="vads-u-font-family--sans vads-u-margin-bottom--0">
        You did not meet these criteria for the Rogers STEM Scholarship:
      </h3>
      <ul className="stem-ad-list">
        <li className="stem-ad-list-item">
          You don’t meet the benefit requirements for the Rogers STEM
          Scholarship
          <ul className="stem-ad-list-secondary">
            <li className="stem-ad-list-item">
              By law, all Rogers STEM Scholarship recipients must have 6 months
              or less of Post 9/11 GI Bill (Chapter 33) benefits left (38 U.S.
              Code § 3320).
            </li>
            <li className="stem-ad-list-item">
              We reviewed your service and school data records currently on
              file. As of [{date}
              ], you have more than 6 months of Post 9/11 GI Bill (Chapter 33)
              benefits remaining.
            </li>
          </ul>
        </li>
      </ul>
      <h3 className="vads-u-font-family--sans vads-u-margin-bottom--0">
        You met these criteria for the Rogers STEM Scholarship:
      </h3>
      <ul className="stem-ad-list">
        <li className="stem-ad-list-item">
          You are eligible for Post 9/11 GI Bill benefits
          <ul className="stem-ad-list-secondary">
            <li className="stem-ad-list-item">
              By law, all Rogers STEM scholarship recipients must be eligible
              for Post 9/11 GI Bill (Chapter 33) benefits. (38 U.S. Code §
              3320).
            </li>
            <li className="stem-ad-list-item">
              We reviewed your service and school data records currently on
              file. As of [{date}
              ], you are eligible for Post 9/11 GI Bill benefits.
            </li>
          </ul>
        </li>
      </ul>
      <h3 className="vads-u-font-family--sans">
        What you should do if you disagree with our decision
      </h3>
      <p>
        If you disagree with our decision, you have 1 year from the date of this
        letter to request a decision review or appeal. You have 3 options to do
        this:
      </p>
      <ul className="stem-ad-list">
        <li className="stem-ad-list-item">
          If you have new or previously unprovided evidence to prove your
          eligibility for this scholarship, you can file a Supplemental Claim by
          completing VA Form 20-0995.{' '}
          <a href="https://www.va.gov/find-forms/about-form-20-0995/">
            Download VA Form 20-0995.
          </a>
        </li>
        <li className="stem-ad-list-item">
          If you don't have new evidence but would like a more senior reviewer
          to look at your case, you can request a Higher-Level Review by
          completing VA Form 20-0996.{' '}
          <a href="https://www.va.gov/find-forms/about-form-20-0996/">
            Download VA Form 20-0996.
          </a>
        </li>
        <li className="stem-ad-list-item">
          If you don't agree with the decision on your Supplemental Claim or
          Higher-Level Review, you can appeal to a Veterans Law Judge by
          completing VA Form 10182.{' '}
          <a href="https://www.va.gov/find-forms/about-form-10182/">
            Download VA Form 10182.
          </a>
        </li>
      </ul>
      <p>
        You can read more about these options on VA Form 20-0998, "Your Rights
        to Seek Further Review of Our Decisions".{' '}
        <a href="https://www.va.gov/find-forms/about-form-20-0998/">
          Download VA Form 20-0998
        </a>
        . You can also contact us at (888) GI BILL 1 (888-442-4551) to request
        any of these forms.
      </p>
      <p>
        <a href="https://www.va.gov/decision-reviews">
          Learn more about the decision review process.
        </a>{' '}
        If you would like to review the evidence we used in our decision, please
        contact us. You may be able to review some evidence by signing in to
        your account on <a href="https://www.va.gov/">https://www.va.gov</a>.
      </p>
      <h3 className="vads-u-font-family--sans">More resources</h3>
      <table>
        <thead>
          <tr>
            <th scope="col">Website</th>
            <th scope="col">Link</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Rogers STEM Scholarship</th>
            <td>
              <a href="https://www.va.gov/education/other-va-education-benefits/stem-scholarship/">
                https://www.va.gov/education/other-va-education-benefits/stem-scholarship/
              </a>
            </td>
          </tr>
          <tr>
            <th scope="row">VA Forms</th>
            <td>
              <a href="https://www.va.gov/vaforms">
                https://www.va.gov/vaforms
              </a>
            </td>
          </tr>
          <tr>
            <th scope="row">
              GI Bill® Comparison Tool: This tool allows you to get information
              on a school’s value and affordability; and to compare estimated
              benefits by school.
            </th>
            <td>
              <a href="https://www.va.gov/gi-bill-comparison-tool">
                https://www.va.gov/gi-bill-comparison-tool
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default StemDeniedDetails;
