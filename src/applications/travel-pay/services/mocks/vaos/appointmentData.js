const APPOINTMENT_MAP = {
  '167325': { type: 'noClaim', days: -1 },
  '167326': { type: 'claim', days: -3 },
  '167327': { type: 'noClaim', days: -32 },
  '167328': { type: 'savedClaim', days: -5 },
  '167329': { type: 'savedClaim', days: -33 },
};

const DEFAULT_APPOINTMENT_TYPE = 'savedClaim';

module.exports = {
  APPOINTMENT_MAP,
  DEFAULT_APPOINTMENT_TYPE,
};
