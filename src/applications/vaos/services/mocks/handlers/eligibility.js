const responses = {
  'GET /vaos/v2/eligibility': (req, res) => {
    const isDirect = req.query.type === 'direct';
    const ineligibilityReasons = [];

    // Direct scheduling, Facility 983, not primaryCare
    if (
      isDirect &&
      req.query.facility_id.startsWith('984') &&
      req.query.clinical_service_id !== 'primaryCare'
    ) {
      ineligibilityReasons.push({
        coding: [
          {
            code: 'patient-history-insufficient',
          },
        ],
      });
    }

    // Request, not Facility 983, not Facility 692 (OH)
    if (
      !isDirect &&
      (!req.query.facility_id.startsWith('983') &&
        !req.query.facility_id.startsWith('692'))
    ) {
      ineligibilityReasons.push({
        coding: [
          {
            code: 'facility-request-limit-exceeded',
          },
        ],
      });
    }

    return res.json({
      data: {
        attributes: {
          type: req.query.type,
          clinicalServiceId: req.query.clinical_service_id,
          eligible: ineligibilityReasons.length === 0,
          ineligibilityReasons:
            ineligibilityReasons.length === 0
              ? undefined
              : ineligibilityReasons,
        },
      },
    });
  },
};
module.exports = responses;
