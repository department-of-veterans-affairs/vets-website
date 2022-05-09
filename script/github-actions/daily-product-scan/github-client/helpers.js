function getDateTime() {
  const date = new Date();
  return `${date.getMonth() +
    1}-${date.getDate()}-${date.getFullYear()}_${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;
}

module.exports = { getDateTime };
