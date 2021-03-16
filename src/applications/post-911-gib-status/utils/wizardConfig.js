import React from 'react';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';

const wizardConfig = [
  {
    type: 'recentApplication',
    previous: null,
    label: 'When did you apply for benefits?',
    options: [
      {
        label: 'Less than 30 days ago',
        value: true,
      },
      {
        label: 'More than 30 days ago',
        value: false,
      },
    ],
    isActive: () => true,
  },
  {
    type: 'recentMessage',
    previous: 'recentApplication',
    component: () => (
      <AlertBox
        headline="We’re still processing your application"
        content={
          <p>
            It takes us about 30 days to process applications. If you applied
            less than 30 days ago, please check back soon.
          </p>
        }
        status="warning"
      />
    ),
    isActive: previousValue => previousValue === true,
  },
  {
    type: 'veteran',
    previous: 'recentApplication',
    label:
      'Are you a Veteran or service member claiming a benefit based on your own service?',
    options: [
      {
        label: 'Yes',
        value: true, // the ds component doesn't handle booleans
      },
      {
        label: 'No',
        value: false,
      },
    ],
    isActive: previousValue => previousValue === false,
  },
  {
    type: 'automaticEligibility',
    previous: 'veteran',
    component: () => (
      <AlertBox
        headline="We’re sorry. Dependents can’t access the GI Bill benefits tool on VA.gov"
        content={
          <div>
            <p>
              The GI Bill benefit statement isn't available online to family
              members and dependents. You'll need to request a new Certificate
              of Eligibility letter to check your GI Bill benefit status.
            </p>
            <p>
              To request a COE, please call the Education Call Center at
              888-442-4551 (888-GI-BILL-1). We’re here Monday through Friday,
              8:00 a.m. to 7:00 p.m. ET.
            </p>
          </div>
        }
        status="warning"
      />
    ),
    isActive: previousValue => previousValue === false,
  },
  {
    type: 'errorMessage',
    previous: 'veteran',
    component: () => (
      <AlertBox
        headline="We’re sorry. We still can’t find your Post-9/11 GI Bill benefit statement"
        content={
          <div>
            <p>
              If you’re having trouble accessing your benefit statement, please
              call the Education Call Center at 888-442-4551 (888-GI-BILL-1).
              We’re here Monday through Friday, 8:00 a.m. to 7:00 p.m. ET.
            </p>
          </div>
        }
        status="warning"
      />
    ),
    isActive: previousValue => previousValue === true,
  },
];

export default wizardConfig;
