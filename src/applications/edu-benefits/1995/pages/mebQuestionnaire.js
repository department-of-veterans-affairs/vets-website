import React from 'react';
import PropTypes from 'prop-types';

// Map benefit type codes to full descriptions
const BENEFIT_TYPE_LABELS = {
  // Post-9/11 GI Bill variants
  chapter33: 'Post-9/11 GI Bill (PGIB, Chapter 33)',
  CH33: 'Post-9/11 GI Bill (PGIB, Chapter 33)',
  CH33_TOE:
    'Transferred Post-9/11 GI Bill benefits (Transfer of Entitlement Program, TOE)',
  CH33_FRY: 'Fry Scholarship (Chapter 33)',

  // Montgomery GI Bill Active Duty
  chapter30: 'Montgomery GI Bill (MGIB-AD, Chapter 30)',
  CH30: 'Montgomery GI Bill (MGIB-AD, Chapter 30)',

  // Montgomery GI Bill Selected Reserve
  chapter1606: 'Montgomery GI Bill Selected Reserve (MGIB-SR, Chapter 1606)',
  CH1606: 'Montgomery GI Bill Selected Reserve (MGIB-SR, Chapter 1606)',

  // Dependents' Education Assistance
  chapter35: "Dependents' Education Assistance (DEA, Chapter 35)",
  CH35: "Dependents' Education Assistance (DEA, Chapter 35)",
  DEA: "Dependents' Education Assistance (DEA, Chapter 35)",

  // Legacy mappings (for backward compatibility)
  transferOfEntitlement:
    'Transferred Post-9/11 GI Bill benefits (Transfer of Entitlement Program, TOE)',
  TOE:
    'Transferred Post-9/11 GI Bill benefits (Transfer of Entitlement Program, TOE)',
  fryScholarship: 'Fry Scholarship (Chapter 33)',
  FRY: 'Fry Scholarship (Chapter 33)',
};

const getBenefitLabel = benefitType => {
  if (!benefitType) {
    return "We couldn't load your current benefit.";
  }
  return BENEFIT_TYPE_LABELS[benefitType] || benefitType;
};

const ResultDescription = ({ body, linkHref, linkText, answers }) => (
  <div>
    <h2 className="vads-u-white-space--nowrap">
      Change your education benefits
    </h2>
    <p>{body}</p>
    {linkHref && linkText && <va-link href={linkHref} text={linkText} />}
    <va-summary-box headline="Your answers">
      <ul>
        {answers.map((answer, index) => (
          <li key={index}>{answer}</li>
        ))}
      </ul>
    </va-summary-box>
  </div>
);

export const yourInformationPage = () => ({
  uiSchema: {
    'ui:title': 'Your information',
    'ui:description': ({ formData }) => (
      <div className="vads-u-margin-bottom--4">
        <div
          className="usa-summary-box"
          role="region"
          aria-labelledby="summary-box-current-benefit"
          style={{
            backgroundColor: 'white',
            border: '1px solid #565c65',
          }}
        >
          <div className="usa-summary-box__body">
            <h3
              className="usa-summary-box__heading"
              id="summary-box-current-benefit"
            >
              Your current benefit
            </h3>
            <div className="usa-summary-box__text">
              {getBenefitLabel(formData?.currentBenefitType)}
            </div>
          </div>
        </div>
        <p className="vads-u-margin-top--2">
          <strong>Note:</strong> If this information is incorrect, call us at
          800-827-1000 (TTY: 711). We’re here Monday through Friday, 8:00 a.m.
          to 9:00 p.m. ET.
        </p>
      </div>
    ),
    mebWhatDoYouWantToDo: {
      'ui:title': 'What do you want to do? (Required)',
      'ui:widget': 'radio',
    },
  },
  schema: {
    type: 'object',
    required: ['mebWhatDoYouWantToDo'],
    properties: {
      mebWhatDoYouWantToDo: {
        type: 'string',
        enum: ['same-benefit', 'foreign-school', 'switch-benefit'],
        enumNames: [
          'Apply to the same benefit again to get an updated Certificate of Eligibility (COE)',
          'Update my Certificate of Eligibility (COE) for a foreign school',
          'Apply to switch my existing education benefit and get a new Certificate of Eligibility',
        ],
      },
    },
  },
});

export const benefitSwitchPage = () => ({
  uiSchema: {
    'ui:title': 'Benefit you want to change to (Required)',
    'ui:description': () => (
      <details className="vads-u-margin-bottom--3">
        <summary className="vads-u-font-weight--bold">
          Learn more about these benefits
        </summary>
        <ul className="vads-u-margin-top--1">
          <li>
            Learn about GI Bill benefits: Post-9/11 GI Bill, Montgomery GI Bill
            Active Duty (MGIB-AD), and Montgomery GI Bill Selected Reserve
            (MGIB-SR) (opens in a new tab)
            <ul className="vads-u-margin-top--1">
              <li>
                <a href="https://www.va.gov/education/about-gi-bill-benefits/post-9-11">
                  Post-9/11 GI Bill
                </a>
              </li>
              <li>
                <a href="https://www.va.gov/education/about-gi-bill-benefits/montgomery-active-duty">
                  Montgomery GI Bill Active Duty (MGIB-AD)
                </a>
              </li>
              <li>
                <a href="https://www.va.gov/education/about-gi-bill-benefits/montgomery-selected-reserve">
                  Montgomery GI Bill Selected Reserve (MGIB-SR)
                </a>
              </li>
            </ul>
          </li>
          <li>
            <a href="https://www.va.gov/family-and-caregiver-benefits/education-and-careers/transferred-gi-bill-benefits/">
              Learn about survivors’ and dependents’ assistance: transferred
              Post-9/11 GI Bill benefits (opens in a new tab)
            </a>
          </li>
          <li>
            Survivors’ and Dependents’ Education Assistance (DEA), Fry
            Scholarship
            <ul className="vads-u-margin-top--1">
              <li>
                <a href="https://www.va.gov/family-and-caregiver-benefits/education-and-careers/dependents-education-assistance/">
                  Survivors’ and Dependents’ Education Assistance (DEA)
                </a>
              </li>
              <li>
                <a href="https://www.va.gov/family-and-caregiver-benefits/education-and-careers/fry-scholarship/">
                  Fry Scholarship
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </details>
    ),
    mebBenefitSelection: {
      'ui:widget': 'radio',
    },
  },
  schema: {
    type: 'object',
    required: ['mebBenefitSelection'],
    properties: {
      mebBenefitSelection: {
        type: 'string',
        enum: ['mgib-ad', 'mgib-sr', 'toe', 'dea', 'fry'],
        enumNames: [
          'Montgomery GI Bill (MGIB-AD, Chapter 30)',
          'Montgomery GI Bill Selected Reserve (MGIB-SR, Chapter 1606)',
          'Transferred Post-911 GI Bill benefits (Transfer of Entitlement Program, TOE)',
          'Dependents’ Education Assistance (DEA, Chapter 35)',
          'Fry Scholarship (Chapter 33)',
        ],
      },
    },
  },
});

