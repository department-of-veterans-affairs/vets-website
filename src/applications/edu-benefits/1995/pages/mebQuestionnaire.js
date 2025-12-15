import React from 'react';
import PropTypes from 'prop-types';
import YourInformationDescription from '../components/YourInformationDescription';

const mapCurrentToSelection = type => {
  if (!type) return undefined;
  switch (type) {
    case 'chapter30':
    case 'CH30':
    case '30':
      return 'mgib-ad';
    case 'chapter1606':
    case 'CH1606':
    case '1606':
      return 'mgib-sr';
    case 'transferOfEntitlement':
    case 'TOE':
    case 'CH33_TOE':
      return 'toe';
    case 'chapter35':
    case 'CH35':
    case '35':
    case 'DEA':
      return 'dea';
    case 'fryScholarship':
    case 'FRY':
    case 'CH33_FRY':
      return 'fry';
    case 'chapter33':
    case 'CH33':
    case '33':
      return 'pgib';
    default:
      return undefined;
  }
};

const getFormInfo = benefitType => {
  const form1990 = {
    header: 'Application for VA Education Benefits (VA Form 22-1990)',
    link:
      'https://www.va.gov/education/apply-for-education-benefits/application/1990/introduction',
    linkText: 'Apply for education benefits (VA Form 22-1990)',
    formName: 'VA Form 22-1990',
  };
  const form5490 = {
    header:
      "Dependent's Application for VA Education Benefits (VA Form 22-5490)",
    link:
      'https://www.va.gov/family-and-caregiver-benefits/education-and-careers/apply-for-dea-fry-form-22-5490',
    linkText: 'Apply for education benefits (VA Form 22-5490)',
    formName: 'VA Form 22-5490',
  };
  const form1990e = {
    header: 'Application for VA Education Benefits (VA Form 22-1990e)',
    link:
      'https://www.va.gov/education/apply-for-education-benefits/application/1990E/introduction',
    linkText: 'Apply for education benefits (VA Form 22-1990e)',
    formName: 'VA Form 22-1990e',
  };
  switch (benefitType) {
    case 'chapter33':
    case 'CH33':
    case '33':
    case 'chapter30':
    case 'CH30':
    case '30':
    case 'chapter1606':
    case 'CH1606':
    case '1606':
      return form1990;
    case 'chapter35':
    case 'CH35':
    case '35':
    case 'DEA':
    case 'fryScholarship':
    case 'FRY':
    case 'CH33_FRY':
      return form5490;
    case 'transferOfEntitlement':
    case 'TOE':
    case 'CH33_TOE':
      return form1990e;
    default:
      return form1990;
  }
};

