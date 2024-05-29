import cloneDeep from 'platform/utilities/data/cloneDeep';
import moment from 'moment';
import React from 'react';
import { transformForSubmit } from 'platform/forms-system/src/js/helpers';

export function transform(formConfig, form) {
  // Clone the form in so we don’t modify the original...because of reasons FP
  const newForm = cloneDeep(form);

  if (newForm.data.benefit === 'chapter33' && newForm.data.sponsorStatus) {
    if (newForm.data.sponsorStatus === 'powOrMia') {
      newForm.data.veteranDateOfDeath =
        newForm.data['view:sponsorDateListedMiaOrPow'];
    } else {
      newForm.data.veteranDateOfDeath = newForm.data['view:sponsorDateOfDeath'];
    }
  }

  const formData = transformForSubmit(formConfig, newForm);
  return JSON.stringify({
    educationBenefitsClaim: {
      form: formData,
    },
  });
}

export const relationshipLabels = {
  child: 'Child, stepchild, adopted child',
  spouse: (
    <p>
      Spouse or surviving spouse
      <>
        <br />
        <a
          aria-label="Learn more about VA requirements for marriage certification"
          rel="noopener noreferrer"
          target="_blank"
          href="http://www.va.gov/opa/marriage/"
        >
          Learn more
        </a>
      </>
    </p>
  ),
};

export const relationshipAndChildTypeLabels = {
  step: 'Step Child',
  biological: 'Biological Child',
  adopted: 'Adopted Child',
  spouse: (
    <p>
      Spouse or surviving spouse
      <>
        <br />
        <a
          aria-label="Learn more about VA requirements for marriage certification"
          rel="noopener noreferrer"
          target="_blank"
          href="http://www.va.gov/opa/marriage/"
        >
          Learn more
        </a>
      </>
    </p>
  ),
};

export const highSchoolStatusLabels = {
  graduated: 'Graduated from high school',
  graduationExpected: 'Expect to graduate from high school',
  neverAttended: 'Never attended high school',
  discontinued: 'Discontinued or stopped high school',
  ged: 'Awarded GED',
};

export const benefitsRelinquishedInfo = (
  <span>
    While receiving DEA or FRY scholarship benefits you may not receive payments
    of Dependency and Indemnity Compensation (DIC) or Pension and you may not be
    claimed as a dependent in a Compensation claim. If you’re unsure of this
    decision it is strongly encouraged you talk with a VA counselor.
  </span>
);

export const benefitsRelinquishedWarning = (
  <div className="usa-alert usa-alert-warning usa-content">
    <div className="usa-alert-body">
      I certify that I understand the effects that this election to receive DEA
      or FRY scholarship benefits will have on my eligibility for DIC payments,
      and I elect to receive the selected scholarship benefit on the above date.
    </div>
  </div>
);

export const benefitsDisclaimerSpouse = (
  <p>
    <strong>Important:</strong> If you qualify for both the Survivors’ and
    Dependents’ Educational Assistance (DEA, Chapter 35) program and the Marine
    Gunnery Sergeant John David Fry Scholarship (Fry Scholarship, Chapter 33),
    you need to pick one or the other. You must give up entitlement to the
    benefit that you’re not applying for.{' '}
    <strong>
      You can’t retain eligibility for both programs at the same time
    </strong>
    .
  </p>
);

export const benefitsDisclaimerChild = (
  <p>
    <strong>Important:</strong> If you qualify for both the Survivors’ and
    Dependents’ Educational Assistance (DEA, Chapter 35) program and the Marine
    Gunnery Sergeant John David Fry Scholarship (Fry Scholarship, Chapter 33),
    you need to pick one or the other. You must give up entitlement to the
    benefit that you’re not applying for (but only for the entitlement arising
    from the same event).{' '}
    <strong>
      You can’t retain eligibility for both programs based on the same event
    </strong>
    .
  </p>
);

export const ageWarning = (
  <div
    className="vads-u-display--flex vads-u-align-items--flex-start vads-u-background-color--primary-alt-lightest vads-u-margin-top--3 vads-u-padding-right--3"
    aria-live="polite"
  >
    <div className="vads-u-flex--1 vads-u-margin-top--2p5 vads-u-margin-x--2 ">
      <va-icon
        size={4}
        icon="see Storybook for icon names: https://design.va.gov/storybook/?path=/docs/uswds-va-icon--default"
      />
    </div>
    <div className="vads-u-flex--5">
      <p className="vads-u-font-size--base">
        Applicants under the age of 18 can’t legally make a benefits election.
        Based on your date of birth, please have a parent, guardian, or
        custodian review the information on this application, provide their
        contact information in the Guardian Section of this form, and click the
        "Submit application" button at the end of this form.
      </p>
    </div>
  </div>
);

export const eighteenOrOver = birthday => {
  return (
    birthday === undefined ||
    birthday.length !== 10 ||
    moment().diff(moment(birthday, 'YYYY-MM-DD'), 'years') > 17
  );
};
