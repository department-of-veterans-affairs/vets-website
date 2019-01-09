const getUrl = client => {
  let result;
  client.url(url => {
    result = url;
  });
  return result;
};

module.exports = {
  getUrl,
};
