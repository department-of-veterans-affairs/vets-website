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
      doc => !doc.expenseId || expensesStore[doc.expenseId],
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
    const requestData = req.body;

    const newClaim = {
      id: newClaimId,
      claimId: newClaimId,
      claimNumber: `TC${Math.floor(Math.random() * 1_000_000_000)}`,
      claimStatus: STATUS_KEYS.SAVED,
      claimSource: 'VaGov',
      expenses: [],
      documents: [],
      createdOn: new Date().toISOString(),
      modifiedOn: new Date().toISOString(),
      ...requestData,
    };

    claimsStore[newClaimId] = newClaim;

    // Link the claim back to the appointment based on datetime and facility
    // This allows the appointment to show the claim status
    const { appointmentDateTime, facilityStationNumber } = requestData;
    if (appointmentDateTime && facilityStationNumber) {
      Object.entries(appointmentsStore).forEach(([apptId, appt]) => {
        const apptStart = appt.attributes?.start;
        const apptLocalStart = appt.attributes?.localStartTime;
        const apptFacilityId = appt.attributes?.locationId;

        // Normalize datetime strings for comparison:
        // - appointmentDateTime from request: "2025-04-15T06:30:00" (no timezone)
        // - apptStart: "2025-04-15T10:30:00.000Z" (UTC)
        // - apptLocalStart: "2025-04-15T06:30:00.000-04:00" (with offset)
        const normalizeDateTime = dt => {
          if (!dt) return null;
          return dt.slice(0, 19);
        };

        const requestDateTime = normalizeDateTime(appointmentDateTime);
        const apptDateTime = normalizeDateTime(apptLocalStart || apptStart);

        // Match by datetime and facility
        if (
          apptDateTime &&
          apptFacilityId === facilityStationNumber &&
          requestDateTime === apptDateTime
        ) {
          const facilityName =
            appt.attributes?.location?.name || 'VA Medical Center';

          // Backfill ClaimDetailsContent-required fields onto the claim
          claimsStore[newClaimId] = {
            ...claimsStore[newClaimId],
            appointmentDate: requestDateTime,
            facilityName,
            appointment: {
              appointmentDateTime: requestDateTime,
              facilityId: facilityStationNumber,
              facilityName,
              appointmentSource: 'VAOS',
              appointmentType:
                requestData.appointmentType || 'CommunityCareSingle',
              appointmentStatus: 'Complete',
              isCompleted: true,
            },
          };

          appointmentsStore[apptId] = {
            ...appt,
            attributes: {
              ...appt.attributes,
              travelPayClaim: {
                metadata: { status: 200, success: true },
                claim: {
                  id: newClaimId,
                  claimNumber: newClaim.claimNumber,
                  claimStatus: newClaim.claimStatus,
                },
              },
            },
          };
        }
      });
    }

    return res.json({ claimId: newClaimId });
  };
}

module.exports = {
  getClaimsHandler,
  getClaimByIdHandler,
  updateClaimHandler,
  createClaimHandler,
};
