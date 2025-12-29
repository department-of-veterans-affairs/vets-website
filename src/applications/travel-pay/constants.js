export const BTSSS_PORTAL_URL = 'https://dvagov-btsss.dynamics365portals.us/';
export const FORM_103542_LINK = '/find-forms/about-form-10-3542/';
export const FORM_100998_LINK = '/find-forms/about-form-10-0998/';
export const FIND_FACILITY_TP_CONTACT_LINK =
  '/HEALTHBENEFITS/vtp/beneficiary_travel_pocs.asp';
export const TRAVEL_PAY_INFO_LINK =
  '/health-care/get-reimbursed-for-travel-pay/';
export const REIMBURSEMENT_URL =
  '/resources/how-to-set-up-direct-deposit-for-va-travel-pay-reimbursement/';
export const PAST_APPOINTMENTS_LINK = '/my-health/appointments/past';

export const STATUSES = {
  Incomplete: {
    name: 'Incomplete',
    description:
      'You submitted a claim without required expense information. You must provide the required information for BTSSS to process the claim.',
    definition:
      'You haven’t filed this claim yet. Make sure to add all required information and file within 30 days of your appointment.',
    reasons: null,
  },
  Saved: {
    name: 'Saved',
    description:
      'You saved changes to your claim, but you did not submit it to BTSSS for review. Submit the claim so BTSSS can begin processing your claim.',
    definition:
      'We saved your claim. Make sure to submit it within 30 days of your appointment.',
    alternativeDefinition:
      'We saved the expenses you’ve added so far. But you haven’t filed your travel reimbursement claim yet. Make sure to complete and file your claim within 30 days of your appointment.',
    reasons: null,
  },
  InProcess: {
    name: 'In process',
    description:
      'You submitted a claim, and now BTSSS is reviewing your claim.',
    definition: 'We’re reviewing your claim.',
    reasons: null,
  },
  ClaimSubmitted: {
    name: 'Claim submitted',
    description: 'You submitted a claim for a completed appointment.',
    definition: 'You submitted this claim for review.',
    reasons: null,
  },
  InManualReview: {
    name: 'In manual review',
    description:
      'Your claim requires a manual review by a Travel Clerk due to one or more of the following reasons:',
    definition:
      'We’re reviewing your claim. If you have questions, contact your facility’s Beneficiary Travel department.',
    reasons: [
      'Your claim includes receipts',
      'The mileage is not equal to or less than the calculated limit',
      'Your travel does not meet the eligibility requirements. For detailed information about your claim, contact your local VAMC and ask for the Beneficiary Travel department.',
    ],
  },
  OnHold: {
    name: 'On hold',
    description:
      'You must provide the needed information for the claim to be processed. Your Travel Clerk will contact you when they put your claim on hold and tell you what additional information is required. For more information about your claim, please contact your local VAMC and ask for the Beneficiary Travel department.',
    definition:
      'We need more information to decide your claim. Contact your facility’s Beneficiary Travel department.',
    reasons: null,
  },
  Appealed: {
    name: 'Appealed',
    description:
      'You appealed the denial of your claim. The Travel Clerk will review your appeal.',
    definition: 'We’re reviewing your claim appeal.',
    reasons: null,
  },
  PartialPayment: {
    name: 'Partial payment',
    description:
      'The Travel Clerk determined the claim does not qualify for a full reimbursement. Instead, they approved a partial payment and a Partial Payment letter was sent to you.',
    definition:
      'Some of the expenses you submitted aren’t eligible for reimbursement. You can review the decision letter for more information.',
    reasons: null,
  },
  Denied: {
    name: 'Denied',
    description:
      'The Travel Clerk denied your claim for one or more of the following reasons:',
    definition:
      'We denied your claim. You can review the decision letter for more information and how to appeal.',
    reasons: [
      'Claim is not eligible for reimbursement.',
      'The Travel Clerk could not verify the services in your claim.',
      'Your appointment does not exist in VISTA, either because the VA clinic you went to did not enter it or you received care at a non-VA facility.',
      'The Travel Clerk sent you a denial letter. The letter contains information on how to appeal the decision.',
    ],
  },
  ClosedWithNoPayment: {
    name: 'Closed with no payment',
    description:
      'The Travel Clerk determined the claim did not incur a cost and that no payment is necessary. The Travel Clerk will archive your claim.',
    definition:
      'We determined you didn’t incur any costs for travel. Since you aren’t eligible for reimbursement, we closed your claim. You can review the decision letter on the Claim Details page for more information and how to appeal.',
    reasons: null,
  },
  ApprovedForPayment: {
    name: 'Approved for payment',
    description:
      'The Travel Clerk approved your claim for payment. The payment is pending and has not been paid.',
    definition:
      'We approved your claim. We’ll send payment to the bank account you provided. If you haven’t received it in 10 business days of submission, contact your facility’s Beneficiary Travel department.',
    reasons: null,
  },
  SubmittedForPayment: {
    name: 'Submitted for payment',
    description:
      'The approved claim payment is assigned to the Financial Service Center (FSC) so that you can receive reimbursement.',
    definition:
      'We approved your claim. We’ll send payment to the bank account you provided. If you haven’t received it in 10 business days of submission, contact your facility’s Beneficiary Travel department.',
    reasons: null,
  },
  FiscalRescinded: {
    name: 'Fiscal rescinded',
    description:
      'The Financial Service Center (FSC) rejected payment. You will not be able to appeal this decision. For more detailed information about your claim, please contact your local VAMC and ask for the Beneficiary Travel department.',
    definition:
      'We approved your claim. But we can’t process your payment using the bank account you provided. Contact your facility’s Beneficiary Travel department.',
    reasons: null,
  },
  ClaimPaid: {
    name: 'Claim paid',
    description:
      'The reimbursement on the approved claim is paid to the submitter. Note that reimbursements for claims submitted by a Caregiver on behalf of a Veteran claimant are sent to the Caregiver’s address or deposited in the Caregiver’s account.',
    definition:
      'We sent payment for this claim to the bank account you provided.',
    reasons: null,
  },
  PaymentCanceled: {
    name: 'Payment canceled',
    description:
      'The fund transfer did not complete because of the claimant’s bank. Payment has been canceled. You may create a new claim and reference the original claim number in the Notes section of the new claim.',
    definition:
      'We approved your claim. But we can’t process your payment using the bank account you provided. Contact your facility’s Beneficiary Travel department.',
    reasons: null,
  },
};

