const accountSuccess = (req, res) => {
  return res.status(200).json({
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
        code: 801,
      },
    ],
  });
};

const eightZeroFive = (req, res) => {
  return res.status(422).json({
    errors: [
      {
        title: 'The server responded with status 422',
        detail: 'things fall apart',
        code: 805,
      },
    ],
  });
};

const eightZeroSix = (req, res) => {
  return res.status(422).json({
    errors: [
      {
        title: 'The server responded with status 422',
        detail: 'things fall apart',
        code: 802,
      },
    ],
  });
};

const fiveZeroZero = (req, res) => {
  return res.status(500).json({
    errors: [
      {
        title: 'The server responded with status 500',
        detail: 'things fall apart',
        code: 500,
      },
    ],
  });
};

const multiError = (req, res) => {
  return res.status(422).json({
    errors: [
      {
        title: 'The server responded with status 422',
        detail: 'things fall apart',
        code: 802,
      },
      {
        title: 'The server responded with status 500',
        detail: 'things fall apart',
        code: 500,
      },
      {
        title: 'The server responded with status 422',
        detail: 'things fall apart',
        code: 805,
      },
      {
        title: 'The server responded with status 422',
        detail: 'things fall apart',
        code: 801,
      },
    ],
  });
};

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
      code: 801,
    },
  ],
};

const accountStatusFiveZeroZero = {
  errors: [
    {
      title: 'The server responded with status 500',
      detail: 'things fall apart',
      code: 500,
    },
  ],
};

const accountStatusFourTwoTwo = {
  errors: [
    {
      title: 'The server responded with status 422',
      detail: 'this error never gets past vets-api so it has no code value',
    },
  ],
};

const accountStatusMultiError = {
  errors: [
    {
      title: 'The server responded with status 422',
      detail: 'things fall apart',
      code: 802,
    },
    {
      title: 'The server responded with status 500',
      detail: 'things fall apart',
      code: 500,
    },
    {
      title: 'The server responded with status 422',
      detail: 'things fall apart',
      code: 805,
    },
    {
      title: 'The server responded with status 422',
      detail: 'things fall apart',
      code: 801,
    },
  ],
};

module.exports = {
  accountSuccess,
  eightZeroOne,
  eightZeroFive,
  eightZeroSix,
  fiveZeroZero,
  multiError,
  accountStatusSuccessResponse,
  accountStatusEightZeroOne,
  accountStatusFiveZeroZero,
  accountStatusFourTwoTwo,
  accountStatusMultiError,
};
