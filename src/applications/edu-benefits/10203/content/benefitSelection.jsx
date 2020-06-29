import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

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

export const ineligibleAlert = () => {
  const text = (
    <div>
      <p>
        The Rogers STEM Scholarship is only for Post-9/11 Gi Bill and Fry
        Scholarship recipients.
      </p>
      <p>
        If you think you may be eligible, you can still choose to apply for the
        Rogers STEM Scholarship
      </p>
    </div>
  );
  return (
    <AlertBox
      status="warning"
      headline="You may not be eligible"
      content={text}
    />
  );
};
