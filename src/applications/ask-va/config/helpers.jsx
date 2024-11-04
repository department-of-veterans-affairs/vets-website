import React from 'react';

export const ServerErrorAlert = () => (
  <>
    <h2
      slot="headline"
      className="vads-u-font-size--h3 vads-u-margin-y--0 vads-u-font-size--lg"
    >
      We’re sorry. Something went wrong on our end
    </h2>
    <p className="vads-u-font-size--base">
      Please refresh this page or check back later. You can also sign out of
      VA.gov and try signing back into this page.
    </p>
  </>
);

export const contactRules = {
  'Benefits issues outside the U.S.': {
    'Disability compensation': ['EMAIL', 'PHONE', 'US_MAIL'],
    'Education benefits and work study': ['EMAIL'],
  },
  'Burials and memorials': {
    'Burial allowance': ['EMAIL', 'PHONE', 'US_MAIL'],
    'Burial allowance for unclaimed Veteran remains': ['EMAIL', 'PHONE'],
    'Burial in a VA grant-funded state or tribal cemetery': ['EMAIL', 'PHONE'],
    'Burial in a VA national cemetery': ['EMAIL', 'PHONE'],
    'Memorial items': ['EMAIL', 'PHONE'],
    'Pre-need eligibility for burial': ['EMAIL', 'PHONE'],
    Other: ['EMAIL', 'PHONE'],
  },
  'Center for Minority Veterans': {
    'Programs and policies': ['EMAIL', 'PHONE', 'US_MAIL'],
  },
  'Center for Women Veterans': {
    'General question': ['EMAIL'],
    'Programs and policies': ['EMAIL'],
  },
  'Debt for benefit overpayments and health care copay bills': {
    'Education benefit overpayments (for school officials)': [
      'EMAIL',
      'PHONE',
      'US_MAIL',
    ],
    'Burial benefit overpayments': ['EMAIL', 'PHONE', 'US_MAIL'],
    'Disability compensation overpayments': ['EMAIL', 'PHONE', 'US_MAIL'],
    'Drill pay overpayments': ['EMAIL', 'PHONE', 'US_MAIL'],
    'Education benefit overpayments (for students)': [
      'EMAIL',
      'PHONE',
      'US_MAIL',
    ],
    'Health care copay debt': ['EMAIL', 'PHONE', 'US_MAIL'],
    'Home loan overpayments': ['EMAIL', 'PHONE', 'US_MAIL'],
    'Pension benefit overpayments': ['EMAIL', 'PHONE', 'US_MAIL'],
    'Separation pay overpayments': ['EMAIL', 'PHONE', 'US_MAIL'],
    'Severance pay overpayments': ['EMAIL', 'PHONE', 'US_MAIL'],
    'Veteran Readiness and Employment overpayments': [
      'EMAIL',
      'PHONE',
      'US_MAIL',
    ],
  },
  'Decision reviews and appeals': {
    'Board Appeals': ['EMAIL', 'PHONE', 'US_MAIL'],
    'Higher-Level Reviews or Supplemental Claims': [
      'EMAIL',
      'PHONE',
      'US_MAIL',
    ],
  },
  'Defense Enrollment Eligibility Reporting System (DEERS)': {
    'Adding requests': ['EMAIL'],
    'Updating DEERS records': ['EMAIL'],
  },
  'Disability compensation': {
    'Aid and Attendance or Housebound benefits': ['EMAIL', 'PHONE', 'US_MAIL'],
    'Claim status': ['EMAIL', 'PHONE', 'US_MAIL'],
    'Direct deposit': ['EMAIL', 'PHONE', 'US_MAIL'],
    'Guardianship, custodianship, or fiduciary issues': [
      'EMAIL',
      'PHONE',
      'US_MAIL',
    ],
    'How to file a claim': ['EMAIL', 'PHONE', 'US_MAIL'],
    'Payment issues': ['EMAIL', 'PHONE', 'US_MAIL'],
  },
  'Education benefits and work study': {
    'Benefits for survivors and dependents': ['EMAIL'],
    'Certificate of Eligibility (COE) or Statement of Benefits': ['EMAIL'],
    'Compliance surveys': ['EMAIL'],
    'Educational and career counseling': ['EMAIL'],
    'Licensing and testing fees': ['EMAIL'],
    'Montgomery GI Bill Active Duty (Chapter 30)': ['EMAIL'],
    'Montgomery GI Bill Selected Reserve (Chapter 1606)': ['EMAIL'],
    'On-the-job training and apprenticeships': ['EMAIL'],
    'Post-9/11 GI Bill (Chapter 33)': ['EMAIL'],
    'Reserve Educational Assistance Program (Chapter 1607)': ['EMAIL'],
    'School Certifying Officials (SCOs)': ['EMAIL'],
    'Transfer of benefits': ['EMAIL'],
    'Tuition Assistance Top-Up': ['EMAIL'],
    'Verifying school enrollment': ['EMAIL'],
    'Veteran Readiness and Employment (Chapter 31)': [
      'EMAIL',
      'PHONE',
      'US_MAIL',
    ],
    'Veterans’ Educational Assistance Program (Chapter 32)': ['EMAIL'],
    'Web Automated Verification of Enrollment (WAVE)': ['EMAIL'],
    'Work study': ['EMAIL'],
  },
  'Guardianship, custodianship, or fiduciary issues': {
    'Accounting issue': ['EMAIL', 'PHONE', 'US_MAIL'],
    'Investigations and field examinations': ['EMAIL', 'PHONE', 'US_MAIL'],
    Other: ['EMAIL', 'PHONE', 'US_MAIL'],
  },
  'Health care': {
    'Audiology and hearing aids': ['EMAIL'],
    'Billing and copays': ['EMAIL'],
    'Career opportunities at VA health facilities': ['EMAIL', 'PHONE'],
    'Caregiver support program': ['EMAIL', 'PHONE'],
    'Eligibility and how to apply': ['EMAIL'],
    'Family member health benefits': ['EMAIL', 'PHONE'],
    'Foreign Medical Program': ['EMAIL', 'PHONE'],
    'Getting care at a local VA medical center': ['EMAIL', 'PHONE', 'US_MAIL'],
    Prosthetics: ['EMAIL'],
    'Vet Centers and readjustment counseling': ['EMAIL'],
    "Women's health services": ['EMAIL', 'PHONE'],
  },
  'Housing assistance and home loans': {
    Appraisals: ['EMAIL', 'PHONE'],
    'Funding fee refund': ['EMAIL', 'PHONE'],
    'Help to avoid foreclosure': ['EMAIL', 'PHONE'],
    'Home loan benefits': ['EMAIL', 'PHONE'],
    'Homes for sale by VA': ['EMAIL', 'PHONE'],
    'Home Loan Certificate of Eligibility (COE) or Restoration of Entitlement (ROE)': [
      'EMAIL',
      'PHONE',
    ],
    'Native American Direct Loan (NADL)': ['EMAIL', 'PHONE'],
    'Property titles and taxes for homes sold by VA': ['EMAIL', 'PHONE'],
    'Specially Adapted Housing (SAH) and Special Home Adaptation (SHA) grants': [
      'EMAIL',
      'PHONE',
    ],
  },
  'Life insurance': {
    'Accessing policy online': ['EMAIL', 'PHONE'],
    'Family Servicemembers’ Group Life Insurance (FSGLI)': ['EMAIL', 'PHONE'],
    'Insurance claims': ['EMAIL', 'PHONE'],
    'Insurance premiums': ['EMAIL', 'PHONE'],
    'Insurance website issues': ['EMAIL', 'PHONE'],
    'Policy loans': ['EMAIL', 'PHONE'],
    'Service-Disabled Veterans Life Insurance (S-DVI)': ['EMAIL', 'PHONE'],
    'Servicemembers’ Group Life Insurance (SGLI)': ['EMAIL', 'PHONE'],
    'Veterans Affairs Life Insurance (VALife)': ['EMAIL', 'PHONE'],
    'Veterans’ Group Life Insurance (VGLI)': ['EMAIL', 'PHONE'],
    'Veterans’ Mortgage Life Insurance (VMLI)': ['EMAIL', 'PHONE'],
    Other: ['EMAIL', 'PHONE'],
  },
  Pension: {
    'Aid and Attendance or Housebound benefits': ['EMAIL', 'PHONE', 'US_MAIL'],
    'Direct deposit': ['EMAIL', 'PHONE', 'US_MAIL'],
    'Guardianship, custodianship, or fiduciary issues': [
      'EMAIL',
      'PHONE',
      'US_MAIL',
    ],
    'How to apply': ['EMAIL', 'PHONE', 'US_MAIL'],
    'Payment issues': ['EMAIL', 'PHONE', 'US_MAIL'],
  },
  'Sign in and technical issues': {
    'Signing in to VA.gov and managing VA.gov profile': ['EMAIL'],
    'Signing in to VA life insurance portal': ['EMAIL'],
    'Technical issues on VA.gov': ['EMAIL'],
  },
  'Survivor benefits': {
    'Aid and Attendance or Housebound benefits': ['EMAIL', 'PHONE', 'US_MAIL'],
    'Claim status': ['EMAIL', 'PHONE', 'US_MAIL'],
    'Direct deposit': ['EMAIL', 'PHONE', 'US_MAIL'],
    'Guardianship, custodianship, or fiduciary issues': [
      'EMAIL',
      'PHONE',
      'US_MAIL',
    ],
    'How to apply': ['EMAIL', 'PHONE', 'US_MAIL'],
    'Payment issues': ['EMAIL', 'PHONE', 'US_MAIL'],
  },
  'Veteran ID Card (VIC)': {
    'Veteran Health Identification Card (VHIC) for health appointments': [
      'EMAIL',
    ],
    'Veteran ID Card (VIC) for discounts': ['EMAIL'],
  },
  'Veteran Readiness and Employment': {
    'Financial issues': ['EMAIL', 'PHONE', 'US_MAIL'],
    'Following up on application or contacting counselor': [
      'EMAIL',
      'PHONE',
      'US_MAIL',
    ],
    'How to apply': ['EMAIL', 'PHONE', 'US_MAIL'],
    Other: ['EMAIL', 'PHONE', 'US_MAIL'],
  },
};

export const getContactMethods = (category, topic) => {
  // const contactRules = initializeContactRules();
  const allContactMethods = {
    PHONE: 'Phone call',
    EMAIL: 'Email',
    US_MAIL: 'U.S. mail',
  };

  if (contactRules[category] && contactRules[category][topic]) {
    return contactRules[category][topic].reduce((acc, method) => {
      acc[method] = allContactMethods[method];
      return acc;
    }, {});
  }
  return allContactMethods;
};

export const isEqualToOnlyEmail = obj => {
  const keys = Object.keys(obj);
  return keys.length === 1 && keys[0] === 'EMAIL' && obj.EMAIL === 'Email';
};

export const MilitaryBaseInfo = () => (
  <div className="">
    <va-additional-info trigger="Learn more about military base addresses">
      <span>
        The United States is automatically chosen as your country if you live on
        a military base outside of the country.
      </span>
    </va-additional-info>
  </div>
);
