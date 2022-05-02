function getDateTime() {
  const date = new Date();
  return `${date.getMonth() +
    1}-${date.getDate()}-${date.getFullYear()}_${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;
}

const constants = {
  owner: 'holdenhinkle',
  repo: 'product-directory',
  path: 'product-directory.csv',
  ref: `refs/heads/update_depenencies_${getDateTime()}`,
};

module.exports = constants;
