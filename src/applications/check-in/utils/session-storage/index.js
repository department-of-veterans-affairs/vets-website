const createSessionStorageKeys = ({ isPreCheckIn = true }) => {
  const namespace = isPreCheckIn
    ? 'health.care.pre.check.in'
    : 'health.care.check-in';
  return {
    CURRENT_UUID: `${namespace}.current.uuid`,
    VALIDATE_ATTEMPTS: `${namespace}.validate.attempts`,
    COMPLETE: `${namespace}.complete`,
  };
};

export { createSessionStorageKeys };
