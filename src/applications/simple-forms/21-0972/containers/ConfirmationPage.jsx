import React from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';

import { ConfirmationPageView } from '../../shared/components/ConfirmationPageView';

const content = {
  headlineText: 'You’ve submitted your alternate signer certification',
  nextStepsText:
    'You may now sign other forms on behalf of the Veteran or non-Veteran claimant you identified in this form.',
};

const childContent = (
  <>
    <h2>Which benefit forms can I sign?</h2>
    <p>
      You may now sign other forms on behalf of the Veteran or non-Veteran
      claimant you identified in this form.
    </p>
    <va-accordion
      disable-analytics={{
        value: 'false',
      }}
      section-heading={{
        value: 'null',
      }}
    >
      <va-accordion-item header="Accrued benefits" id="first">
        <ul>
          <li>
            <a href="/find-forms/about-form-21p-601">VA Form 21P-601</a>,
            Application for Accrued Amounts Due a Deceased Beneficiary
          </li>
        </ul>
      </va-accordion-item>
      <va-accordion-item header="Appeals" id="second">
        <ul>
          <li>
            <a href="/find-forms/about-form-20-0995">VA Form 20-0995</a>,
            Decision Review Request: Supplemental Claim
          </li>
          <li>
            <a href="/find-forms/about-form-20-0996">VA Form 20-0996</a>,
            Decision Review Request: Higher-Level Review
          </li>
          <li>
            <a href="/find-forms/about-form-10182">VA Form 20-10182</a>,
            Decision Review Request: Board Appeal (Notice of Disagreement)
          </li>
        </ul>
      </va-accordion-item>
      <va-accordion-item header="Auto allowance" id="third">
        <ul>
          <li>
            <a href="/find-forms/about-form-21-4502">VA Form 21-4502</a>,
            Application for Automobile or Other Conveyance and Adaptive
            Equipment
          </li>
        </ul>
      </va-accordion-item>
      <va-accordion-item
        header="Benefits for certain children with disabilities"
        id="fourth"
      >
        <ul>
          <li>
            <a href="/find-forms/about-form-21-0304">VA Form 21-0304</a>,
            Application for Benefits for a Qualifying Veteran’s Child Born with
            Disabilities
          </li>
        </ul>
      </va-accordion-item>
      <va-accordion-item header="Compensation" id="fifth">
        <ul>
          <li>
            <a href="/find-forms/about-form-21-526ez">VA Form 21-526EZ</a>,
            Application for Disability Compensation and Related Compensation
            Benefits
          </li>
        </ul>
      </va-accordion-item>
      <va-accordion-item header="Compensation and/or Pension" id="sixth">
        <ul>
          <li>
            <a href="/find-forms/about-form-21-0966">VA Form 21-0966</a>, Intent
            to File a Claim for Compensation and/or Pension, or Survivors
            Pension and/or DIC
          </li>
        </ul>
      </va-accordion-item>
      <va-accordion-item header="Dependents" id="seventh">
        <ul>
          <li>
            <a href="/find-forms/about-form-21-686c">VA Form 21-686c</a>,
            Application Request to Add and/or Remove Dependents
          </li>
        </ul>
      </va-accordion-item>
      <va-accordion-item header="Dependent parent(s)" id="eighth">
        <ul>
          <li>
            <a href="/find-forms/about-form-21p-509">VA Form 21P-509</a>,
            Statement of Dependency of Parent(s)
          </li>
        </ul>
      </va-accordion-item>
      <va-accordion-item header="Individual unemployability" id="ninth">
        <ul>
          <li>
            <a href="/find-forms/about-form-21-8940">VA Form 21-8940</a>,
            Veteran’s Application for Increased Compensation Based on
            Unemployability
          </li>
        </ul>
      </va-accordion-item>
      <va-accordion-item header="Pension" id="tenth">
        <ul>
          <li>
            <a href="/find-forms/about-form-21p-527ez">VA Form 21P-527EZ</a>,
            Application for Pension
          </li>
          <li>
            <a href="/find-forms/about-form-21p-0969">VA Form 21P-0969</a>,
            Income and Asset Statement in Support of Claim for Pension or
            Parents' Dependency and Indemnity Compensation (DIC)
          </li>
          <li>
            <a href="/find-forms/about-form-21p-527">VA Form 21P-527</a>,
            Income, Net Worth, and Employment Statement
          </li>
          <li>
            <a href="/find-forms/about-form-21p-4165">VA Form 21P-4165</a>,
            Pension Claim Questionnaire for Farm Income
          </li>
          <li>
            <a href="/find-forms/about-form-21p-8416">VA Form 21P-8416</a>,
            Medical Expense Report
          </li>
          <li>
            <a href="/find-forms/about-form-21p-8049">VA Form 21P-8049</a>,
            Request for Details of Expenses
          </li>
          <li>
            <a href="/find-forms/about-form-21p-4185">VA Form 21P-4185</a>,
            Report of Income from Property or Business
          </li>
          <li>
            All forms known as{' '}
            <a href="find-forms/?q=Eligibility+Verification+Reports">
              Eligibility Verification Reports
            </a>{' '}
            (EVR’s)
          </li>
        </ul>
      </va-accordion-item>
      <va-accordion-item header="Posttramatic stress disorder" id="twelfth">
        <ul>
          <li>
            <a href="/find-forms/about-form-21-0781">VA Form 21-0781</a>,
            Statement in Support of Claim for Service Connection for
            Posttraumatic Stress Disorder (PTSD)
          </li>
          <li>
            <a href="/find-forms/about-form-21-0781a">VA Form 21-0781a</a>,
            Statement in Support of Claim for Service Connection for PTSD
            Secondary to Personal Assault
          </li>
        </ul>
      </va-accordion-item>
      <va-accordion-item
        header="School Age Child(ren) (Aged 18-23 Years and in School)"
        id="thirteenth"
      >
        <ul>
          <li>
            <a href="/find-forms/about-form-21-674">VA Form 21-674</a>, Request
            for Approval of School Attendance
          </li>
        </ul>
      </va-accordion-item>
      <va-accordion-item
        header="Specially adapted housing or special home adaptation"
        id="fourteenth"
      >
        <ul>
          <li>
            <a href="/find-forms/about-form-26-4555">
              Application in Acquiring Specially Adapted Housing or Special Home
              Adaptation Grant (VA Form 26-4555)
            </a>
          </li>
        </ul>
      </va-accordion-item>
      <va-accordion-item header="Survivor benefits" id="fifteenth">
        <ul>
          <li>
            <a href="/find-forms/about-form-21p-534ez">
              Application for DIC, Death Pension, and/or Accrued Benefit (VA
              Form 21P-534EZ)
            </a>
          </li>
          <li>
            <a href="/find-forms/about-form-21p-534">
              Application for Dependency and Indemnity Compensation, Death
              Pension, and Accrued Benefits by Surviving Spouse or Child (VA
              Form 21P-534)
            </a>
          </li>
          <li>
            <a href="/find-forms/about-form-21p-534a">
              Application for Dependency and Indemnity Compensation by a
              Surviving Spouse or Child - In-Service Death Only (VA Form
              21P-534a)
            </a>
          </li>
          <li>
            <a href="/find-forms/about-form-21p-535">
              Application for Dependency and Indemnity Compensation by Parent(s)
              (VA Form 21P-535)
            </a>
          </li>
          <li>
            <a href="/find-forms/about-form-21p-8924">
              Application of Surviving Spouse or Child for REPS Benefits
              (Restored Entitlement Program for Survivors) (VA Form 21P-8924)
            </a>
          </li>
        </ul>
      </va-accordion-item>
    </va-accordion>
    <br />
  </>
);

export const ConfirmationPage = () => {
  const form = useSelector(state => state.form || {});
  const { submission } = form;
  const submitDate = submission.timestamp;
  const confirmationNumber = submission.response?.confirmationNumber;

  return (
    <ConfirmationPageView
      submitterHeader="Who submitted this form"
      formType="alternate signer certification"
      submitterName={form.data.preparerFullName}
      submitDate={submitDate}
      confirmationNumber={confirmationNumber}
      content={content}
      childContent={childContent}
    />
  );
};

ConfirmationPage.propTypes = {
  form: PropTypes.shape({
    data: PropTypes.shape({
      fullName: {
        first: PropTypes.string,
        middle: PropTypes.string,
        last: PropTypes.string,
        suffix: PropTypes.string,
      },
    }),
    formId: PropTypes.string,
    submission: PropTypes.shape({
      timestamp: PropTypes.string,
    }),
  }),
  name: PropTypes.string,
};

function mapStateToProps(state) {
  return {
    form: state.form,
  };
}

export default connect(mapStateToProps)(ConfirmationPage);
