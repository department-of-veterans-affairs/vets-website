import React from 'react';
import { Link } from 'react-router';

import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';

const appealsFAQ = () => (
  <ul>
    <li>
      <a href="/disability-benefits/claims-appeal">
        Find out how appeals work.
      </a>
    </li>
    <li>
      <a href="/disability/get-help-filing-claim">
        Consider getting help from a VSO to appeal the decision on your claim.
      </a>
    </li>
  </ul>
);

const careersFAQ = () => (
  <ul>
    <li>
      <a href="/careers-employment/vocational-rehabilitation">
        See if you’re eligible for vocational rehabilitation benefits.
      </a>
    </li>
    <li>
      <a href="/careers-employment/veteran-owned-business-support">
        Get support for your small business by registering to do business with
        us.
      </a>
    </li>
  </ul>
);

const familyFAQ = () => (
  <ul>
    <li>
      <a href="/education/transfer-post-9-11-gi-bill-benefits">
        Find out how to transfer Post-9/11 GI Bill benefits to family members.
      </a>
    </li>
    <li>
      <a href="/health-care/about-va-health-benefits/long-term-care">
        Consider options for assisted living and home health care.
      </a>
    </li>
  </ul>
);

const survivorFAQ = () => (
  <ul>
    <li>
      <a href="/pension/survivors-pension/">
        See if you’re eligible for pension benefits based on income.
      </a>
    </li>
    <li>
      <a href="/burials-and-memorials/survivor-and-dependent-benefits/">
        Learn about burial and memorial benefits for survivors.
      </a>
    </li>
    <li>
      <a href="/education/survivor-dependent-benefits/">
        Find out about other education and training benefits for survivors.
      </a>
    </li>
  </ul>
);

const healthFAQ = () => (
  <ul>
    <li>
      <a href="/health-care/eligibility/">
        See if you’re eligible for VA health care benefits.
      </a>
    </li>
    <li>
      <a href="/health-care/how-to-apply/">
        Learn how to apply online, by mail, or in person.
      </a>
    </li>
    <li>
      <a href="/health-care/about-va-health-benefits/">
        Find out what kinds of health care and services are covered.
      </a>
    </li>
  </ul>
);

const housingFAQ = () => (
  <ul>
    <li>
      <a href="/health-care/eligibility/">Compare different VA loan types.</a>
    </li>
    <li>
      <a href="/health-care/how-to-apply/">
        Find out if you may be eligible for a VA-backed or VA direct home loan.
      </a>
    </li>
    <li>
      <a href="/health-care/how-to-apply/">
        Learn about grants for adapting your home to meet service-connected
        disability needs.
      </a>
    </li>
  </ul>
);

