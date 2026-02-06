import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import environment from 'platform/utilities/environment';
import { isLOA3 } from 'platform/user/selectors';
import YourInformationDescription, {
  getBenefitLabel,
} from '../components/YourInformationDescription';

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
    link: '/education/apply-for-gi-bill-form-22-1990/introduction',
    linkText: 'Apply for education benefits (VA Form 22-1990)',
    formName: 'VA Form 22-1990',
    recentlyUsedBenefit: getBenefitLabel(benefitType),
  };
  const form5490 = {
    header:
      "Dependent's Application for VA Education Benefits (VA Form 22-5490)",
    link:
      '/family-and-caregiver-benefits/education-and-careers/apply-for-dea-fry-form-22-5490',
    linkText: 'Apply for education benefits (VA Form 22-5490)',
    formName: 'VA Form 22-5490',
    recentlyUsedBenefit: getBenefitLabel(benefitType),
  };
  const form1990e = {
    header: 'Application for VA Education Benefits (VA Form 22-1990e)',
    link:
      '/family-and-caregiver-benefits/education-and-careers/transferred-gi-bill-benefits/apply-form-22-1990e',
    linkText: 'Apply for education benefits (VA Form 22-1990e)',
    formName: 'VA Form 22-1990e',
    recentlyUsedBenefit: getBenefitLabel(benefitType),
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
    case 'pgib':
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
    {linkHref &&
      linkText && (
        <va-link-action type="primary" href={linkHref} text={linkText} />
      )}
    <div className="usa-alert background-color-only">
      <h4 className="vads-u-margin-top--0">Your answers:</h4>
      <ul className="vads-u-list-style--none vads-u-padding-left--0">
        {answers.map((answer, index) => (
          <li
            key={index}
            className="vads-u-display--flex vads-u-align-items--start vads-u-margin-bottom--2"
          >
            <span className="vads-u-margin-right--1">
              <va-icon icon="check" size={3} style={{ color: '#008817' }} />
            </span>
            <span>{answer}</span>
          </li>
        ))}
      </ul>
    </div>
    <va-link
      href={`${
        environment.BASE_URL
      }/education/apply-for-education-benefits/application/1995/introduction`}
      text="Restart questionnaire"
      class="vads-u-display--block vads-u-margin-top--3"
    />
  </div>
);

const SameBenefitResultDescription = ({ formData }) => {
  // Use mebSameBenefitSelection if available (non-LOA3), otherwise use currentBenefitType (LOA3)
  const benefitType =
    formData?.mebSameBenefitSelection || formData?.currentBenefitType;
  const formInfo = getFormInfo(benefitType);
  const recentlyUsedBenefit =
    formInfo.recentlyUsedBenefit &&
    formInfo.recentlyUsedBenefit !== "We couldn't load your current benefit."
      ? formInfo.recentlyUsedBenefit
      : formInfo.formName;

  return (
    <ResultDescription
      resultHeader={formInfo.header}
      body={`Based on your answers, use ${
        formInfo.formName
      } to apply to the same benefit again to get an updated COE.`}
      linkHref={formInfo.link}
      linkText={formInfo.linkText}
      answers={[
        'You are looking to apply to the same benefit again to get an updated Certificate of Eligibility (COE)',
        `Your most recently used benefit is ${recentlyUsedBenefit}`,
      ]}
    />
  );
};

SameBenefitResultDescription.propTypes = {
  formData: PropTypes.shape({
    currentBenefitType: PropTypes.string,
    mebSameBenefitSelection: PropTypes.string,
  }),
};

