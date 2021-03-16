import React from 'react';
import { Link } from 'react-router';

import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';

const makeUnorderedList = questions => (
  <ul>
    {questions.map((question, index) => (
      <li key={index}>
        <a href={question.href}>{question.title}</a>
      </li>
    ))}
  </ul>
);

const appealsQuestions = [
  {
    href: '/disability/file-an-appeal/',
    title: 'Find out how appeals work',
  },
  {
    href: '/disability/get-help-filing-claim',
    title:
      'Consider getting help from a VSO to appeal the decision on your claim',
  },
];
const burialQuestions = [
  {
    href: '/burials-memorials/',
    title: 'View all burial benefits and memorial items',
  },
  {
    href: '/burials-memorials/eligibility/',
    title:
      'See who’s eligible for burial in a VA national cemetery and other honors',
  },
  {
    href: '/burials-memorials/plan-a-burial/',
    title: 'Learn how we can help you plan a burial for a family member',
  },
  {
    href: '/burials-memorials/dependency-indemnity-compensation/',
    title:
      'Learn about compensation for surviving spouses, children, and parents',
  },
];
const careersQuestions = [
  {
    href: '/careers-employment/vocational-rehabilitation',
    title: 'See if you’re eligible for vocational rehabilitation benefits',
  },
  {
    href: '/careers-employment/veteran-owned-business-support',
    title:
      'Get support for your small business by registering to do business with us',
  },
];
const disabilityQuestions = [
  [
    {
      href: '/disability/eligibility',
      title: 'See if you’re eligible for compensation',
    },
    {
      href: '/disability/how-to-file-claim/when-to-file/',
      title: 'Learn about the different claim types',
    },
    {
      href: '/disability/get-help-filing-claim',
      title:
        'Consider working with a trained professional who can help you file your claim',
    },
    {
      href: '/disability/file-an-appeal',
      title:
        'Learn how to file an appeal if you disagree with our decision on your claim',
    },
  ],
  [
    {
      href: '/careers-employment/vocational-rehabilitation/',
      title: 'Veteran Readiness and Employment (VR&E)',
    },
    {
      href: '/housing-assistance/disability-housing-grants/',
      title: 'Adaptive Housing Grants',
    },
    {
      href: '/pension/',
      title: 'VA pension benefits',
    },
    {
      href: '/health-care/family-caregiver-benefits/comprehensive-assistance/',
      title:
        'The Program of Comprehensive Assistance to Family Caregivers of Post-9/11 Veterans',
    },
  ],
];
const educationQuestions = [
  {
    href: '/education/eligibility',
    title: 'See if you’re eligible for education benefits',
  },
  {
    href: '/education/about-gi-bill-benefits',
    title: 'Learn about the different types of GI Bill benefits',
  },
  {
    href: '/gi-bill-comparison-tool',
    title: 'Compare schools, tuition costs, and benefits offered',
  },
  {
    href: '/education/after-you-apply',
    title: 'Find out what to expect after you apply',
  },
  {
    href: '/education/transfer-post-9-11-gi-bill-benefits',
    title: 'Learn how to transfer Post-9/11 GI Bill benefits to family members',
  },
  {
    href: '/careers-employment/vocational-rehabilitation',
    title:
      'Consider vocational rehabilitation if you have a service-connected disability',
  },
];
const familyQuestions = [
  {
    href: '/health-care/family-caregiver-benefits',
    title: 'Find out if you qualify for health care benefits',
  },
  {
    href: '/education/transfer-post-9-11-gi-bill-benefits',
    title:
      'Find out how to transfer Post-9/11 GI Bill benefits to family members',
  },
  {
    href: '/careers-employment/dependent-benefits',
    title: 'See if you’re eligible for educational and career counseling',
  },
  {
    href: '/life-insurance/options-eligibility/fsgli',
    title: 'Learn about Family Service Members’ Group Life Insurance (FSGLI)',
  },
  {
    href: '/health-care/about-va-health-benefits/long-term-care',
    title: 'Consider options for assisted living and home health care',
  },
];
const healthQuestions = [
  {
    href: '/health-care/eligibility/',
    title: 'See if you’re eligible for VA health care benefits',
  },
  {
    href: '/health-care/how-to-apply/',
    title: 'Learn how to apply online, by mail, or in person',
  },
  {
    href: '/health-care/about-va-health-benefits/',
    title: 'Find out what kinds of health care and services are covered',
  },
];
const housingQuestions = [
  {
    href: '/housing-assistance/home-loans/loan-types/',
    title: 'Compare different VA loan types',
  },
  {
    href: '/housing-assistance/home-loans/eligibility/',
    title:
      'Find out if you may be eligible for a VA-backed or VA direct home loan',
  },
  {
    href: '/housing-assistance/disability-housing-grants/',
    title:
      'Learn about grants for adapting your home to meet service-connected disability needs',
  },
];
const lifeInsuranceQuestions = [
  {
    href: '/life-insurance/options-eligibility/',
    title: 'Find out which VA life insurance programs may work for you',
  },
  {
    href: '/life-insurance/options-eligibility/vgli/',
    title: 'Consider Veterans’ Group Life insurance (VGLI) after your service',
  },
  {
    href: '/life-insurance/options-eligibility/s-dvi/',
    title:
      'See if Service-Disabled Veterans Life insurance (S-DVI) might be an option',
  },
];
const pensionQuestions = [
  {
    href: '/pension/',
    title: 'See what pension benefits are available',
  },
  {
    href: '/pension/eligibility/',
    title: 'Find out what the requirements are for receiving pension benefits',
  },
  {
    href: '/pension/how-to-apply/',
    title: 'Learn how to apply for a Veterans Pension',
  },
];
const survivorQuestions = [
  {
    href: '/burials-memorials/veterans-burial-allowance',
    title:
      'Apply for a Veteran’s burial allowance to help cover burial and funeral costs',
  },
  {
    href: '/burials-memorials/bereavement-counseling',
    title: 'Find out if you qualify for bereavement counseling',
  },
  {
    href: '/burials-memorials/dependency-indemnity-compensation',
    title: 'Learn about compensation for survivors',
  },
  {
    href: '/pension/survivors-pension',
    title: 'See if you’re eligible for pension benefits based on income',
  },
  {
    href: '/education/survivor-dependent-benefits',
    title: 'Find out about other education and training benefits for survivors',
  },
];

