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
      You are now able to sign the following benefit applications on behalf of
      the Veteran or a non-veteran claimant you identified in your alternate
      signer certification.
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
            <a href="/find-forms/about-form-21p-601">
              Application for Accrued Amounts Due a Deceased Beneficiary (VA
              Form 21P-601)
            </a>
          </li>
        </ul>
      </va-accordion-item>
      <va-accordion-item header="Appeals" id="second">
        <ul>
          <li>
            <a href="/find-forms/about-form-20-0995">
              Decision Review Request: Supplemental Claim (VA Form 20-0995)
            </a>
          </li>
          <li>
            <a href="/find-forms/about-form-20-0996">
              Decision Review Request: Higher-Level Review (VA Form 20-0996)
            </a>
          </li>
          <li>
            <a href="/find-forms/about-form-10182">
              Decision Review Request: Board Appeal (Notice of Disagreement) (VA
              Form 20-10182)
            </a>
          </li>
        </ul>
      </va-accordion-item>
      <va-accordion-item header="Auto allowance" id="third">
        <ul>
          <li>
            <a href="/find-forms/about-form-21-4502">
              Application for Automobile or Other Conveyance and Adaptive
              Equipment (VA Form 21-4502)
            </a>
          </li>
        </ul>
      </va-accordion-item>
      <va-accordion-item
        header="Benefits for certain children with disabilities"
        id="fourth"
      >
        <ul>
          <li>
            <a href="/find-forms/about-form-21-0304">
              Application for Benefits for a Qualifying Veteran’s Child Born
              with Disabilities (VA Form 21-0304)
            </a>
          </li>
        </ul>
      </va-accordion-item>
      <va-accordion-item header="Compensation" id="fifth">
        <ul>
          <li>
            <a href="/find-forms/about-form-21-526ez">
              Application for Disability Compensation and Related Compensation
              Benefits (VA Form 21-526EZ)
            </a>
          </li>
        </ul>
      </va-accordion-item>
      <va-accordion-item header="Compensation and/or Pension" id="sixth">
        <ul>
          <li>
            <a href="/find-forms/about-form-21-0966">
              Intent to File a Claim for Compensation and/or Pension, or
              Survivors Pension and/or DIC (VA Form 21-0966)
            </a>
          </li>
        </ul>
      </va-accordion-item>
      <va-accordion-item header="Dependents" id="seventh">
        <ul>
          <li>
            <a href="/find-forms/about-form-21-686c">
              Application Request to Add and/or Remove Dependents (VA Form
              21-686c)
            </a>
          </li>
        </ul>
      </va-accordion-item>
      <va-accordion-item header="Dependent parent(s)" id="eighth">
        <ul>
          <li>
            <a href="/find-forms/about-form-21p-509">
              Statement of Dependency of Parent(s) (VA Form 21P-509)
            </a>
          </li>
        </ul>
      </va-accordion-item>
      <va-accordion-item header="Individual unemployability" id="ninth">
        <ul>
          <li>
            <a href="/find-forms/about-form-21-8940">
              Veteran’s Application for Increased Compensation Based on
              Unemployability (VA Form 21-8940)
            </a>
          </li>
        </ul>
      </va-accordion-item>
      <va-accordion-item header="Pension" id="tenth">
        <ul>
          <li>
            <a href="/find-forms/about-form-21p-527ez">
              Application for Pension (VA Form 21P-527EZ)
            </a>
          </li>
          <li>
            <a href="/find-forms/about-form-21p-0969">
              Income and Asset Statement in Support of Claim for Pension or
              Parents' Dependency and Indemnity Compensation (DIC) (VA Form
              21P-0969)
            </a>
          </li>
          <li>
            <a href="/find-forms/about-form-21p-527">
              Income, Net Worth, and Employment Statement (VA Form 21P-527)
            </a>
          </li>
          <li>
            <a href="/find-forms/about-form-21p-4165">
              Pension Claim Questionnaire for Farm Income (VA Form 21P-4165)
            </a>
          </li>
          <li>
            <a href="/find-forms/about-form-21p-8416">
              Medical Expense Report (VA Form 21P-8416)
            </a>
          </li>
          <li>
            <a href="/find-forms/about-form-21p-8049">
              Request for Details of Expenses (VA Form 21P-8049)
            </a>
          </li>
          <li>
            <a href="/find-forms/about-form-21-526ez">
              Application for Disability Compensation and Related Compensation
              Benefits (VA Form 21-526EZ)
            </a>
          </li>
          <li>
            <a href="/find-forms/about-form-21p-4185">
              Report of Income from Property or Business (VA Form 21P-4185)
            </a>
          </li>
          <li>
            ALL forms known as{' '}
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
            <a href="/find-forms/about-form-21-0781">
              Statement in Support of Claim for Service Connection for
              Posttraumatic Stress Disorder (PTSD) (VA Form 21-0781)
            </a>
          </li>
          <li>
            <a href="/find-forms/about-form-21-0781a">
              Statement in Support of Claim for Service Connection for PTSD
              Secondary to Personal Assault (VA Form 21-0781a)
            </a>
          </li>
        </ul>
      </va-accordion-item>
      <va-accordion-item
        header="School Age Child(ren) (Aged 18-23 Years and in School)"
        id="thirteenth"
      >
        <ul>
          <li>
            <a href="/find-forms/about-form-21-674">
              Request for Approval of School Attendance (VA Form 21-674)
            </a>
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
  // mock for testing
  const fullName = {
    first: 'first',
    last: 'last',
  };
  const submitDate = submission.timestamp;
  const confirmationNumber = submission.response?.confirmationNumber;

  return (
    <ConfirmationPageView
      submitterName={fullName}
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