const BenefitSwitchDescription = () => {
  return (
    <va-additional-info
      onClick={function noRefCheck() {}}
      trigger="Learn more about these benefits"
    >
      <ul className="vads-u-margin-top--1">
        <li>
          Learn about GI Bill benefits:{' '}
          <va-link
            external
            href="https://www.va.gov/education/about-gi-bill-benefits/post-9-11"
            text="Post-9/11 GI Bill, Montgomery GI Bill Active Duty (MGIB-AD)"
          />
          ,{' '}
          <va-link
            external
            href="https://www.va.gov/education/about-gi-bill-benefits/montgomery-active-duty"
            text="Montgomery GI Bill Active Duty (MGIB-AD)"
          />
          , and{' '}
          <va-link
            external
            href="https://www.va.gov/education/about-gi-bill-benefits/montgomery-selected-reserve"
            text="Montgomery GI Bill Selected Reserve (MGIB-SR)"
          />
        </li>
        <li>
          <va-link
            external
            href="https://www.va.gov/family-and-caregiver-benefits/education-and-careers/transferred-gi-bill-benefits"
            text="Learn about transferred Post-9/11 GI Bill benefits"
          />
        </li>
        <li>
          Learn about survivors’ and dependents’ assistance:{' '}
          <va-link
            external
            href="https://www.va.gov/family-and-caregiver-benefits/education-and-careers/dependents-education-assistance/"
            text="Survivors' and Dependents' Education Assistance (DEA)"
          />{' '}
          and{' '}
          <va-link
            external
            href="https://www.va.gov/family-and-caregiver-benefits/education-and-careers/fry-scholarship/"
            text="Fry Scholarship"
          />
        </li>
      </ul>
    </va-additional-info>
  );
};

const YourInformationTitle = () => {
  const isLoa3 = useSelector(isLOA3);

  return isLoa3 ? (
    <span>What do you want to do?</span>
  ) : (
    <h2 className="vads-u-margin-y--0 vads-u-display--inline">
      What do you want to do?
    </h2>
  );
};

