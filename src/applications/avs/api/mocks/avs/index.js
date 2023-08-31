const data = id => {
  let avs = {};
  const filename = `../../../tests/fixtures/${id}.json`;

  try {
    // eslint-disable-next-line import/no-dynamic-require
    avs = require(filename);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(`Could not load file for AVS id ${id}.`);
  }

  return {
    data: avs,
  };
};

module.exports = {
  data,
};
