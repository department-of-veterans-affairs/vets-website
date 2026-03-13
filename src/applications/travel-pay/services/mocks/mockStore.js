// This file initializes the mock store for the travel pay application.
// It builds out the initial state for claims, expenses, and appointments based on the base claim list and static data.
// This centralized store is then imported by the various mock handlers to ensure consistent data across API endpoints.
if (!global.__MOCK_STORE_INITIALIZED__) {
  const { baseClaimList } = require('./claims/baseClaimList');
  const { buildClaim } = require('./claims/baseClaim');
  const {
    buildAppointmentsFromClaims,
    buildCCAppointment,
  } = require('./vaos/appointmentUtils');
  const { expenseByType } = require('./expenses/expenseData');

  const { STATUS_KEYS } = require('./constants');

  const claimsStore = {};

  const expensesStore = {};

  const appointmentsStore = {};

  // Build initial appointmentsStore from base claim list
  const { baseAppointments } = buildAppointmentsFromClaims(
    baseClaimList,
    STATUS_KEYS.SAVED,
  );
  baseAppointments.forEach(appt => {
    appointmentsStore[appt.id] = { ...appt };
  });

  // Dedicated community care appointment for testing the PoA upload flow.
  // Navigate to: /my-health/travel-pay/file-new-claim/cc-appt-001
  const ccAppointment = buildCCAppointment();

  // Create a pre-linked claim for the CC appointment so it skips intro page & goes straight to POA page
  const ccClaimId = 'cc-claim-001';
  const ccApptDateTime =
    ccAppointment.attributes.localStartTime?.slice(0, 19) ||
    ccAppointment.attributes.start?.slice(0, 19);
  const ccFacilityName =
    ccAppointment.attributes.location?.name || 'Community Care Provider';
  const ccClaim = {
    id: ccClaimId,
    claimId: ccClaimId,
    claimNumber: `TC${Math.floor(Math.random() * 1_000_000_000)}`,
    claimStatus: STATUS_KEYS.SAVED,
    claimSource: 'VaGov',
    expenses: [],
    documents: [],
    createdOn: new Date().toISOString(),
    modifiedOn: new Date().toISOString(),
    // appointmentDate is what ClaimDetailsContent expects as a prop
    appointmentDate: ccApptDateTime,
    facilityName: ccFacilityName,
    // appointmentDateTime / facilityStationNumber are used for claim creation matching
    appointmentDateTime: ccApptDateTime,
    facilityStationNumber: ccAppointment.attributes.locationId,
    // appointment nested object is used by TravelClaimDetailsContent to look up the VAOS appointment
    appointment: {
      appointmentDateTime: ccApptDateTime,
      facilityId: ccAppointment.attributes.locationId,
      facilityName: ccFacilityName,
      appointmentSource: 'VAOS',
      appointmentType: 'CommunityCareSingle',
      appointmentStatus: 'Complete',
      isCompleted: true,
    },
  };
  claimsStore[ccClaimId] = ccClaim;
  // Link the claim to the appointment
  ccAppointment.attributes.travelPayClaim = {
    metadata: { status: 200, success: true },
    claim: {
      id: ccClaimId,
      claimNumber: ccClaim.claimNumber,
      claimStatus: ccClaim.claimStatus,
    },
  };

  appointmentsStore[ccAppointment.id] = ccAppointment;

  // Second CC appointment with NO pre-linked claim.
  // Use this to test the full new-claim flow from the Introduction page:
  // After the user creates a claim, createClaimHandler replaces this with a
  // real claim object so returning users are routed into the flow correctly.
  //
  // Navigate to: /my-health/travel-pay/file-new-claim/cc-appt-002
  const ccAppointment2 = buildCCAppointment(-3, 'cc-appt-002');
  ccAppointment2.attributes.travelPayClaim = {
    metadata: { status: 200, success: true },
    claim: null,
  };
  appointmentsStore[ccAppointment2.id] = ccAppointment2;

  // Build helper for getting the appointment associated with a claim ID
  // appointmentByClaimId[claimId] → appointment
  const appointmentByClaimId = {};

  Object.values(appointmentsStore).forEach(appt => {
    const claimId = appt.attributes?.travelPayClaim?.claim?.id;
    if (claimId) {
      appointmentByClaimId[claimId] = appt;
    }
  });

  //

  // Pre-fill claimsStore from baseClaimList and link appointments
  baseClaimList.forEach((claim, index) => {
    const appt = appointmentByClaimId[claim.id];

    // Build the full claim once here
    const fullClaim = buildClaim({
      claimId: claim.id,
      claimNumber: claim.claimNumber,
      claimStatus: claim.claimStatus,
      expenses: [], // start empty
      expenseTypeOptions: 'ALL', // or from claim.expenseTypeOptions if defined
      daysOffset: -(index + 2), // can adjust if needed
      appointmentOverride: appt
        ? {
            id: appt.id,
            appointmentDateTime: appt.attributes.startDate,
            facilityId: appt.attributes.locationId,
            facilityName: appt.attributes.location?.name,
          }
        : undefined,
    });

    claimsStore[claim.id] = {
      id: claim.id,
      ...fullClaim,
    };
  });

  // Pre-fill expenseStore with static expense objects
  for (const [, expense] of Object.entries(expenseByType)) {
    expensesStore[expense.id] = { ...expense };
  }

  // Store on global so it survives hot reloads
  global.__MOCK_STORE_INITIALIZED__ = {
    claimsStore,
    expensesStore,
    appointmentsStore,
  };
}

module.exports = global.__MOCK_STORE_INITIALIZED__;
