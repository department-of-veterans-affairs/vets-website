import React from 'react';
import { Link } from 'react-router';

import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';

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

const disabilityFAQ = () => (
  <div>
    <ul>
      <li>
        <a href="/disability/eligibility">
          See if you’re eligible for compensation.
        </a>
      </li>
      <li>
        <a href="/disability/how-to-file-claim/when-to-file/">
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
    <h5>You may also be interested in:</h5>
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

const healthCareAlert = () => (
  <AlertBox
    status="warning"
    headline="If you’re homeless or at risk of becoming homeless"
  >
    <p>
      If you or someone you know is at risk of becoming homeless, call the
      National Call Center for Homeless Veterans at 1-877-4AID-VET (
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
      'With VA health care, you’re covered for regular checkups with your primary care provider and appointments with specialists (like cardiologists, gynecologists, and mental health providers). You can access Veterans health care services like home health and geriatric (elder) care, and you can get medical equipment, prosthetics, and prescriptions.',
    ctaLink: '/health-care',
    ctaText: 'Apply Now for Health Care',
    faqTitle: 'What should I do before I apply for health care?',
    faqComponent: healthFAQ,
    alert: healthCareAlert,
  },
  {
    title: 'Disability Benefits',
    description:
      'Find benefits for an illness or injury related to my service.',
    slug: 'disability',
    introduction:
      'You may be able to get VA disability compensation (pay) if you got sick or injured while serving in the military - or if a condition that you already had got worse because of your service. You may qualify even if your condition didn’t appear until years after your service ended.',
    ctaLink: '/disability', // TODO: update link
    ctaText: 'File a Claim now on eBenefits',
    faqTitle: 'What should I do before I apply for disability compensation?',
    faqComponent: disabilityFAQ,
  },
  {
    title: 'Appeals',
    description: 'Appeal the decision VA made on my disability claim.',
    slug: 'appeals',
    introduction:
      'With VA health care, you’re covered for regular checkups with your primary care provider and appointments with specialists (like cardiologists, gynecologists, and mental health providers). You can access Veterans health care services like home health and geriatric (elder) care, and you can get medical equipment, prosthetics, and prescriptions.', // TODO: update text
    ctaLink: '/health-care', // TODO: update link
    ctaText: 'Apply for Health Care', // TODO: update text
    faqTitle: 'What should I do before I apply for health care?', // TODO: update text
    faqComponent: healthFAQ, // TODO: update component
  },
  {
    title: 'Education and Training',
    description: 'Go back to school or get training or certification.',
    slug: 'education',
    introduction:
      'Education benefits like the GI Bill can help you find and pay for the cost of a college or graduate degree program, or training for a specific career, trade or industry.',
    ctaLink: '/education',
    ctaText: 'Apply Now for Education Benefits',
    faqTitle: 'What should I do before I apply for education benefits?',
    faqComponent: educationFAQ,
  },
  {
    title: 'Careers and Employment',
    description:
      'Find a job, build skills, or get support for my own business.',
    slug: 'careers', // TODO: update rest
    introduction:
      'With VA health care, you’re covered for regular checkups with your primary care provider and appointments with specialists (like cardiologists, gynecologists, and mental health providers). You can access Veterans health care services like home health and geriatric (elder) care, and you can get medical equipment, prosthetics, and prescriptions.',
    ctaLink: '/health-care',
    ctaText: 'Apply for Health Care',
    faqTitle: 'What should I do before I apply for health care?',
    faqComponent: healthFAQ,
  },
  {
    title: 'Pensions',
    description:
      'Get financial support for my disability or for care related to aging.',
    slug: 'pensions', // TODO: update rest
    introduction:
      'With VA health care, you’re covered for regular checkups with your primary care provider and appointments with specialists (like cardiologists, gynecologists, and mental health providers). You can access Veterans health care services like home health and geriatric (elder) care, and you can get medical equipment, prosthetics, and prescriptions.',
    ctaLink: '/health-care',
    ctaText: 'Apply for Health Care',
    faqTitle: 'What should I do before I apply for health care?',
    faqComponent: healthFAQ,
  },
  {
    title: 'Housing Assistance',
    description: 'Find, buy, build, modify, or refinance a place to live.',
    slug: 'housing', // TODO: update rest
    introduction:
      'With VA health care, you’re covered for regular checkups with your primary care provider and appointments with specialists (like cardiologists, gynecologists, and mental health providers). You can access Veterans health care services like home health and geriatric (elder) care, and you can get medical equipment, prosthetics, and prescriptions.',
    ctaLink: '/health-care',
    ctaText: 'Apply for Health Care',
    faqTitle: 'What should I do before I apply for health care?',
    faqComponent: healthFAQ,
  },
  {
    title: 'Life Insurance',
    description: 'Learn about my life insurance options.',
    slug: 'life-insurance', // TODO: update rest
    introduction:
      'With VA health care, you’re covered for regular checkups with your primary care provider and appointments with specialists (like cardiologists, gynecologists, and mental health providers). You can access Veterans health care services like home health and geriatric (elder) care, and you can get medical equipment, prosthetics, and prescriptions.',
    ctaLink: '/health-care',
    ctaText: 'Apply for Health Care',
    faqTitle: 'What should I do before I apply for health care?',
    faqComponent: healthFAQ,
  },
  {
    title: 'Burials and Memorials',
    description:
      'Apply for burial in a VA cemetery or for allowances to cover burial costs.',
    slug: 'burials', // TODO: update rest
    introduction:
      'With VA health care, you’re covered for regular checkups with your primary care provider and appointments with specialists (like cardiologists, gynecologists, and mental health providers). You can access Veterans health care services like home health and geriatric (elder) care, and you can get medical equipment, prosthetics, and prescriptions.',
    ctaLink: '/health-care',
    ctaText: 'Apply for Health Care',
    faqTitle: 'What should I do before I apply for health care?',
    faqComponent: healthFAQ,
  },
  {
    title: 'Family and Caregiver Benefits',
    description: 'Learn about benefits for family members and caregivers.',
    slug: 'family', // TODO: update rest
    introduction:
      'With VA health care, you’re covered for regular checkups with your primary care provider and appointments with specialists (like cardiologists, gynecologists, and mental health providers). You can access Veterans health care services like home health and geriatric (elder) care, and you can get medical equipment, prosthetics, and prescriptions.',
    ctaLink: '/health-care',
    ctaText: 'Apply for Health Care',
    faqTitle: 'What should I do before I apply for health care?',
    faqComponent: healthFAQ,
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

export const SaveSucceededMessageComponent = (
  <AlertBox status="success" headline="We’ve saved your preferences." />
);