export const yourInformationPage = () => ({
  uiSchema: {
    'ui:description': YourInformationDescription,
    mebWhatDoYouWantToDo: {
      'ui:title': <YourInformationTitle />,
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

export const sameBenefitSelectionPage = () => ({
  uiSchema: {
    mebSameBenefitSelection: {
      'ui:title': (
        <h2 className="vads-u-margin-y--0 vads-u-display--inline">
          Which benefit have you most recently used?
        </h2>
      ),
      'ui:description': BenefitSwitchDescription,
      'ui:widget': 'radio',
    },
  },
  schema: {
    type: 'object',
    required: ['mebSameBenefitSelection'],
    properties: {
      mebSameBenefitSelection: {
        type: 'string',
        enum: [
          'chapter33',
          'chapter30',
          'chapter1606',
          'transferOfEntitlement',
          'chapter35',
          'fryScholarship',
        ],
        enumNames: [
          'Post-9/11 GI Bill (PGIB, Chapter 33)',
          'Montgomery GI Bill Active Duty (MGIB-AD, Chapter 30)',
          'Montgomery GI Bill Selected Reserve (MGIB-SR, Chapter 1606)',
          'Transferred Post-9/11 GI Bill benefits (Transfer of Entitlement Program, TOE)',
          "Dependents' Educational Assistance (DEA, Chapter 35)",
          'Fry Scholarship (Chapter 33)',
        ],
      },
    },
  },
});

export const benefitSwitchPage = () => ({
  uiSchema: {
    mebBenefitSelection: {
      'ui:title': (
        <h2 className="vads-u-margin-y--0 vads-u-display--inline">
          Benefit you want to change to
        </h2>
      ),
      'ui:description': BenefitSwitchDescription,
      'ui:widget': 'radio',
      'ui:options': {
        updateSchema: (formData, schema) => {
          const currentBenefit = mapCurrentToSelection(
            formData?.currentBenefitType,
          );
          const exclude = [currentBenefit];
          if (['dea', 'fry'].includes(currentBenefit)) {
            exclude.push('dea', 'fry');
          }

          if (exclude.length > 0) {
            const newEnum = [];
            const newEnumNames = [];
            schema.enum.forEach((val, idx) => {
              if (!exclude.includes(val)) {
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
          'Transferred Post-9/11 GI Bill benefits (Transfer of Entitlement Program, TOE)',
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
    resultHeader: getSwitchFormHeader('mgib-ad'),
    body:
      'Based on your answers, use VA Form 22-1990 to switch your existing education benefit at the start of your next enrollment period.',
    linkHref: `${
      environment.BASE_URL
    }/education/apply-for-gi-bill-form-22-1990/introduction`,
    linkText: 'Apply for education benefits (VA Form 22-1990)',
    answers: [
      'You are looking to apply to switch your existing education benefit and get a new Certificate of Eligibility (COE)',
      'You want to change your current benefit to the Montgomery GI Bill (MGIB-AD, Chapter 30)',
    ],
  });

export const mgibSrResultPage = () =>
  buildResultPage({
    resultHeader: getSwitchFormHeader('mgib-sr'),
    body:
      'Based on your answers, use VA Form 22-1990 to switch your existing education benefit at the start of your next enrollment period.',
    linkHref: `${
      environment.BASE_URL
    }/education/apply-for-gi-bill-form-22-1990/introduction`,
    linkText: 'Apply for education benefits (VA Form 22-1990)',
    answers: [
      'You are looking to apply to switch your existing education benefit and get a new Certificate of Eligibility (COE)',
      'You want to change your current benefit to the Montgomery GI Bill Selected Reserve (MGIB-SR, Chapter 1606)',
    ],
  });

export const toeResultPage = () =>
  buildResultPage({
    resultHeader: getSwitchFormHeader('toe'),
    body:
      'Based on your answers, use VA Form 22-1990e to switch your existing education benefit at the start of your next enrollment period.',
    linkHref: `${
      environment.BASE_URL
    }/family-and-caregiver-benefits/education-and-careers/transferred-gi-bill-benefits/apply-form-22-1990e`,
    linkText: 'Apply for education benefits (VA Form 22-1990e)',
    answers: [
      'You are looking to apply to switch your existing education benefit and get a new Certificate of Eligibility (COE)',
      'You want to change your current benefit to the Transferred Post-9/11 GI Bill benefits (Transfer of Entitlement Program, TOE)',
    ],
  });

export const deaResultPage = () =>
  buildResultPage({
    resultHeader: getSwitchFormHeader('dea'),
    body:
      'Based on your answers, use VA Form 22-5490 to switch your existing education benefit at the start of your next enrollment period.',
    linkHref: `${
      environment.BASE_URL
    }/family-and-caregiver-benefits/education-and-careers/apply-for-dea-fry-form-22-5490/introduction`,
    linkText: 'Apply for education benefits (VA Form 22-5490)',
    answers: [
      'You are looking to apply to switch your existing education benefit and get a new Certificate of Eligibility (COE)',
      'You want to change your current benefit to the Dependents’ Education Assistance (DEA, Chapter 35)',
    ],
  });

export const fryResultPage = () =>
  buildResultPage({
    resultHeader: getSwitchFormHeader('fry'),
    body:
      'Based on your answers, use VA Form 22-5490 to switch your existing education benefit at the start of your next enrollment period.',
    linkHref: `${
      environment.BASE_URL
    }/family-and-caregiver-benefits/education-and-careers/apply-for-dea-fry-form-22-5490/introduction`,
    linkText: 'Apply for education benefits (VA Form 22-5490)',
    answers: [
      'You are looking to apply to switch your existing education benefit and get a new Certificate of Eligibility (COE)',
      'You want to change your current benefit to the Fry Scholarship (Chapter 33)',
    ],
  });

export const pgibResultPage = () =>
  buildResultPage({
    resultHeader: getSwitchFormHeader('pgib'),
    body:
      'Based on your answers, use VA Form 22-1990 to switch your existing education benefit at the start of your next enrollment period.',
    linkHref: `${
      environment.BASE_URL
    }/education/apply-for-gi-bill-form-22-1990/introduction`,
    linkText: 'Apply for education benefits (VA Form 22-1990)',
    answers: [
      'You are looking to apply to switch your existing education benefit and get a new Certificate of Eligibility (COE)',
      'You want to change your current benefit to the Post-9/11 GI Bill (PGIB, Chapter 33)',
    ],
  });

ResultDescription.propTypes = {
  answers: PropTypes.arrayOf(PropTypes.string).isRequired,
  body: PropTypes.string.isRequired,
  linkHref: PropTypes.string,
  linkText: PropTypes.string,
  resultHeader: PropTypes.string,
};