export const appealsFAQ = () => makeUnorderedList(appealsQuestions);
export const burialFAQ = () => makeUnorderedList(burialQuestions);
export const careersFAQ = () => makeUnorderedList(careersQuestions);
export const disabilityFAQ = () => (
  <div>
    {makeUnorderedList(disabilityQuestions[0])}
    <h6>You may also be interested in:</h6>
    {makeUnorderedList(disabilityQuestions[1])}
  </div>
);
export const educationFAQ = () => makeUnorderedList(educationQuestions);
export const familyFAQ = () => makeUnorderedList(familyQuestions);
export const healthFAQ = () => makeUnorderedList(healthQuestions);
export const housingFAQ = () => makeUnorderedList(housingQuestions);
export const lifeInsuranceFAQ = () => makeUnorderedList(lifeInsuranceQuestions);
export const pensionFAQ = () => makeUnorderedList(pensionQuestions);
export const survivorFAQ = () => makeUnorderedList(survivorQuestions);

export const burialCTADescription = (
  <p>
    You can apply in advance to find out if you can be buried in a VA national
    cemetery. This is called a pre-need determination of eligibility.
  </p>
);

export const housingCTADescription = (
  <p>
    You can apply now online for a VA Home Loan Certificate of Eligibility (COE)
    to show your mortgage lender that you qualify for this benefit.
  </p>
);

export const lifeInsuranceCTADescription = (
  <div>
    <h5>Be sure to apply in time for certain options:</h5>
    <p>
      <strong>For VGLI:</strong> You’ll need to apply within 1 year and 120 days
      of your last day of service. When you apply, you won’t need to prove
      you’re in good health as long as you sign up within 240 days of leaving
      the military.
    </p>
    <p>
      <strong>For SDVI:</strong> You’ll need to apply within 2 years of the date
      we grant your service-connected disability.
    </p>
  </div>
);

export const homelessnessAlert = {
  name: 'homelessness-alert',
  component: ({ onCloseAlert }) => (
    <AlertBox
      status="warning"
      headline="If you’re homeless or at risk of becoming homeless:"
      onCloseAlert={onCloseAlert}
      closeBtnAriaLabel="Close risk of homelessness notification"
    >
      <p>
        You can talk with someone right now. Call the National Call Center for
        Homeless Veterans at 877-4AID-VET (
        <a href="tel:+18774243838">877-424-3838</a>) for help 24 hours a day, 7
        days a week. You’ll talk privately with a trained VA counselor for free.
      </p>
    </AlertBox>
  ),
};

export const RetrieveFailedMessageComponent = ({ showLink }) => (
  <AlertBox
    status="error"
    className="preferences-alert"
    headline="We can’t show your selected benefit information right now."
  >
    <div>
      <p>
        We’re sorry. Something went wrong on our end, and we can’t show you
        information about the benefits you chose. Please check back later.
      </p>
      {showLink && <Link to="/">Go back to my VA</Link>}
    </div>
  </AlertBox>
);

export const SaveFailedMessageComponent = () => (
  <AlertBox
    status="error"
    className="preferences-alert"
    headline="We couldn’t save your update"
  >
    <div>
      <span>
        We’re sorry. Something went wrong on our end, and we couldn’t save your
        update.
      </span>
      <br />
      <span>Please try again or check back later.</span>
    </div>
  </AlertBox>
);

export const SaveSucceededMessageComponent = ({ handleCloseAlert }) => (
  <AlertBox
    onCloseAlert={handleCloseAlert}
    status="success"
    headline="We’ve saved your preferences."
  />
);
