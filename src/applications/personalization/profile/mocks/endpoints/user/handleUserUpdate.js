const user = require('./index');

const handleUserUpdate = history => {
  // get the last 2 items of the history array
  const lastTwoItems = history.slice(-2);

  // if any of the last two item include an id with 'delete-home-address' in it, return a user with no home address
  if (lastTwoItems.some(item => item.id.includes('delete-home-address'))) {
    return [true, user.loa3UserWithNoHomeAddress];
  }

  return [false, null];
};

module.exports = handleUserUpdate;
