import React from 'react';
import PropTypes from 'prop-types';
import YourInformationDescription from '../components/YourInformationDescription';

const ResultDescription = ({
  body,
  linkHref,
  linkText,
  answers,
  resultHeader,
}) => (
  <div>
    {resultHeader && (
      <h2 className="vads-u-font-size--h2 vads-u-margin-bottom--2">
        {resultHeader}
      </h2>
    )}
    <p>{body}</p>
    {linkHref &&
      linkText && (
        <a
          href={linkHref}
          className="vads-u-display--block vads-u-margin-bottom--3"
        >
          {linkText}
        </a>
      )}
    <div className="usa-alert background-color-only">
      <h3 className="vads-u-margin-top--0">Your answers:</h3>
      <ul className="vads-u-list-style--none vads-u-padding-left--0">
        {answers.map((answer, index) => (
          <li
            key={index}
            className="vads-u-display--flex vads-u-align-items--start vads-u-margin-bottom--2"
          >
            <va-icon
              icon="check"
              size={3}
              className="vads-u-margin-right--2 vads-u-color--green"
            />
            <span>{answer}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export const yourInformationPage = () => ({
  uiSchema: {
    'ui:description': YourInformationDescription,
    mebWhatDoYouWantToDo: {
      'ui:title': 'What do you want to do?',
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
          'Apply to switch my existing education benefit and get a new Certificate of Eligibility (COE)',
        ],
      },
    },
  },
});

export const benefitSwitchPage = () => ({
  uiSchema: {
    'ui:title': 'Benefit you want to change to',
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

const buildResultPage = ({
  body,
  linkHref,
  linkText,
  answers,
  resultHeader,
}) => ({
  uiSchema: {
    'ui:description': () => (
      <ResultDescription
        body={body}
        linkHref={linkHref}
        linkText={linkText}
        answers={answers}
        resultHeader={resultHeader}
      />
    ),
  },
  schema: emptySchema,
});

export const sameBenefitResultPage = () =>
  buildResultPage({
    resultHeader:
      "Dependent's Application for VA Education Benefits (VA Form 22-5490)",
    body:
      'Based on your answers, use VA Form 22-5490 to apply to the same benefit again to get an updated COE.',
    linkHref:
      'https://www.va.gov/family-and-caregiver-benefits/education-and-careers/apply-for-dea-fry-form-22-5490',
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
  answers: PropTypes.arrayOf(PropTypes.string).isRequired,
  body: PropTypes.string.isRequired,
  linkHref: PropTypes.string,
  linkText: PropTypes.string,
  resultHeader: PropTypes.string,
};
