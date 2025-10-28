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
    <h3>Required documents</h3>
    <va-accordion>
      <va-accordion-item bordered header="Verification of Veteran’s death">
        <p>
          You’ll need to submit a death certificate for the Veteran, clearly
          showing the primary cause(s) of death and any contributing factors or
          conditions.
        </p>
        <p>
          <strong>Note:</strong> If the veteran’s death certificate lists the
          cause of death as "Pending," please have the medical examiner submit
          evidence that shows the cause of death.
        </p>
      </va-accordion-item>

      <va-accordion-item bordered header="Service verification">
        <p>
          You’ll need to submit a copy of the Veteran’s DD Form 214 or
          equivalent for all periods of military service. This must show
          military service dates, type of service, and character of discharge.
        </p>
      </va-accordion-item>
    </va-accordion>

    <h3 className="vads-u-margin-top--4">Other documents you may need</h3>
    <va-accordion>
      <va-accordion-item bordered header="Income and net worth">
        <p>
          If instructed in Step 6 when giving financial information, you’ll need
          to submit:
        </p>
        <ul>
          <li>
            Income and Asset Statement in Support of Claim for Pension or
            Parents’ Dependency and Indemnity Compensation (VA Form 21P-0969)
            <br />
            <va-link
              href="https://www.va.gov/find-forms/about-form-21p-0969"
              external
              text="Get VA Form 21P-0969 to download (opens in a new tab)"
            />
          </li>
        </ul>

        <p>
          If you have specific types of income or assets, the VA Form 21P-0969
          requires additional evidence:
        </p>
        <ul>
          <li>
            <strong>Farm</strong> income or assets requires a Pension Claim
            Questionnaire for Farm Income (VA Form 21P-4165)
            <br />
            <va-link
              href="https://www.va.gov/find-forms/about-form-21p-4165"
              external
              text="Get VA Form 21P-4165 to download (opens in a new tab)"
            />
          </li>
          <li>
            <strong>Business or rental property</strong> income or assets
            requires a Report of Income from Property or Business (VA Form
            21P-4185)
            <br />
            <va-link
              href="https://www.va.gov/find-forms/about-form-21p-4185"
              external
              text="Get VA Form 21P-4185 to download (opens in a new tab)"
            />
          </li>
          <li>
            <strong>Royalties</strong> income or assets requires a Statement in
            Support of Claim (VA Form 21-4138). You’ll need to provide details,
            such as Royalty source, joint owners, etc.
            <br />
            <va-link
              href="https://www.va.gov/find-forms/about-form-21p-4138"
              external
              text="Get VA Form 21-4138 to download (opens in a new tab)"
            />
          </li>
          <li>
            <strong>Trust</strong> income or assets requires you to submit
            complete Trust documents to include the Schedule of Assets.
          </li>
          <li>
            <strong>Interest, Dividends or Financial Investments</strong> income
            or assets may require you to submit current account statements from
            a financial institution, such as a bank, investment, annuity, etc.
          </li>
        </ul>
      </va-accordion-item>
      <va-accordion-item
        bordered
        header="Special circumstances regarding your medical care"
      >
        <p>
          If any of these circumstances apply to you, you’ll need to submit the
          documents listed:
        </p>

        <h4>
          Claim for Special Monthly Pension (SMP) - Aid and Attendance or
          Household Status
        </h4>
        <ul>
          <li>
            Examination for Housebound Status or Permanent Need for Regular Aid
            and Attendance (VA Form 21-2680)
            <br />
            <va-link
              href="https://www.va.gov/find-forms/about-form-21-2680"
              external
              text="Get VA Form 21-2680 to download (opens in a new tab)"
            />
          </li>
        </ul>

        <h4>
          Claim for Medicare Nursing Home and/or $90.00 Rate Reduction Request
        </h4>
        <ul>
          <li>
            Request for Nursing Home Information in Connection with Claim for
            Aid and Attendance (VA Form 21-0779)
            <br />
            <va-link
              href="https://www.va.gov/find-forms/about-form-21-0779"
              external
              text="Get VA Form 21-0779 to download (opens in a new tab)"
            />
          </li>
        </ul>

        <h4>Claim for Fiduciary Assistance</h4>
        <ul>
          <li>
            Examination for Housebound Status or Permanent Need for Regular Aid
            and Attendance (VA Form 21-2680)
            <br />
            <va-link
              href="https://www.va.gov/find-forms/about-form-21-2680"
              external
              text="Get VA Form 21-2680 to download (opens in a new tab)"
            />
          </li>
        </ul>

        <h4>Statement of Medical Care</h4>
        <ul>
          <li>
            If you’re claiming expenses for a residential care facility, you’ll
            need to submit a Worksheet for a Residential Care, Adult Daycare, or
            Similar Facility from VA Form 21-534EZ
            <br />
            <va-link
              href="https://www.va.gov/find-forms/about-form-21-534ez"
              external
              text="Get VA Form 21-534EZ to download (opens in a new tab)"
            />
          </li>
          <li>
            If you’re claiming expenses for an in-home care attendant, you’ll
            need to submit a Worksheet for In-Home Attendant from VA Form
            21-534EZ
            <br />
            <va-link
              href="https://www.va.gov/find-forms/about-form-21-534ez"
              external
              text="Get VA Form 21-534EZ to download (opens in a new tab)"
            />
          </li>
          <li>
            Proof of Payment from care provided, such as canceled checks, bank
            statements, etc.
          </li>
          <li>Signed verification from care service provider</li>
        </ul>
      </va-accordion-item>
      <va-accordion-item bordered header="Dependent children">
        <p>If you have dependent children, you’ll need to submit:</p>
        <ul>
          <li>
            A birth certificate that clearly shows the Veteran as the parent if
            you do not reside within the U.S. or its territories
          </li>
          <li>
            An adoption decree or a revised birth certificate if children are
            adopted
          </li>
          <li>
            A Request for Approval of School Attendance (VA Form 21-674) if your
            child is over 18 but under 23
            <br />
            <va-link
              href="https://www.va.gov/find-forms/about-form-21-674"
              external
              text="Get VA Form 21-674 to download (opens in a new tab)"
            />
          </li>
          <li>Medical records for each seriously disabled child</li>
          <li>
            An Application Request to Add and/or Remove Dependents (VA Form
            21-686c) if you have more than 3 dependents to report
            <br />
            <va-link
              href="https://www.va.gov/find-forms/about-form-21-686c"
              external
              text="Get VA Form 21-686c to download (opens in a new tab)"
            />
          </li>
        </ul>
      </va-accordion-item>
      <va-accordion-item bordered header="Unreimbursed medical expenses">
        <p>
          If you have more medical expenses to report, you’ll need to submit a
          Medical Expense Report (VA Form 21P-8416)
        </p>
        <va-link
          href="https://www.va.gov/find-forms/about-form-21p-8416"
          external
          text="Get VA Form 21P-8416 to download (opens in a new tab)"
        />
      </va-accordion-item>
      <va-accordion-item bordered header="Marriage history">
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
          <li>
            If you have more marriages to report, submit a Statement in Support
            of Claim (VA Form 21-4138)
            <br />
            <va-link
              href="https://www.va.gov/find-forms/about-form-21-4138"
              external
              text="Get VA Form 21-4138 to download (opens in a new tab)"
            />
          </li>
        </ul>
      </va-accordion-item>
    </va-accordion>
  </div>
);

const uiSchema = {
  ...titleUI('Supporting documents', Intro),
  'ui:description': Documents,
};

const schema = {
  type: 'object',
  properties: {},
};

export default {
  uiSchema,
  schema,
};
