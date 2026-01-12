const { v4: uuidv4 } = require('uuid');
const { randomInt } = require('crypto');
const { STATUS_KEYS } = require('../constants');

// Base facility & appointment info for mocks
const BASE_FACILITY = {
  id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  name: 'Cheyenne VA Medical Center',
};

// Helper to generate a claim with a given status
function createMockClaim(status, index) {
  const now = new Date();
  const createdOn = new Date(now.getTime() - index * 24 * 60 * 60 * 1000); // stagger by index days
  const modifiedOn = new Date(createdOn.getTime() + 4 * 24 * 60 * 60 * 1000); // 4 days later
  const appointmentDateTime = new Date(
    createdOn.getTime() + 8 * 60 * 60 * 1000,
  ); // 8 hours later

  return {
    id: uuidv4(),
    claimNumber: `TC${randomInt(1_000_000_000_000, 10_000_000_000_000)}`,
    claimName: `Claim ${index + 1}`,
    claimStatus: status,
    appointmentDateTime: appointmentDateTime.toISOString(),
    facilityId: BASE_FACILITY.id,
    facilityName: BASE_FACILITY.name,
    totalCostRequested: randomInt(0, 50_000) / 100,
    reimbursementAmount: 0.0,
    createdOn: createdOn.toISOString(),
    modifiedOn: modifiedOn.toISOString(),
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
