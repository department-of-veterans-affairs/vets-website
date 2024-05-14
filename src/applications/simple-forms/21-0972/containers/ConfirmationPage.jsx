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
      <va-accordion-item header="Accrued benefits">
        <ul>
          <li>
            Application for Accrued Amounts Due a Deceased Beneficiary (VA Form
            21P-601)
            <br />
            <a href="/find-forms/about-form-21p-601">
              Learn more about VA Form 21P-601
            </a>
          </li>
        </ul>
      </va-accordion-item>
      <va-accordion-item header="Appeals">
        <ul>
          <li>
            Decision Review Request: Supplemental Claim (VA Form 20-0995)
            <br />
            <a href="/find-forms/about-form-20-0995">
              Learn more about VA Form 20-0995
            </a>
          </li>
          <li>
            Decision Review Request: Higher-Level Review (VA Form 20-0996)
            <br />
            <a href="/find-forms/about-form-20-0996">
              Learn more about VA Form 20-0996
            </a>
          </li>
          <li>
            Decision Review Request: Board Appeal (Notice of Disagreement) (VA
            Form 10182)
            <br />
            <a href="/find-forms/about-form-10182">
              Learn more about VA Form 10182
            </a>
          </li>
        </ul>
      </va-accordion-item>
      <va-accordion-item header="Auto allowance">
        <ul>
          <li>
            Application for Automobile or Other Conveyance and Adaptive
            Equipment (VA Form 21-4502)
            <br />
            <a href="/find-forms/about-form-21-4502">
              Learn more about VA Form 21-4502
            </a>
          </li>
        </ul>
      </va-accordion-item>
      <va-accordion-item header="Benefits for certain children with disabilities">
        <ul>
          <li>
            Application for Benefits for a Qualifying Veteran’s Child Born with
            Disabilities (VA Form 21-0304)
            <br />
            <a href="/find-forms/about-form-21-0304">
              Learn more about VA Form 21-0304
            </a>
          </li>
        </ul>
      </va-accordion-item>
      <va-accordion-item header="Compensation">
        <ul>
          <li>
            Application for Disability Compensation and Related Compensation
            Benefits (VA Form 21-526EZ)
            <br />
            <a href="/find-forms/about-form-21-526ez">
              Learn more about VA Form 21-526EZ
            </a>
          </li>
        </ul>
      </va-accordion-item>
      <va-accordion-item header="Compensation or Pension">
        <ul>
          <li>
            Intent to File a Claim for Compensation and/or Pension, or Survivors
            Pension and/or DIC (VA Form 21-0966)
            <br />
            <a href="/find-forms/about-form-21-0966">
              Learn more about VA Form 21-0966
            </a>
          </li>
        </ul>
      </va-accordion-item>
      <va-accordion-item header="Dependents">
        <ul>
          <li>
            Application Request to Add and/or Remove Dependents (VA Form
            21-686c)
            <br />
            <a href="/find-forms/about-form-21-686c">
              Learn more about VA Form 21-686c
            </a>
          </li>
        </ul>
      </va-accordion-item>
      <va-accordion-item header="Dependent parent(s)">
        <ul>
          <li>
            Statement of Dependency of Parent(s) (VA Form 21P-509)
            <br />
            <a href="/find-forms/about-form-21p-509">
              Learn more about VA Form 21P-509
            </a>
          </li>
        </ul>
      </va-accordion-item>
      <va-accordion-item header="Individual unemployability">
        <ul>
          <li>
            Veteran’s Application for Increased Compensation Based on
            Unemployability (VA Form 21-8940)
            <br />
            <a href="/find-forms/about-form-21-8940">
              Learn more about VA Form 21-8940
            </a>
          </li>
        </ul>
      </va-accordion-item>
      <va-accordion-item header="Pension">
        <ul>
          <li>
            Application for Veterans Pension (VA Form 21P-527EZ)
            <br />
            <a href="/find-forms/about-form-21p-527ez">
              Learn more about VA Form 21P-527EZ
            </a>
          </li>
          <li>
            Income and Asset Statement in Support of Claim for Pension or
            Parents' Dependency and Indemnity Compensation (DIC) (VA Form
            21P-0969)
            <br />
            <a href="/find-forms/about-form-21p-0969">
              Learn more about VA Form 21P-0969
            </a>
          </li>
          <li>
            Income, Net Worth, and Employment Statement (VA Form 21P-527)
            <br />
            <a href="/find-forms/about-form-21p-527">
              Learn more about VA Form 21P-527
            </a>
          </li>
          <li>
            Pension Claim Questionnaire for Farm Income (VA Form 21P-4165)
            <br />
            <a href="/find-forms/about-form-21p-4165">
              Learn more about VA Form 21P-4165
            </a>
          </li>
          <li>
            Medical Expense Report (VA Form 21P-8416)
            <br />
            <a href="/find-forms/about-form-21p-8416">
              Learn more about VA Form 21P-8416
            </a>
          </li>
          <li>
            Request for Details of Expenses (VA Form 21P-8049)
            <br />
            <a href="/find-forms/about-form-21p-8049">
              Learn more about VA Form 21P-8049
            </a>
          </li>
          <li>
            Report of Income from Property or Business (VA Form 21P-4185)
            <br />
            <a href="/find-forms/about-form-21p-4185">
              Learn more about VA Form 21P-4185
            </a>
          </li>
          <li>
            All forms known as Eligibility Verification Reports
            <br />
            <a href="/find-forms/?q=Eligibility+Verification+Reports">
              Learn more about Eligibility Verification Reports
            </a>
          </li>
        </ul>
      </va-accordion-item>
      <va-accordion-item header="Posttraumatic stress disorder">
        <ul>
          <li>
            Statement in Support of Claim for Service Connection for
            Posttraumatic Stress Disorder (PTSD) (VA Form 21-0781)
            <br />
            <a href="/find-forms/about-form-21-0781">
              Learn more about VA Form 21-0781
            </a>
          </li>
          <li>
            Statement in Support of Claim for Service Connection for PTSD
            Secondary to Personal Assault (VA Form 21-0781a)
            <br />
            <a href="/find-forms/about-form-21-0781a">
              Learn more about VA Form 21-0781a
            </a>
          </li>
        </ul>

        <p>
          <strong>Note:</strong> If you want to fill out these forms online,
          you’ll need to go to our disability compensation form,{' '}
          <a href="/find-forms/about-form-21-526ez">VA Form 21-526EZ</a>. These
          forms are included within the online version of VA Form 21-526EZ.
        </p>
      </va-accordion-item>
      <va-accordion-item header="School-age children (ages 18 to 23 and in school)">
        <ul>
          <li>
            Request for Approval of School Attendance (VA Form 21-674)
            <br />
            <a href="/find-forms/about-form-21-674">
              Learn more about VA Form 21-674
            </a>
          </li>
        </ul>
      </va-accordion-item>
      <va-accordion-item header="Specially adapted housing or special home adaptation">
        <ul>
          <li>
            Application in Acquiring Specially Adapted Housing or Special Home
            Adaptation Grant (VA Form 26-4555)
            <br />
            <a href="/find-forms/about-form-26-4555">
              Learn more about VA Form 26-4555
            </a>
          </li>
        </ul>
      </va-accordion-item>
      <va-accordion-item header="Survivor benefits">
        <ul>
          <li>
            Application for DIC, Survivors Pension, and/or Accrued Benefit (VA
            Form 21P-534EZ)
            <br />
            <a href="/find-forms/about-form-21p-534ez">
              Learn more about VA Form 21P-534EZ
            </a>
          </li>
          <li>
            Application for Dependency and Indemnity Compensation, Survivors
            Pension, and Accrued Benefits by Surviving Spouse or Child (VA Form
            21P-534)
            <br />
            <a href="/find-forms/about-form-21p-534">
              Learn more about VA Form 21P-534
            </a>
          </li>
          <li>
            Application for Dependency and Indemnity Compensation by a Surviving
            Spouse or Child - In-Service Death Only (VA Form 21P-534a)
            <br />
            <a href="/find-forms/about-form-21p-534a">
              Learn more about VA Form 21P-534a
            </a>
          </li>
          <li>
            Application for Dependency and Indemnity Compensation by Parent(s)
            (VA Form 21P-535)
            <br />
            <a href="/find-forms/about-form-21p-535">
              Learn more about VA Form 21P-535
            </a>
          </li>
          <li>
            Application of Surviving Spouse or Child for REPS Benefits (Restored
            Entitlement Program for Survivors) (VA Form 21P-8924)
            <br />
            <a href="/find-forms/about-form-21p-8924">
              Learn more about VA Form 21P-8924
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
