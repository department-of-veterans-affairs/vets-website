import React from 'react';

import { states } from 'platform/forms/address';
import { createUSAStateLabels } from 'platform/forms-system/src/js/helpers';

export const chapterNames = {
  veteranInformation: 'Veteran Information',
  benefitsEligibility: 'Benefits Eligibility',
  militaryHistory: 'Military History',
  educationHistory: 'Education History',
  employmentHistory: 'Employment History',
  schoolSelection: 'School Selection',
  personalInformation: 'Personal Information',
  review: 'Review',
};

export const benefitsLabels = {
  chapter33: (
    <p>
      Post-9/11 GI bill (Chapter 33)
      <br />
      <a
        aria-label="Learn more about Post-9/11 benefits"
        href="/education/about-gi-bill-benefits/post-9-11/"
        target="_blank"
      >
        Learn more
      </a>
    </p>
  ),
  chapter33Description: (
    <span className="vads-u-background-color--white vads-u-color--gray-dark">
      When you choose to apply for your Post-9/11 benefit, you have to
      relinquish (give up) 1 other benefit you may be eligible for. You’ll make
      this decision on the next page.
    </span>
  ),
  // 1995-STEM related
  fryScholarship: (
    <p>
      Fry Scholarship (Chapter 33)
      <br />
      <a
        aria-label="Learn more about Fry Scholarship benefits"
        href="/education/survivor-dependent-benefits/fry-scholarship/"
        target="_blank"
      >
        Learn more
      </a>
    </p>
  ),
  chapter30: (
    <p>
      Montgomery GI Bill (MGIB-AD, Chapter 30)
      <br />
      <a
        aria-label="Learn more about Montgomery GI Bill benefits"
        href="/education/about-gi-bill-benefits/montgomery-active-duty/"
        target="_blank"
      >
        Learn more
      </a>
    </p>
  ),
  chapter1606: (
    <p>
      Montgomery GI Bill Selected Reserve (MGIB-SR, Chapter 1606)
      <br />
      <a
        aria-label="Learn more about Montgomery GI Bill Selected Reserve benefits"
        href="/education/about-gi-bill-benefits/montgomery-selected-reserve/"
        target="_blank"
      >
        Learn more
      </a>
    </p>
  ),
  chapter32: (
    <p>
      Post-Vietnam Era Veterans’ Educational Assistance Program
      <br />
      (VEAP, Chapter 32)
      <br />
      <a
        aria-label="Learn more about Post-Vietnam Era Veterans’ Educational Assistance Program benefits"
        href="/education/other-va-education-benefits/veap/"
        target="_blank"
      >
        Learn more
      </a>
    </p>
  ),
  transferOfEntitlement: (
    <p>
      Transfer of Entitlement Program (TOE)
      <br />
      <a
        aria-label="Learn more about Transfer of Entitlement Program benefits"
        href="/education/transfer-post-9-11-gi-bill-benefits/"
        target="_blank"
      >
        Learn more
      </a>
    </p>
  ),
};

export const benefitsLabelsUpdate = {
  chapter33: (
    <p>
      Post-9/11 GI bill (Chapter 33)
      <br />
      <a
        aria-label="Learn more about Post-9/11 benefits"
        href="/education/about-gi-bill-benefits/post-9-11/"
        target="_blank"
      >
        Learn more
      </a>
    </p>
  ),
  chapter33Description: (
    <span className="vads-u-background-color--white vads-u-color--gray-dark">
      When you choose to apply for your Post-9/11 benefit, you have to
      relinquish (give up) 1 other benefit you may be eligible for. You’ll make
      this decision on the next page.
    </span>
  ),
  // 1995-STEM related
  fryScholarship: (
    <p>
      Fry Scholarship (Chapter 33)
      <br />
      <a
        aria-label="Learn more about Fry Scholarship benefits"
        href="/education/survivor-dependent-benefits/fry-scholarship/"
        target="_blank"
      >
        Learn more
      </a>
    </p>
  ),
  chapter30: (
    <p>
      Montgomery GI Bill (MGIB-AD, Chapter 30)
      <br />
      <a
        aria-label="Learn more about Montgomery GI Bill benefits"
        href="/education/about-gi-bill-benefits/montgomery-active-duty/"
        target="_blank"
      >
        Learn more
      </a>
    </p>
  ),
  chapter1606: (
    <p>
      Montgomery GI Bill Selected Reserve (MGIB-SR, Chapter 1606)
      <br />
      <a
        aria-label="Learn more about Montgomery GI Bill Selected Reserve benefits"
        href="/education/about-gi-bill-benefits/montgomery-selected-reserve/"
        target="_blank"
      >
        Learn more
      </a>
    </p>
  ),
  transferOfEntitlement: (
    <p>
      Transfer of Entitlement Program (TOE)
      <br />
      <a
        aria-label="Learn more about Transfer of Entitlement Program benefits"
        href="/education/transfer-post-9-11-gi-bill-benefits/"
        target="_blank"
      >
        Learn more
      </a>
    </p>
  ),
  chapter35: (
    <p>
      Survivors' and Dependents’ Education Assistance (DEA, Chapter 35 )<br />
      <a
        aria-label="Learn more about Montgomery GI Bill Selected Reserve benefits"
        href="/education/about-gi-bill-benefits/montgomery-selected-reserve/"
        target="_blank"
      >
        Learn more
      </a>
    </p>
  ),
};

