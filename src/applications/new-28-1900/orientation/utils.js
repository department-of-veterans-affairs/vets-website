import React from 'react';

export const orientationSteps = [
  {
    number: 0,
    isVideoStep: false,
    isSubwayContent: false,
    title: 'Veteran Readiness and Employment orientation',
    desc:
      'The Veteran Readiness and Employment (VR&E) program, also referred to as Chapter 31, provides support and services to Veterans and service members with service-connected disabilities. The program can help you:',
    list: [
      'Transition back to civilian life',
      'Find employment, return to your former job, or start your own business',
      'Get education or training for a professional or vocational field that’s a good fit for you',
      'Receive independent living services if you can’t return to work right away',
    ],
    postText: () => (
      <p>
        Learn more about VR&E from our orientation, and decide if it’s right for
        you.
      </p>
    ),
  },
  {
    number: 1,
    isVideoStep: false,
    isSubwayContent: false,
    title: 'VR&E basic benefit information',
    desc:
      'You can get up to 48 months of combined VA benefits. These benefits may include:',
    list: [
      'Training to prepare for a job',
      'Professional or vocational counseling and training',
      'Employment assistance',
    ],
    postText: () => (
      <>
        <p>
          If you are eligible for VR&E and another VA education benefit, speak
          with your Vocational Rehabilitation Counselor (VRC) to determine the
          best fit for you.{' '}
        </p>
        <p>
          If you’re a Veteran released from active duty before January 1, 2013,
          you’re eligible for VR&E benefits and services within a 12 year
          period. If you are a Veteran or Service member with a release date
          date on, or after, January 1, 2013 there’s no eligibility end date.
        </p>
        <p>
          <strong>Note:</strong> we may make this basic peirod of eligibility
          longer in certain cases.
        </p>
      </>
    ),
  },
  {
    number: 2,
    isVideoStep: false,
    isSubwayContent: true,
    title: 'VR&E process',
    desc: 'Learn about the different stages of the process.',
    list: [
      {
        step: 'one',
        title: 'Orientation',
        items: ['Complete VR&E orientation'],
      },
      {
        step: 'two',
        title: 'Application',
        items: [
          'Apply for VR&E benefits',
          'We’ll determine your eligibility and send you an appointment letter',
          'Schedule your initial appointment with a Vocational Rehabilitation Counselor (VRC)',
          'Complete a Rehabilitation Needs Inventory (RNI) and a CareerScope assessment',
          'Gather any necessary materials, like your resume, transcripts, job certifications, and medical records',
        ],
      },
      {
        step: 'three',
        title: 'Entitlement determination',
        items: [
          'Work with your VRC to assess your skills, aptitudes, abilities, and interests',
          'Work with your VRC to identify entitlement criteria (an employment handicap or a serious employment handicap)',
          'Your VRC will give you an entitlement determination and tell you about next steps',
          'Complete any tasks required for your next steps',
        ],
      },
      {
        step: 'four',
        title: 'Services',
        items: [
          'We’ll help you with employment or independent living benefits and services',
          'Report your progress with training programs to your VRC',
          'Get help with anything that may be blocking your participation in the VR&E program',
        ],
      },
      {
        step: 'five',
        title: 'Completion',
        items: [
          'Gain the skills you’ll need to find employment and stay employed, or improve your ability to live independently',
          'Tell your VRC when you find a job',
        ],
      },
    ],
  },
  {
    number: 3,
    isVideoStep: false,
    isSubwayContent: false,
    title: 'VR&E tracks',
    desc:
      'VR&E offers support and services to help you find and keep a job, and live as independently as possible. Your VRC will help determine which of these tracks best meets your needs:',
    list: [
      'Reemployment',
      'Rapid Access to Employment',
      'Self-Employment',
      'Employment Through Long-Term Services',
      'Independent Living',
    ],
    postText: () => (
      <p>
        Learn more about our support-and-services tracks by watching a series of
        short videos.
      </p>
    ),
  },
  {
    number: 4,
    isVideoStep: true,
    isSubwayContent: false,
    title: 'Reemployment track',
    subTitle: () => (
      <>
        <p>
          <strong>VR&E Reemployment video</strong> |{' '}
          <span aria-label="Video duration 52 seconds">0:52</span>
          <em className="vads-u-display--block">
            Return to the civilian job you held before you deployed.
          </em>
        </p>
      </>
    ),
    path: 'SkRD2CDHB_E',
    desc:
      'The Reemployment track provides support to you and your employer so you can return to your former job. This track is for active duty service members and members of the National Guard or Reserves.If you’re in the Reemployment track, we’ll:',
    list: [
      'Work with your employer to figure out how they can best support you',
      'Recommend changes to your physical workplace that can help you succeed',
      'Help you get VA health care services',
      'Give you advice about your reemployment rights',
      'Provide case management',
    ],
  },
  {
    number: 5,
    isVideoStep: true,
    isSubwayContent: false,
    title: 'Rapid Access to Employment track',
    subTitle: () => (
      <>
        <p>
          <strong>VR&E Rapid Access video</strong> |{' '}
          <span aria-label="Video duration 1 minute 32 seconds">1:32</span>
          <em className="vads-u-display--block">
            Find a job that matches your existing skills.
          </em>
        </p>
      </>
    ),
    path: 'VkmTgQftRlk',
    desc:
      'The Rapid Access to Employment track provides services that help Veterans start working right away. This track is right for you if you already have most of the skills you’ll need for the type of job you want. If you’re in the Rapid Access to Employment track, we’ll help you:',
    list: [
      'Find a job that works for your individual skillset and abilities',
      'Prepare for your job by learning about time management, good communication, and other skills',
      'Develop your resume',
      'Prepare for job interviews',
      'Search for a job',
      'Get support from the Department of Labor (DOL) to search for a job',
      'Connect with someone from VR&E after you’ve started working to find out how you’re adjusting and if you need any further support',
    ],
  },
  {
    number: 6,
    isVideoStep: true,
    isSubwayContent: false,
    title: 'Self-Employment track',
    subTitle: () => (
      <>
        <p>
          <strong>VR&E Self-Employment video</strong> |{' '}
          <span aria-label="Video duration 1 minute 12 seconds">1:12</span>
          <em className="vads-u-display--block">
            Get help starting your own business.
          </em>
        </p>
      </>
    ),
    path: 'IYqVu3Q1Wow',
    desc:
      'The Self-Employment track provides services to Veterans and service members who have the skills to start a business and who have a disability that makes traditional employment difficult. If you’re in the Self-Employment track, we’ll support you with:',
    list: [
      'Referrals to resources and guidance to help you develop a business plan',
      'An analysis of your business concept',
      'Training in small business operations, marketing, and finances',
      'Guidance how to find resources to implement your business plan',
    ],
  },
  {
    number: 7,
    isVideoStep: true,
    isSubwayContent: false,
    title: 'Employment Through Long-Term Services track',
    subTitle: () => (
      <>
        <p>
          <strong>VR&E Long-Term Services video</strong> |{' '}
          <span aria-label="Video duration 1 minute 9 seconds">1:09</span>
          <em className="vads-u-display--block">
            Get professional or vocational training to help you develop new job.
            skills
          </em>
        </p>
      </>
    ),
    path: '32oPJaWpUhI',
    desc:
      'The Employment Through Long-Term Services track provides Veterans with the counseling, training, and education they need to become suitably employed. If you’re in the Employment Through Long-Term Services track, we can help you get:',
    list: [
      'Apprenticeships and internships',
      'On-the-Job training (OJT)',
      'Non-Paid Work Experience (NPWE)',
      'A part-time job through the work-study program',
      'College, vocational, or technical training',
      'Money to cover tuition, fees, books, and supplies',
      'Money to use toward housing and food (called subsistence allowance)',
      'Personalized case management support',
      'A job that works for your individual skillset and abilities',
    ],
  },
  {
    number: 8,
    isVideoStep: true,
    isSubwayContent: false,
    title: 'Independent Living track',
    subTitle: () => (
      <>
        <p>
          <strong>VR&E Independent Living video</strong> |{' '}
          <span aria-label="Video duration 47 seconds">0:47</span>
          <em className="vads-u-display--block">
            Live as independently as possible.
          </em>
        </p>
      </>
    ),
    path: '_Yd0aW_NZvA',
    desc:
      'The Independent Living track provides services to Veterans and service members who have a disability that prevents them from looking for or returning to work. If you’re in this track, we’ll help you live as independently as possible. We can help you get:',
    list: [
      'Support through technology (called assistive technology)',
      'Training so you have the skills to live more independently',
      'Community support services',
      'Better access to the community',
      'A volunteer position',
      'Home adaptations so you can live more independently',
    ],
  },
  {
    title: 'Thank you for viewing the VR&E orientation',
  },
];
