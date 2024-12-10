const accountStatusSuccessResponse = {
  data: {
    id: '12345678',
    type: 'mhv_user_account',
    attributes: {
      userProfileId: '12345678',
      premium: true,
      champVa: true,
      patient: true,
      smAccountCreated: true,
      message: 'some-message',
    },
  },
};

const accountStatusEightZeroOne = {
  errors: [
    {
      title: 'The server responded with status 422',
      detail: 'things fall apart',
      code: '801',
    },
  ],
};

module.exports = {
  accountStatusSuccessResponse,
  accountStatusEightZeroOne,
};
