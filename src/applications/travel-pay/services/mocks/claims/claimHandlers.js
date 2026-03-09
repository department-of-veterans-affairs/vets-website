const { v4: uuidv4 } = require('uuid');
const { claimsStore, appointmentsStore } = require('../mockStore');
const { STATUS_KEYS } = require('../constants');

/**
 * Get all claims (summary list)
 */
function getClaimsHandler() {
  return (req, res) => {
    const claims = Object.values(claimsStore).map(claim => ({
      id: claim.id,
      claimNumber: claim.claimNumber,
      claimStatus: claim.claimStatus,
      appointmentDateTime: claim.appointment?.appointmentDateTime,
      facilityName: claim.appointment?.facilityName,
      createdOn: claim.createdOn,
      modifiedOn: claim.modifiedOn,
    }));

    return res.json({
      metadata: {
        status: 200,
        pageNumber: 1,
        totalRecordCount: claims.length,
      },
      data: claims,
    });
  };
}

/**
 * Get claim by ID
 */
function getClaimByIdHandler({ expensesStore }) {
  return (req, res) => {
    const { id } = req.params;
    const storedClaim = claimsStore[id];

    if (!storedClaim) {
      return res.status(404).json({
        errors: [{ detail: 'Claim not found' }],
      });
    }
    const expenses = (storedClaim.expenses || [])
      .map(e => expensesStore[e.id])
      .filter(Boolean);

    const documents = (storedClaim.documents || []).filter(
      doc => doc.proofOfAttendance || expensesStore[doc.expenseId],
    );

    // Deep copy appointment too, if present
    const appointment = storedClaim.appointment
      ? { ...storedClaim.appointment }
      : undefined;

    const claimCopy = {
      ...storedClaim,
      expenses,
      documents,
      appointment,
      totalCostRequested: (storedClaim.expenses || []).reduce(
        (sum, e) => sum + Number(expensesStore[e.id]?.costRequested || 0),
        0,
      ),
    };

    return res.json(claimCopy);
  };
}

/**
 * Update claim (e.g., status, expenses)
 */
function updateClaimHandler() {
  return (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    const storedClaim = claimsStore[id];
    if (!storedClaim) {
      return res.status(404).json({ errors: [{ detail: 'Claim not found' }] });
    }

    // Merge updated expense data into the stored claim
    claimsStore[id] = {
      ...storedClaim,
      ...updateData,
      // Keep the appointment intact unless the update explicitly changes it
      appointment: storedClaim.appointment,
    };

    // Update the corresponding appointment travelPayClaim if it exists
    // Object.values(appointmentsStore).forEach(appt => {
    //   const apptClaimId = appt.attributes?.travelPayClaim?.claim?.id;
    //   if (apptClaimId === id) {
    //     appt.attributes.travelPayClaim.claim = { ...claimsStore[id] };
    //   }
    // });
    Object.entries(appointmentsStore).forEach(([key, appt]) => {
      const apptClaimId = appt.attributes?.travelPayClaim?.claim?.id;
      if (apptClaimId === id) {
        // replace the appointment object in the store
        appointmentsStore[key] = {
          ...appt,
          attributes: {
            ...appt.attributes,
            travelPayClaim: {
              ...appt.attributes.travelPayClaim,
              claim: { ...claimsStore[id] },
            },
          },
        };
      }
    });

    return res.json(claimsStore[id]);
  };
}

/**
 * Create a new claim
 */
function createClaimHandler() {
  return (req, res) => {
    const newClaimId = uuidv4();
    const newClaim = {
      id: newClaimId,
      claimNumber: `TC${Math.floor(Math.random() * 1_000_000_000)}`,
      claimStatus: STATUS_KEYS.SAVED,
      expenses: [],
      ...req.body,
    };

    claimsStore[newClaimId] = newClaim;

    return res.json({ claimId: newClaimId });
  };
}

module.exports = {
  getClaimsHandler,
  getClaimByIdHandler,
  updateClaimHandler,
  createClaimHandler,
};