const emptySchema = {
  type: 'object',
  properties: {},
};

const buildResultPage = ({ body, linkHref, linkText, answers }) => ({
  uiSchema: {
    'ui:description': () => (
      <ResultDescription
        body={body}
        linkHref={linkHref}
        linkText={linkText}
        answers={answers}
      />
    ),
  },
  schema: emptySchema,
});

export const sameBenefitResultPage = () =>
  buildResultPage({
    body:
      'Based on your answers, use VA Form 22-1990 to apply to the same benefit again to get an updated COE.',
    linkHref:
      'https://www.va.gov/education/apply-for-education-benefits/application/1990/introduction',
    linkText: 'Apply for education benefits (VA Form 22-1990)',
    answers: [
      'You are looking to apply to the same benefit again to get an updated Certificate of Eligibility (COE)',
    ],
  });

export const foreignSchoolResultPage = () =>
  buildResultPage({
    body:
      'Get answers to your questions about using eligibility at a foreign school. You should receive a reply within 7 business days.',
    linkHref: 'https://ask.va.gov/',
    linkText: 'Ask VA',
    answers: [
      'You want to update your Certificate of Eligibility (COE) for a foreign school',
    ],
  });

export const mgibAdResultPage = () =>
  buildResultPage({
    body:
      'Based on your answers, use VA Form 22-1990 to apply to the same benefit again to get an updated COE.',
    linkHref:
      'https://www.va.gov/education/apply-for-education-benefits/application/1990/introduction',
    linkText: 'Apply for education benefits (VA Form 22-1990)',
    answers: [
      'You are looking to apply to switch your existing education benefit and get a new Certificate of Eligibility (COE)',
      'You want to change your current benefit to the Montgomery GI Bill (MGIB-AD, Chapter 30)',
    ],
  });

export const mgibSrResultPage = () =>
  buildResultPage({
    body:
      'Based on your answers, use VA Form 22-1990 to apply to the same benefit again to get an updated COE.',
    linkHref:
      'https://www.va.gov/education/apply-for-education-benefits/application/1990/introduction',
    linkText: 'Apply for education benefits (VA Form 22-1990)',
    answers: [
      'You are looking to apply to switch your existing education benefit and get a new Certificate of Eligibility (COE)',
      'You want to change your current benefit to the Montgomery GI Bill Selected Reserve (MGIB-SR, Chapter 1606)',
    ],
  });

export const toeResultPage = () =>
  buildResultPage({
    body:
      'Based on your answers, use VA Form 22-1990e to apply to the same benefit again to get an updated COE.',
    linkHref:
      'https://www.va.gov/education/apply-for-education-benefits/application/1990E/introduction',
    linkText: 'Apply for education benefits (VA Form 22-1990e)',
    answers: [
      'You are looking to apply to switch your existing education benefit and get a new Certificate of Eligibility (COE)',
      'You want to change your current benefit to the Transferred Post-9/11 GI Bill benefits (Transfer of Entitlement Program, TOE)',
    ],
  });

export const deaResultPage = () =>
  buildResultPage({
    body:
      'Based on your answers, use VA Form 22-5490 to apply to the same benefit again to get an updated COE.',
    linkHref:
      'https://www.va.gov/education/apply-for-education-benefits/application/5490/introduction',
    linkText: 'Apply for education benefits (VA Form 22-5490)',
    answers: [
      'You are looking to apply to switch your existing education benefit and get a new Certificate of Eligibility (COE)',
      'You want to change your current benefit to the Dependents’ Education Assistance (DEA, Chapter 35)',
    ],
  });

export const fryResultPage = () =>
  buildResultPage({
    body:
      'Based on your answers, use VA Form 22-5490 to apply to the same benefit again to get an updated COE.',
    linkHref:
      'https://www.va.gov/education/apply-for-education-benefits/application/5490/introduction',
    linkText: 'Apply for education benefits (VA Form 22-5490)',
    answers: [
      'You are looking to apply to switch your existing education benefit and get a new Certificate of Eligibility (COE)',
      'You want to change your current benefit to the Fry Scholarship (Chapter 33)',
    ],
  });

ResultDescription.propTypes = {
  body: PropTypes.string.isRequired,
  linkHref: PropTypes.string,
  linkText: PropTypes.string,
  answers: PropTypes.arrayOf(PropTypes.string).isRequired,
};
