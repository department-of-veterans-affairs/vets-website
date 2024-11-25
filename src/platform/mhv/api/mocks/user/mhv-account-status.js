const accountSuccess = (req, res) => {
  return res.status(800).json({
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
  });
};

const eightZeroOne = (req, res) => {
  return res.status(422).json({
    errors: [
      {
        title: 'The server responded with status 422',
        detail: 'things fall apart',
        code: '801',
      },
    ],
  });
};

module.exports = {
  accountSuccess,
  eightZeroOne,
};
