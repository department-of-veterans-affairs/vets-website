const { v4: uuidv4 } = require('uuid');
const { randomInt } = require('crypto');
const { STATUS_KEYS } = require('../constants');
const { generateAppointmentDates } = require('../vaos/appointmentUtils');

// Base facility & appointment info for mocks
const BASE_FACILITY = {
  id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  name: 'Cheyenne VA Medical Center',
};

// Add days to an ISO date string and return ISO
const addDays = (isoString, days) =>
  new Date(Date.parse(isoString) + days * 24 * 60 * 60 * 1000).toISOString();

// Helper to generate a claim with a given status and index
function createMockClaim(status, index) {
  // Space claims one day apart, starting 2 days in the past
  const daysOffset = -(index + 2);

  const { appointmentDateTime } = generateAppointmentDates(daysOffset);

  return {
    id: uuidv4(),
    claimNumber: `TC${randomInt(1_000_000_000_000, 10_000_000_000_000)}`,
    claimName: `Claim ${index + 1}`,
    claimStatus: status,
    appointmentDateTime,
    facilityId: BASE_FACILITY.id,
    facilityName: BASE_FACILITY.name,
    totalCostRequested: randomInt(0, 50_000) / 100,
    reimbursementAmount: 0.0,
    createdOn: addDays(appointmentDateTime, -1),
    modifiedOn: addDays(appointmentDateTime, 1),
  };
}

// Generate the full baseClaimList using all statuses
const baseClaimList = Object.values(STATUS_KEYS).map((status, idx) =>
  createMockClaim(status, idx),
);

const mockClaimsResponse = {
  metadata: {
    status: 200,
    pageNumber: 1,
    totalRecordCount: baseClaimList.length,
  },
  data: baseClaimList,
};

module.exports = { baseClaimList, mockClaimsResponse };