export const STATUS_GROUPINGS = [
  {
    name: 'Saved or Incomplete',
    description:
      'These are claims that the Beneficiary Travel office cannot process. Either you have not submitted the claim, or you submitted a claim without required information.',
    includes: [STATUSES.Incomplete.name, STATUSES.Saved.name],
  },
  {
    name: 'Under VA Review',
    description:
      'These claims require action from VA. If VA needs more information from you, your Travel Clerk will contact you.',
    includes: [
      STATUSES.InProcess.name,
      STATUSES.ClaimSubmitted.name,
      STATUSES.InManualReview.name,
      STATUSES.OnHold.name,
      STATUSES.Appealed.name,
    ],
  },
  {
    name: 'Closed',
    description:
      'The Beneficiary Travel office finished their review of your claim and closed it. In some situations you can appeal Beneficiary Travel department’s decision and re-open a claim. If you have questions about why your claim has one of the following statuses, contact your local VAMC and ask for the Beneficiary Travel department.',
    includes: [
      STATUSES.ClosedWithNoPayment.name,
      STATUSES.PartialPayment.name,
      STATUSES.Denied.name,
      STATUSES.ApprovedForPayment.name,
      STATUSES.SubmittedForPayment.name,
      STATUSES.FiscalRescinded.name,
      STATUSES.ClaimPaid.name,
      STATUSES.PaymentCanceled.name,
    ],
  },
];

export const EXPENSE_TYPE_KEYS = Object.freeze({
  AIRTRAVEL: 'AirTravel',
  MEAL: 'Meal',
  COMMONCARRIER: 'CommonCarrier',
  LODGING: 'Lodging',
  MILEAGE: 'Mileage',
  PARKING: 'Parking',
  TOLL: 'Toll',
  OTHER: 'Other',
});

export const EXPENSE_TYPES = Object.freeze({
  [EXPENSE_TYPE_KEYS.MILEAGE]: {
    addButtonText: 'mileage',
    expensePageText: 'mileage',
    name: 'mileage',
    title: 'Mileage',
    route: 'mileage',
    apiRoute: 'mileage',
  },
  [EXPENSE_TYPE_KEYS.PARKING]: {
    addButtonText: 'parking',
    expensePageText: 'parking',
    name: 'parking',
    title: 'Parking',
    route: 'parking',
    apiRoute: 'parking',
  },
  [EXPENSE_TYPE_KEYS.TOLL]: {
    addButtonText: 'toll',
    expensePageText: 'toll',
    name: 'toll',
    title: 'Tolls',
    route: 'toll',
    apiRoute: 'toll',
  },
  [EXPENSE_TYPE_KEYS.COMMONCARRIER]: {
    addButtonText: 'public transportation, taxi, or rideshare',
    expensePageText: 'public transportation, taxi, or rideshare',
    name: 'common carrier',
    title: 'Public transportation, taxi, or rideshare',
    route: 'common-carrier',
    apiRoute: 'commoncarrier',
  },
  [EXPENSE_TYPE_KEYS.AIRTRAVEL]: {
    addButtonText: 'air travel',
    expensePageText: 'airfare',
    name: 'air travel',
    title: 'Airfare',
    route: 'air-travel',
    apiRoute: 'airtravel',
  },
  [EXPENSE_TYPE_KEYS.LODGING]: {
    addButtonText: 'lodging',
    expensePageText: 'lodging',
    name: 'lodging',
    title: 'Lodging',
    route: 'lodging',
    apiRoute: 'lodging',
  },
  [EXPENSE_TYPE_KEYS.MEAL]: {
    addButtonText: 'meal',
    expensePageText: 'meal',
    name: 'meal',
    title: 'Meals',
    route: 'meal',
    apiRoute: 'meal',
  },
  [EXPENSE_TYPE_KEYS.OTHER]: {
    addButtonText: 'travel',
    expensePageText: 'other travel',
    name: 'other',
    title: 'Other travel expenses',
    route: 'other',
    apiRoute: 'other',
  },
});

export const TRANSPORTATION_OPTIONS = Object.freeze([
  'Bus',
  'Subway',
  'Taxi',
  'Train',
  'Other',
]);

export const TRANSPORTATION_REASONS = Object.freeze({
  'Privately Owned Vehicle Not Available': {
    label: "I don't own a private vehicle or it wasn't available",
  },
  'Medically Indicated': {
    label: 'Medical reasons',
  },
  Other: {
    label: 'Other',
  },
});

export const TRIP_TYPES = Object.freeze({
  ROUND_TRIP: {
    value: 'RoundTrip',
    label: 'Round trip',
  },
  ONE_WAY: {
    value: 'OneWay',
    label: 'One way',
  },
});

export const ACCEPTED_FILE_TYPES = Object.freeze([
  '.jpg',
  '.jpeg',
  '.png',
  '.pdf',
  '.doc',
  '.docx',
  '.gif',
  '.bmp',
  '.tif',
  '.tiff',
]);
