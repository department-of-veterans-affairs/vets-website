const createSessionStorageKeys = ({ isPreCheckIn = true }) => {
  const namespace = isPreCheckIn
    ? 'health.care.pre.check.in'
    : 'health.care.check-in';
  const sessionStorageKeys = {
    CURRENT_UUID: `${namespace}.current.uuid`,
    VALIDATE_ATTEMPTS: `${namespace}.validate.attempts`,
    COMPLETE: `${namespace}.complete`,
    SHOULD_SEND_DEMOGRAPHICS_FLAGS: `${namespace}.should.send.demographics.flags`,
  };
  if (!isPreCheckIn) {
    sessionStorageKeys.SHOULD_SEND_TRAVEL_PAY_CLAIM = `${namespace}.should.send.travel.pay.claim`;
  }
  return sessionStorageKeys;
};

export { createSessionStorageKeys };