const lifeInsuranceCTADescription = (
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

const lifeInsuranceFAQ = () => (
  <ul>
    <li>
      <a href="/life-insurance/options-eligibility/">
        Find out which VA life insurance programs may work for you.
      </a>
    </li>
    <li>
      <a href="/life-insurance/options-eligibility/vgli/">
        Consider Veterans’ Group Life Insurance (VGLI) after your service.
      </a>
    </li>
    <li>
      <a href="/life-insurance/options-eligibility/s-dvi/">
        See if Service-Disabled Veterans Life Insurance (S-DVI) might be an
        option.
      </a>
    </li>
  </ul>
);

const burialFAQ = () => (
  <ul>
    <li>
      <a href="/burials-memorials/">
        View all burial benefits and memorial items.
      </a>
    </li>
    <li>
      <a href="/burials-memorials/eligibility/">
        See who’s eligible for burial in a VA national cemetery and other
        honors.
      </a>
    </li>
    <li>
      <a href="/burials-memorials/plan-a-burial/">
        Learn how we can help you plan a burial for a family member.
      </a>
    </li>
    <li>
      <a href="/burials-memorials/dependency-indemnity-compensation/">
        Learn about compensation for surviving spouses, children, and parents.
      </a>
    </li>
  </ul>
);

const pensionFAQ = () => (
  <ul>
    <li>
      <a href="/pension/">See what pension benefits are available.</a>
    </li>
    <li>
      <a href="/pension/eligibility/">
        Find out what the requirements are for receiving pension benefits.
      </a>
    </li>
    <li>
      <a href="/pension/how-to-apply/">
        Learn how to apply for a Veterans pension.
      </a>
    </li>
  </ul>
);

const burialCTADescription = (
  <p>
    You can apply in advance to find out if you can be buried in a VA national
    cemetery. This is called a pre-need determination of eligibility.
  </p>
);

const housingCTADescription = (
  <p>
    You can apply now online for a VA Home Loan Certificate of Eligibility (COE)
    to show your mortgage lender that you qualify for this benefit.
  </p>
);

const disabilityFAQ = () => (
  <div>
    <ul>
      <li>
        <a href="/disability/eligibility">
          See if you’re eligible for compensation.
        </a>
      </li>
      <li>
        <a href="/disability/how-to-file-claim">
          Learn about the different claim types.
        </a>
      </li>
      <li>
        <a href="/disability/get-help-filing-claim">
          Consider working with a trained professional who can help you file
          your claim.
        </a>
      </li>
      <li>
        <a href="/disability/how-to-file-claim">
          Find out how to file a claim online, by mail, or in person.
        </a>
      </li>
      <li>
        <a href="/disability/file-an-appeal">
          Learn how to file an appeal if you disagree with our decision on your
          claim.
        </a>
      </li>
    </ul>
    <h6>You may also be interested in:</h6>
    <ul>
      <li>
        <a href="/careers-employment/vocational-rehabilitation/">
          Vocational Rehabilitation and Employment
        </a>
      </li>
      <li>
        <a href="/housing-assistance/disability-housing-grants/">
          Adaptive Housing Grants
        </a>
      </li>
      <li>
        <a href="/pension/">VA pension benefits</a>
      </li>
      <li>
        <a href="/health-care/family-caregiver-benefits/comprehensive-assistance/">
          The Program of Comprehensive Assistance to Family Caregivers of
          Post-9/11 Veterans
        </a>
      </li>
    </ul>
  </div>
);

const educationFAQ = () => (
  <ul>
    <li>
      <a href="/education/eligibility">
        See if you’re eligible for education benefits.
      </a>
    </li>
    <li>
      <a href="/education/about-gi-bill-benefits">
        Learn about the different types of GI Bill benefits.
      </a>
    </li>
    <li>
      <a href="/gi-bill-comparison-tool">
        Compare schools, tuition costs, and benefits offered.
      </a>
    </li>
    <li>
      <a href="/education/after-you-apply">
        Find out what to expect after you apply.
      </a>
    </li>
    <li>
      <a href="/education/transfer-post-9-11-gi-bill-benefits">
        Learn how to transfer Post-9/11 GI Bill benefits to family members.
      </a>
    </li>
    <li>
      <a href="/careers-employment/vocational-rehabilitation">
        Consider vocational rehabilitation if you have a service-connected
        disability.
      </a>
    </li>
  </ul>
);

const homelessnessAlert = () => (
  <AlertBox
    status="warning"
    headline="If you’re homeless or at risk of becoming homeless:"
  >
    <p>
      You can talk with someone right now. Call the National Call Center for
      Homeless Veterans at 1-877-4AID-VET (
      <a href="tel:+18774243838">1-877-424-3838</a>) for help 24 hours a day, 7
      days a week. You’ll talk privately with a trained VA counselor for free.
    </p>
  </AlertBox>
);

export const benefitChoices = [
  {
    title: 'Health Care',
    description: 'Get health care coverage.',
    slug: 'healthcare',
    introduction:
      'With VA health care, you’re covered for regular checkups with your primary care provider and appointments with specialists like cardiologists, gynecologists, and mental health providers. You can access Veterans health care services like home health or geriatric (elder) care, and get medical equipment, prosthetics, and prescriptions.',
    cta: {
      link: '/health-care/apply/application/introduction',
      text: 'Apply Now for VA Health Care',
    },
    faqs: [
      {
        title: 'How do I apply for VA health care?',
        component: healthFAQ,
      },
    ],
    alert: homelessnessAlert,
  },
  {
    title: 'Disability Compensation',
    description:
      'Find benefits for an illness or injury related to my service.',
    slug: 'disability',
    introduction:
      'You may be able to get VA disability compensation (pay) if you got sick or injured while serving in the military—or if a condition that you already had got worse because of your service. You may qualify even if your condition didn’t appear until years after your service ended.',
    cta: {
      link:
        'https://www.ebenefits.va.gov/ebenefits/about/feature?feature=disability-compensation',
      text: 'File a Claim now on eBenefits',
    },
    faqs: [
      {
        title: 'How do I file a claim for disability compensation?',
        component: disabilityFAQ,
      },
    ],
  },
  {
    title: 'Appeals',
    description: 'Appeal the decision VA made on my disability claim.',
    slug: 'appeals',
    introduction:
      'If you disagree with our decision on your claim for disability compensation, you can file an appeal. You can also get help from a trained professional like a Veterans Service Officer (VSO) who specializes in filing appeals.',
    faqs: [
      {
        title: 'How do I file an appeal?',
        component: appealsFAQ,
      },
    ],
  },
  {
    title: 'Education and Training',
    description: 'Go back to school or get training or certification.',
    slug: 'education',
    introduction:
      'Education benefits like the GI Bill can help you find and pay for the cost of a college or graduate degree program, or training for a specific career, trade, or industry. If you have a service-connected disability, you may also want to consider applying for vocational rehabilitation and employment services.',
    cta: {
      link: '/education/apply',
      text: 'Apply Now for Education Benefits',
    },
    faqs: [
      {
        title: 'How do I apply for and manage education benefits?',
        component: educationFAQ,
      },
    ],
  },
  {
    title: 'Careers and Employment',
    description:
      'Find a job, build skills, or get support for my own business.',
    slug: 'careers',
    introduction:
      'We can support your job search at every stage, whether you’re returning to work with a service-connected disability, looking for new skills and training, or starting or growing your own business. ',
    cta: {
      link: '/careers-employment',
      text: 'View All Related Benefits',
    },
    faqs: [
      {
        title: 'What kinds of career and employment benefits does VA offer?',
        component: careersFAQ,
      },
    ],
    alert: homelessnessAlert,
  },
  {
    title: 'Pension',
    description:
      'Get financial support for my disability or for care related to aging.',
    slug: 'pensions',
    introduction:
      'If you’re a wartime Veteran with low or no income, and you meet certain age or disability requirements, you may be able to get monthly payments through our pension program. Survivors of wartime Veterans may also qualify for a VA pension.  ',
    cta: {
      link: '/pension/application/527EZ/introduction',
      text: 'Apply Now for Pension Benefits',
    },
    faqs: [
      {
        title: 'How do I apply for VA pension benefits?',
        component: pensionFAQ,
      },
    ],
  },
  {
    title: 'Housing Assistance',
    description: 'Find, buy, build, modify, or refinance a place to live.',
    slug: 'housing',
    introduction:
      'We may be able to help you buy or build a home, or repair or refinance your current home. If you have a service-connected disability, you may want to consider applying for a grant to help you make changes to your home that will help you live more independently. ',
    cta: {
      description: housingCTADescription,
      link: '/health-care',
      text: 'Apply for a Home Loan COE',
    },
    faqs: [
      {
        title: 'What kinds of home loans and grants does VA offer?	',
        component: housingFAQ,
      },
    ],
    alert: homelessnessAlert,
  },
  {
    title: 'Life Insurance',
    description: 'Learn about my life insurance options.',
    slug: 'life-insurance',
    introduction:
      'You may be able to get VA life insurance during and after your active duty service. You may also be able to add coverage for your spouse and dependent children.',
    cta: { description: lifeInsuranceCTADescription },
    faqs: [
      {
        title: 'What VA life insurance options may be right for me?',
        component: lifeInsuranceFAQ,
      },
    ],
  },
  {
    title: 'Burial Benefits and Memorial Items',
    shortTitle: 'Burials and Memorials',
    description:
      'Apply for burial in a VA cemetery or for allowances to cover burial costs.',
    slug: 'burials',
    introduction:
      'We can help you plan a burial or memorial service or honor a Veteran’s service with memorial items. If you’re the surviving family member of a Veteran, you may also be able to get help paying for burial costs and other benefits.',
    cta: {
      description: burialCTADescription,
      link:
        '/burials-and-memorials/pre-need/form-10007-apply-for-eligibility/introduction',
      text: 'Apply for Pre-Need Burial Eligibility',
    },
    faqs: [
      {
        title: 'What burial benefits and memorial items does VA offer?',
        component: burialFAQ,
      },
    ],
  },
  {
    title: 'Family and Caregiver Benefits',
    description: 'Learn about benefits for family members and caregivers.',
    slug: 'family',
    introduction:
      'If you’re the family member of a Veteran or Servicemember, you may qualify for benefits yourself. If you’re a caregiver for a Veteran with service-connected disabilities, you may qualify for additional benefits and support for yourself and the Veteran you’re caring for.',
    cta: {
      link: '/health-care/family-caregiver-benefits/',
      text: 'View All Related Benefits',
    },
    faqs: [
      {
        title: 'What kinds of family and caregiver benefits does VA offer?',
        component: familyFAQ,
      },
      {
        title: 'What kinds of benefits does VA offer to survivors?',
        component: survivorFAQ,
      },
    ],
    alert: homelessnessAlert,
  },
];

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

export const SaveFailedMessageComponent = (
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

export const SaveSucceededMessageComponent = handleCloseAlert => (
  <AlertBox
    onCloseAlert={handleCloseAlert}
    status="success"
    headline="We’ve saved your preferences."
  />
);
