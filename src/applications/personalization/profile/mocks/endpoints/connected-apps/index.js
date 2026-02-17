const connectedApps = {
  data: [
    {
      id: '0oa3s6dlvxgsZr62p2p7',
      type: 'okta_redis_apps',
      attributes: {
        title: 'Apple Health',
        logo: 'https://ok6static.oktacdn.com/fs/bco/4/fs06uplrfh5ML4ubr2p7',
        privacyUrl: 'https://www.apple.com/legal/privacy/',
        grants: [
          {
            title: 'Launch as patient',
            id: 'oag8ffjmglG7PDb3W2p6',
            created: '2019-08-05T18:32:25.000Z',
          },
          {
            title: 'Conditions',
            id: 'oag8ffjmglG7PDb3W2p6',
            created: '2019-08-05T18:32:25.000Z',
          },
        ],
      },
    },
    {
      id: '10oa3s6dlvxgsZr62p2p7',
      type: 'okta_redis_apps',
      attributes: {
        title: 'Test App 2',
        logo: 'https://ok6static.oktacdn.com/fs/bco/4/fs06uplrfh5ML4ubr2p7',
        privacyUrl: '',
        grants: [
          {
            title: 'Launch as patient',
            id: '1oag8ffjmglG7PDb3W2p6',
            created: '2019-08-05T18:32:25.000Z',
          },
          {
            title: 'Conditions',
            id: '1oag8ffjmglG7PDb3W2p6',
            created: '2019-08-05T18:32:25.000Z',
          },
        ],
      },
    },
  ],
};

const deleteConnectedApp = (_req, res) => {
  return res.status(204).send();
};

module.exports = { connectedApps, deleteConnectedApp };
