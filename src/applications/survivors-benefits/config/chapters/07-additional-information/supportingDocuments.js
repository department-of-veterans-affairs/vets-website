import React from 'react';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';

const Intro = () => (
  <div>
    <p>
      Next we’ll ask you to submit evidence (supporting documents) for your
      claim. If you upload all of this information online now, you may be able
      to get a faster decision on your claim.
    </p>
  </div>
);

const Documents = () => (
  <div>
    <h4 className="vads-u-color--gray-dark">Required documents</h4>
    <va-accordion>
      <va-accordion-item
        level={5}
        bordered
        header="Veteran’s death certificate"
      >
        <p>
          You’ll need to submit a copy of the Veteran’s death certificate. It
          must clearly show the primary cause of death and any contributing
          factors or conditions.
        </p>
        <p>
          <strong>Note:</strong> If the Veteran’s death certificate lists the
          cause of death as "Pending," have the medical examiner submit evidence
          that shows the cause of death.
        </p>
      </va-accordion-item>

      <va-accordion-item
        level={5}
        bordered
        header="Veteran’s DD214 or separation documents"
      >
        <p>
          You’ll need to submit a copy of the Veteran’s DD Form 214 or
          equivalent for all periods of military service. It must show when they
          served, the type of service, and the character of their discharge.
        </p>
      </va-accordion-item>
    </va-accordion>

    <h4 className="vads-u-color--gray-dark">Other documents you may need</h4>
    <va-accordion>
      <va-accordion-item level={5} bordered header="Income and net worth">
        <p>
          If instructed in Step 6 when you provided financial information,
          you’ll need to submit an Income and Asset Statement in Support of
          Claim for Pension or Parents’ Dependency and Indemnity Compensation
          (VA Form 21P-0969).
        </p>
        <span className="vads-u-display--block">
          <va-link
            href="https://www.va.gov/find-forms/about-form-21p-0969"
            text="Get VA Form 21P-0969 to download"
            external
          />
        </span>
        <p>
          You’ll also need to submit additional evidence for specific types of
          income or assets:
        </p>
        <ul>
          <li>
            <strong>Farm</strong> income or assets require a Pension Claim
            Questionnaire for Farm Income (VA Form 21P-4165)
            <span className="vads-u-display--block">
              <va-link
                href="https://www.va.gov/find-forms/about-form-21p-4165"
                external
                text="Get VA Form 21P-4165 to download"
              />
            </span>
          </li>
          <li>
            <strong>Rental property or business</strong> income or assets
            require a Report of Income from Property or Business (VA Form
            21P-4185)
            <span className="vads-u-display--block">
              <va-link
                href="https://www.va.gov/find-forms/about-form-21p-4185"
                external
                text="Get VA Form 21P-4185 to download"
              />
            </span>
          </li>
          <li>
            <strong>Royalties</strong> require an Income and Asset Statement in
            Support of Claim for Pension or Parents' Dependency and Indemnity
            Compensation (DIC) (VA Form 21P-0969)
            <span className="vads-u-display--block">
              <va-link
                href="https://www.va.gov/find-forms/about-form-21p-0969/"
                external
                text="Get VA Form 21P-0969 to download"
              />
            </span>
          </li>
          <li>
            <strong>Trust</strong> income or assets require you to submit
            complete trust documents, including the schedule of assets
          </li>
        </ul>
      </va-accordion-item>
      <va-accordion-item
        level={5}
        bordered
        header="Special circumstances regarding your medical care"
      >
        <p>
          If any of these circumstances apply to you, you’ll need to submit the
          documents listed:
        </p>

        <p className="vads-u-font-weight--bold">
          Claim for Special Monthly Pension (SMP) - Aid and Attendance or
          Housebound Status
        </p>
        <p>
          Examination for Housebound Status or Permanent Need for Regular Aid
          and Attendance (VA Form 21-2680)
        </p>
        <span className="vads-u-display--block">
          <va-link
            href="https://www.va.gov/find-forms/about-form-21-2680"
            external
            text="Get VA Form 21-2680 to download"
          />
        </span>
        <p className="vads-u-font-weight--bold">
          Claim for Medicare Nursing Home and/or $90.00 Rate Reduction Request
        </p>
        <p>
          Request for Nursing Home Information in Connection with Claim for Aid
          and Attendance (VA Form 21-0779)
        </p>
        <span className="vads-u-display--block">
          <va-link
            href="https://www.va.gov/find-forms/about-form-21-0779"
            external
            text="Get VA Form 21-0779 to download"
          />
        </span>
        <p className="vads-u-font-weight--bold">
          Claim for Fiduciary Assistance
        </p>
        <p>
          Examination for Housebound Status or Permanent Need for Regular Aid
          and Attendance (VA Form 21-2680)
        </p>
        <span className="vads-u-display--block">
          <va-link
            href="https://www.va.gov/find-forms/about-form-21-2680"
            external
            text="Get VA Form 21-2680 to download"
          />
        </span>
        <p className="vads-u-font-weight--bold">Statement of Medical Care</p>
        <ul>
          <li>
            If you’re claiming expenses for a residential care facility, you’ll
            need to submit a Worksheet for a Residential Care, Adult Daycare, or
            Similar Facility from the PDF version of VA Form 21P-534EZ
            <span className="vads-u-display--block">
              <va-link
                href="https://www.va.gov/find-forms/about-form-21p-534ez"
                external
                text="Get VA Form 21P-534EZ to download"
              />
            </span>
          </li>
          <li>
            If you’re claiming expenses for an in-home care attendant, you’ll
            need to submit a Worksheet for In-Home Attendant from the PDF
            version of VA Form 21P-534EZ
            <span className="vads-u-display--block">
              <va-link
                href="https://www.va.gov/find-forms/about-form-21p-534ez"
                external
                text="Get VA Form 21P-534EZ to download"
              />
            </span>
          </li>
          <li>
            Proof of payment from care provided, such as canceled checks or bank
            statements
          </li>
          <li>Signed verification from care service provider</li>
        </ul>
      </va-accordion-item>
      <va-accordion-item level={5} bordered header="Dependent children">
        <p>If you have dependent children, you’ll need to submit:</p>
        <ul>
          <li>
            <strong>If you don’t live in the U.S. or its territories</strong>, a
            birth certificate that shows the Veteran as the parent
          </li>
          <li>
            <strong>If children are adopted</strong>, an adoption decree or a
            revised birth certificate
          </li>
          <li>
            <strong>If your child is over 18 but under 23</strong>, a Request
            for Approval of School Attendance (VA Form 21-674)
            <span className="vads-u-display--block">
              <va-link
                href="https://www.va.gov/find-forms/about-form-21-674"
                external
                text="Get VA Form 21-674 to download"
              />
            </span>
          </li>
          <li>
            <strong>If you have more than 3 dependents to report</strong>, an
            Application Request to Add and/or Remove Dependents (VA Form
            21-686c)
            <span className="vads-u-display--block">
              <va-link
                href="https://www.va.gov/find-forms/about-form-21-686c"
                external
                text="Get VA Form 21-686c to download"
              />
            </span>
          </li>
          <li>Medical records for each seriously disabled child</li>
        </ul>
      </va-accordion-item>
      <va-accordion-item level={5} bordered header="Marriage history">
        <p>
          If you are claiming benefits as a surviving spouse, you may need to
          submit these documents:
        </p>
        <ul>
          <li>Marriage license or proof of marriage</li>
          <li>Divorce decree</li>
          <li>
            If you were separated from the Veteran due to a court order, you’ll
            need to submit a copy of the court order
          </li>
        </ul>
      </va-accordion-item>
    </va-accordion>
  </div>
);

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Supporting documents', Intro),
    'ui:description': Documents,
  },
  schema: {
    type: 'object',
    properties: {},
  },
};
