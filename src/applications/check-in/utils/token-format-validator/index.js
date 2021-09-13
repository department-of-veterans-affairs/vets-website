const isUUID = token => {
  const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
  return regex.test(token);
};

const SCOPES = Object.freeze({
  READ_BASIC: 'read.basic',
  READ_FULL: 'read.full',
});

export { isUUID, SCOPES };