const getSwitchFormHeader = val => {
  switch (val) {
    case 'mgib-ad':
    case 'mgib-sr':
    case 'chapter33':
      return 'Application for VA Education Benefits (VA Form 22-1990)';
    case 'dea':
    case 'fry':
      return "Dependent's Application for VA Education Benefits (VA Form 22-5490)";
    case 'toe':
      return 'Application for VA Education Benefits (VA Form 22-1990e)';
    default:
      return null;
  }
};

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
    {linkHref && linkText && (
      <a
        href={linkHref}
        className="vads-u-display--block vads-c-action-link--green vads-u-margin-bottom--3"
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
            className="vads-u-display--block vads-u-align-items--start vads-u-margin-bottom--2"
          >
            <va-icon
              icon="check"
              size={3}
              color="green"
              className="vads-u-margin-right--2"
            />
            <span>{answer}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const SameBenefitResultDescription = ({ formData }) => {
  const formInfo = getFormInfo(formData?.currentBenefitType);
  return (
    <ResultDescription
      resultHeader={formInfo.header}
      body={`Based on your answers, use ${formInfo.formName} to apply to the same benefit again to get an updated COE.`}
      linkHref={formInfo.link}
      linkText={formInfo.linkText}
      answers={[
        'You are looking to apply to the same benefit again to get an updated Certificate of Eligibility (COE)',
        `Your most recently used benefit is ${formInfo.formName}`,
      ]}
    />
  );
};

SameBenefitResultDescription.propTypes = {
  formData: PropTypes.shape({
    currentBenefitType: PropTypes.string,
  }),
};

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
    mebBenefitSelection: {
      'ui:title': (
        <span
          className="change-subheader vads-u-font-size--h2 vads-u-font-family--serif vads-u-font-weight--bold vads-u-padding-bottom--2"
          style={{ fontSize: '1.5rem' }}
        >
          Benefit you want to change&nbsp;to
        </span>
      ),
      'ui:description': props => {
        const header = getSwitchFormHeader(
          props?.formData?.mebBenefitSelection,
        );

        return (
          <>
            {header && <h2 className="vads-u-font-size--h2">{header}</h2>}
            <va-additional-info
              onClick={function noRefCheck() {}}
              trigger="Learn more about these benefits"
            >
              <ul className="vads-u-margin-top--1">
                <li>
                  <a
                    href="https://www.va.gov/education/about-gi-bill-benefits/post-9-11"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Learn about GI Bill benefits: Post-9/11 GI Bill, Montgomery
                    GI Bill Active Duty (MGIB-AD), and Montgomery GI Bill
                    Selected Reserve (MGIB-SR) (opens in a new tab)
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.va.gov/family-and-caregiver-benefits/education-and-careers/transferred-gi-bill-benefits/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Learn about survivors’ and dependents’ assistance:
                    transferred Post-9/11 GI Bill benefits (opens in a new tab)
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.va.gov/family-and-caregiver-benefits/education-and-careers/dependents-education-assistance/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Survivors’ and Dependents’ Education Assistance (DEA), Fry
                    Scholarship
                  </a>
                </li>
              </ul>
            </va-additional-info>
          </>
        );
      },
      'ui:widget': 'radio',
      'ui:options': {
        updateSchema: (formData, schema) => {
          const exclude = mapCurrentToSelection(formData?.currentBenefitType);
          if (exclude) {
            const newEnum = [];
            const newEnumNames = [];
            schema.enum.forEach((val, idx) => {
              if (val !== exclude) {
                newEnum.push(val);
                newEnumNames.push(schema.enumNames[idx]);
              }
            });
            return {
              enum: newEnum,
              enumNames: newEnumNames,
            };
          }
          return schema;
        },
      },
    },
  },
  schema: {
    type: 'object',
    required: ['mebBenefitSelection'],
    properties: {
      mebBenefitSelection: {
        type: 'string',
        enum: ['pgib', 'mgib-ad', 'mgib-sr', 'toe', 'dea', 'fry'],
        enumNames: [
          'Post-9/11 GI Bill (PGIB, Chapter 33)',
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

export const sameBenefitResultPage = () => ({
  uiSchema: {
    'ui:description': SameBenefitResultDescription,
  },
  schema: emptySchema,
});

export const foreignSchoolResultPage = () =>
  buildResultPage({
    body:
      'Get answers to your questions about using eligibility at a foreign school. You should receive a reply within 7 business days.',
    resultHeader: 'Ask VA',
    linkHref: 'https://ask.va.gov/',
    linkText: 'Contact us online through Ask VA',
    answers: [
      'You want to update your Certificate of Eligibility (COE) for a foreign school',
    ],
  });

export const mgibAdResultPage = () =>
  buildResultPage({
    body:
      'Based on your answers, use VA Form 22-1990 switch your existing education benefit at the start of your next enrollment period.',
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
      'Based on your answers, use VA Form 22-1990 switch your existing education benefit at the start of your next enrollment period.',
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
      'Based on your answers, use VA Form 22-1990e switch your existing education benefit at the start of your next enrollment period.',
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
      'Based on your answers, use VA Form 22-5490 switch your existing education benefit at the start of your next enrollment period.',
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
      'Based on your answers, use VA Form 22-5490 switch your existing education benefit at the start of your next enrollment period.',
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
