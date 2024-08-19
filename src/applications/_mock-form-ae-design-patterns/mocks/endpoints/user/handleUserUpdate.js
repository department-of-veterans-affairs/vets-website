const user = require('./index');

const handleUserUpdate = history => {
  // get the last 2 items of the history array
  // this is usually where a request with a transaction id will be located
  const lastTwoItems = history.slice(-2);

  // if any of the last two item include an id with 'delete-home-address' in it, return a user with no home address
  if (
    lastTwoItems?.some(item => item?.params?.id.includes('delete-home-address'))
  ) {
    return [true, user.loa3UserWithNoHomeAddress];
  }

  if (
    lastTwoItems?.some(item =>
      item?.params?.id.includes('update-mailing-address'),
    )
  ) {
    return [true, user.loa3UserWithUpdatedMailingAddress];
  }

  return [false, null];
};

module.exports = handleUserUpdate;
