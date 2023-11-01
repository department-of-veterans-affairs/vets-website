/* istanbul ignore file */
const createMockFailedResponse = _data => {
  return {
    error: true,
  };
};

module.exports = {
  createMockFailedResponse,
};
