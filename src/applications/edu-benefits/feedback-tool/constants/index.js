import React from 'react';

export const complaintTypesList = [
  {
    content: [
      {
        type: 'text',
        value: 'Recruiting/Marketing Practices',
      },
    ],
  },
  {
    content: [
      {
        type: 'text',
        value: 'Accreditation',
      },
    ],
  },
  {
    content: [
      {
        type: 'text',
        value: 'Financial Issues (e.g. Tuition/Fee charges)',
      },
    ],
  },
  {
    content: [
      {
        type: 'text',
        value: 'Student Loans',
      },
    ],
  },
  {
    content: [
      {
        type: 'text',
        value: 'Post-Graduation Job Opportunities',
      },
    ],
  },
  {
    content: [
      {
        type: 'text',
        value: 'Change in Degree Plan/Requirements',
      },
    ],
  },
  {
    content: [
      {
        type: 'text',
        value: 'Quality of Education',
      },
    ],
  },
  {
    content: [
      {
        type: 'text',
        value: 'Grade Policy',
      },
    ],
  },
  {
    content: [
      {
        type: 'text',
        value: 'Release of transcripts',
      },
    ],
  },
  {
    content: [
      {
        type: 'text',
        value: 'Transfer of Credits',
      },
    ],
  },
  {
    content: [
      {
        type: 'text',
        value: 'Refund Issues',
      },
    ],
  },
  {
    content: [
      {
        type: 'text',
        value: 'Other',
      },
    ],
  },
];

export const complaintList = [
  {
    content: [
      {
        type: 'text',
        value: 'Military Tuition Assistance or MyCAA – ',
      },
      {
        type: 'link',
        value: 'Postsecondary Education Complaint System',
        href: 'https://pecs.militaryonesource.mil/pecs/',
        target: '_blank',
      },
    ],
  },
  {
    content: [
      {
        type: 'text',
        value: 'Federal financial aid (e.g., Pell Grants and federal loans) – ',
      },
      {
        type: 'link',
        value: 'Department of Education (email complaint)',
        href: 'mailto:Compliancecomplaints@ed.gov',
        isEmail: true,
      },
    ],
  },
  {
    content: [
      {
        type: 'text',
        value: 'Private student loans – ',
      },
      {
        type: 'link',
        value: 'Consumer Financial Protection Bureau',
        href: 'https://www.consumerfinance.gov/complaint/',
        target: '_blank',
      },
    ],
  },
];
export const prepareList = [
  {
    content: [
      {
        type: 'text',
        value: 'Provide your school’s name and address.',
      },
    ],
  },
  {
    content: [
      {
        type: 'text',
        value: 'Tell us the education benefits you’re using.',
      },
    ],
  },
  {
    content: [
      {
        type: 'text',
        value:
          'Give us your feedback. Please provide as much detail as possible to understand your issue.',
      },
    ],
  },
  {
    content: [
      {
        type: 'text',
        value: 'Let us know how you think we could resolve your issue.',
      },
    ],
  },
  {
    content: [
      {
        type: 'text',
        value:
          'Provide your email address if you want us to respond to you directly.',
      },
    ],
  },
];
export const getHelpList = [
  {
    content: [
      {
        type: 'text',
        value: 'GI Bill Hotline: ',
      },
      {
        type: 'phone',
        value: '1-888-442-4551',
        number: '888-GIBILL-1 (888-442-4551)',
      },
    ],
  },
  {
    content: [
      {
        type: 'text',
        value: 'Students Outside the U.S.: ',
      },
      {
        type: 'phone',
        value: '+1-918-781-5678',
        number: '+1-918-781-5678',
      },
    ],
  },
  {
    content: [
      {
        type: 'text',
        value: 'VA benefits hotline: ',
      },
      {
        type: 'phone',
        value: '1-800-827-1000',
        number: '800-827-1000',
      },
    ],
  },
  {
    content: [
      {
        type: 'text',
        value: 'MyVA411 main information line: ',
      },
      {
        type: 'phone',
        value: '1-800-698-2411',
        number: '800-698-2411',
      },
    ],
  },
  {
    content: [
      {
        type: 'text',
        value: 'Telecommunications Relay Services (using TTY) ',
      },
      {
        type: 'phone',
        value: '1+711',
        number: 'TTY: 711',
      },
    ],
  },
];
export const maxCharAllowed = char => (
  <p className="max-char vads-u-color--gray-medium">
    {`${char} characters maximum`}
  </p>
);
