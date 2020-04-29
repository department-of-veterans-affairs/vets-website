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
      Post-9/11 GI Bill (Chapter 33)
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

// The links and labels are different from the above
export const survivorBenefitsLabels = {
  chapter35: (
    <p>
      Survivors’ and Dependents’ Educational Assistance
      <br />
      (DEA, Chapter 35)
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
      The Fry Scholarship (Chapter 33)
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
  phone: 'Phone',
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
    <strong>civilian employee</strong> during the same time as you are seeking
    benefits from VA?
  </span>
);

export const bankAccountChangeLabels = {
  startUpdate: 'Start or update direct deposit',
  stop: 'Stop direct deposit',
  noChange: 'No change to payment method',
};

export const directDepositWarning = (
  <div className="edu-dd-warning">
    The Department of Treasury requires all federal benefit payments be made by
    electronic funds transfer (EFT), also called direct deposit (direct deposit
    isn’t an option for Chapter 32 (VEAP) recipients). If you don’t have a bank
    account, you must get your payment through Direct Express Debit MasterCard.
    To request a Direct Express Debit MasterCard you must apply at{' '}
    <a
      href="http://www.usdirectexpress.com"
      target="_blank"
      rel="noopener noreferrer"
    >
      www.usdirectexpress.com
    </a>{' '}
    or by telephone at <a href="tel:8003331795">800-333-1795</a>. If you chose
    not to enroll, you must contact representatives handling waiver requests for
    the Department of Treasury at <a href="tel:8882242950">888-224-2950</a>.
    They will address any questions or concerns you may have and encourage your
    participation in EFT.
  </div>
);