// The links and labels are different from the above
export const survivorBenefitsLabels = {
  chapter35: (
    <p>
      <span aria-describedby="conditional-warning-text">
        Survivors’ and Dependents’ Educational Assistance
        <br />
        (DEA, Chapter 35)
      </span>
      <br />
      <a
        aria-label="Learn more about Survivors’ and Dependents’ Educational Assistance benefits"
        href="/education/survivor-dependent-benefits/dependents-education-assistance/"
        target="_blank"
      >
        Learn more
      </a>
    </p>
  ),
  chapter33: (
    <p>
      <span aria-describedby="conditional-warning-text">
        The Fry Scholarship (Chapter 33)
      </span>
      <br />
      <a
        aria-label="Learn more about Fry Scholarship benefits"
        href="/education/survivor-dependent-benefits/fry-scholarship/"
        target="_blank"
      >
        Learn more
      </a>
    </p>
  ),
};

export const preferredContactMethodLabels = {
  mail: 'Mail',
  email: 'Email',
  phone: 'Home phone number',
  mobile: 'Mobile phone number',
};

export const hoursTypeLabels = {
  semester: 'Semester',
  quarter: 'Quarter',
  clock: 'Clock',
};

export const stateLabels = createUSAStateLabels(states);

export const civilianBenefitsLabel = (
  <span>
    Are you getting benefits from the U.S. Government as a{' '}
    <strong>civilian employee</strong> during the same time as you’re seeking
    benefits from VA?
  </span>
);

export const bankAccountChangeLabels = {
  startUpdate: 'Start or update direct deposit',
  stop: 'Stop direct deposit',
  noChange: 'No change to payment method',
};

export const bankAccountChangeLabelsUpdate = {
  startUpdate: 'Start or update direct deposit',
  noChange: 'No change to payment method',
  none: "I don't have a bank account",
};

export const directDepositWarning = (
  <div className="edu-dd-warning">
    <p>
      The Department of the Treasury requires all federal benefit payments be
      made by electronic funds transfer (EFT), also called direct deposit.
    </p>
    <p>
      If you don’t have a bank account, or don’t wish to provide your bank
      account information, you must receive your payment through Direct Express
      Debit MasterCard. To request a Direct Express Debit MasterCard:
      <ul>
        <li>
          Apply at{' '}
          <a
            href="http://www.usdirectexpress.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            www.usdirectexpress.com
          </a>{' '}
          <b>or</b>
        </li>
        <li>
          Call <va-telephone contact="8003331795" />
        </li>
      </ul>
      If you choose not to enroll, you’ll need to call the Department of the
      Treasury at <va-telephone contact="8882242950" />
      and speak to a representative handling waiver requests. They’ll encourage
      you to participate in EFT and address any questions or concerns you have.
    </p>
  </div>
);

const gaBankInfoHelpText = () => {
  window.dataLayer.push({
    event: 'edu-5490--form-help-text-clicked',
    'help-text-label': 'What if I don’t have a bank account?',
  });
};

export const bankInfoHelpText = (
  <va-additional-info
    trigger="What if I don’t have a bank account?"
    onClick={gaBankInfoHelpText}
  >
    <span>
      <p>
        The{' '}
        <a href="https://veteransbenefitsbanking.org/">
          Veterans Benefits Banking Program (VBBP)
        </a>{' '}
        provides a list of Veteran-friendly banks and credit unions. They’ll
        work with you to set up an account, or help you qualify for an account,
        so you can use direct deposit. To get started, call one of the
        participating banks or credit unions listed on the VBBP website. Be sure
        to mention the Veterans Benefits Banking Program.
      </p>
      <p>
        Note: Federal regulation, found in 31 C.F.R. § 208.3 provides that,
        subject to section 208.4, “all Federal payments made by an agency shall
        be made by electronic funds transfer” (EFT).
      </p>
    </span>
  </va-additional-info>
);
