const createDisabilityRatingSuccess = () => {
  return {
    data: {
      id: '',
      type: 'evss_disability_compensation_form_rating_info_responses',
      attributes: {
        userPercentOfDisability: 40,
      },
    },
  };
};

const createDisabilityRatingEmpty = () => {
  return {
    data: {
      id: '',
      type: 'evss_disability_compensation_form_rating_info_responses',
      attributes: {
        userPercentOfDisability: null,
      },
    },
  };
};

const createDisabilityRatingZero = () => {
  return {
    data: {
      id: '',
      type: 'evss_disability_compensation_form_rating_info_responses',
      attributes: {
        userPercentOfDisability: 0,
      },
    },
  };
};

const createDisabilityRatingFailure = () => {
  return {
    errors: [
      {
        title: 'Bad Request',
        detail: 'Received a bad request response from the upstream server',
        code: 'EVSS400',
        source: 'EVSS::DisabilityCompensationForm::Service',
        status: '400',
        meta: {},
      },
    ],
  };
};

module.exports = {
  createDisabilityRatingEmpty,
  createDisabilityRatingFailure,
  createDisabilityRatingSuccess,
  createDisabilityRatingZero,
};
