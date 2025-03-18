export const BTSSS_PORTAL_URL = 'https://dvagov-btsss.dynamics365portals.us/';
export const FORM_103542_LINK = '/find-forms/about-form-10-3542/';
export const FIND_FACILITY_TP_CONTACT_LINK =
  '/HEALTHBENEFITS/vtp/beneficiary_travel_pocs.asp';
export const TRAVEL_PAY_INFO_LINK =
  '/health-care/get-reimbursed-for-travel-pay/';
export const REIMBURSEMENT_URL =
  '/resources/how-to-set-up-direct-deposit-for-va-travel-pay-reimbursement/';

export const STATUS_GROUPINGS = [
  {
    name: 'Saved or Incomplete',
    description:
      'These are claims that the Beneficiary Travel office cannot process. Either you have not submitted the claim, or you submitted a claim without required information.',
    includes: ['Incomplete', 'Saved'],
  },
  {
    name: 'Under VA Review',
    description:
      'These claims require action from VA. If VA needs more information from you, your Travel Clerk will contact you.',
    includes: [
      'In process',
      'Claim submitted',
      'In manual review',
      'On hold',
      'Appealed',
    ],
  },
  {
    name: 'Closed',
    description:
      'The Beneficiary Travel office finished their review of your claim and closed it. In some situations you can appeal Beneficiary Travel department’s decision and re-open a claim. If you have questions about why your claim has one of the following statuses, contact your local VAMC and ask for the Beneficiary Travel department.',
    includes: [
      'Partial payment',
      'Denied',
      'Approved for payment',
      'Submitted for payment',
      'Fiscal rescinded',
      'Claim paid',
      'Payment canceled',
    ],
  },
];

export const STATUSES = [
  {
    name: 'Incomplete',
    description:
      'You submitted a claim without required expense information. You must provide the required information for BTSSS to process the claim.',
    reasons: null,
  },
  {
    name: 'Saved',
    description:
      'You saved changes to your claim, but you did not submit it to BTSSS for review. Submit the claim so BTSSS can begin processing your claim.',
    reasons: null,
  },
  {
    name: 'In process',
    description:
      'You submitted a claim, and now BTSSS is reviewing your claim.',
    reasons: null,
  },
  {
    name: 'Claim submitted',
    description: 'You submitted a claim for a completed appointment.',
    reasons: null,
  },
  {
    name: 'In manual review',
    description:
      'Your claim requires a manual review by a Travel Clerk due to one or more of the following reasons:',
    reasons: [
      'Your claim includes receipts',
      'The mileage is not equal to or less than the calculated limit',
      'Your travel does not meet the eligibility requirements. For detailed information about your claim, contact your local VAMC and ask for the Beneficiary Travel department.',
    ],
  },
  {
    name: 'On hold',
    description:
      'You must provide the needed information for the claim to be processed. Your Travel Clerk will contact you when they put your claim on hold and tell you what additional information is required. For more information about your claim, please contact your local VAMC and ask for the Beneficiary Travel department.',
    reasons: null,
  },
  {
    name: 'Appealed',
    description:
      'You appealed the denial of your claim. The Travel Clerk will review your appeal.',
    reasons: null,
  },
  {
    name: 'Partial payment',
    description:
      'The Travel Clerk determined the claim does not qualify for a full reimbursement. Instead, they approved a partial payment and a Partial Payment letter was sent to you.',
    reasons: null,
  },
  {
    name: 'Denied',
    description:
      'The Travel Clerk denied your claim for one or more of the following reasons:',
    reasons: [
      'Claim is not eligible for reimbursement.',
      'The Travel Clerk could not verify the services in your claim.',
      'Your appointment does not exist in VISTA, either because the VA clinic you went to did not enter it or you received care at a non-VA facility.',
      'The Travel Clerk sent you a denial letter. The letter contains information on how to appeal the decision.',
    ],
  },
  {
    name: 'Approved for payment',
    description:
      'The Travel Clerk approved your claim for payment. The payment is pending and has not been paid.',
    reasons: null,
  },
  {
    name: 'Submitted for payment',
    description:
      'The approved claim payment is assigned to the Financial Service Center (FSC) so that you can receive reimbursement.',
    reasons: null,
  },
  {
    name: 'Fiscal rescinded',
    description:
      'The Financial Service Center (FSC) rejected payment. You will not be able to appeal this decision. For more detailed information about your claim, please contact your local VAMC and ask for the Beneficiary Travel department.',
    reasons: null,
  },
  {
    name: 'Claim paid',
    description:
      'The reimbursement on the approved claim is paid to the submitter. Note that reimbursements for claims submitted by a Caregiver on behalf of a Veteran claimant are sent to the Caregiver’s address or deposited in the Caregiver’s account.',
    reasons: null,
  },
  {
    name: 'Payment canceled',
    description:
      'The fund transfer did not complete because of the claimant’s bank. Payment has been canceled. You may create a new claim and reference the original claim number in the Notes section of the new claim.',
    reasons: null,
  },
];
