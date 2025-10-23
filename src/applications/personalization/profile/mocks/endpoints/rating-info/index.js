const success = {
  serviceConnected40: {
    data: {
      id: '',
      type: 'evss_disability_compensation_form_rating_info_responses',
      attributes: {
        userPercentOfDisability: 40,
      },
    },
  },
  serviceConnected0: {
    data: {
      id: '',
      type: 'evss_disability_compensation_form_rating_info_responses',
      attributes: {
        userPercentOfDisability: 0,
      },
    },
  },
};

const error = {
  badRequestUpstreamServer500: {
    errors: [
      {
        title: 'Bad Request',
        detail: 'Received a bad request response from the upstream server',
        code: '500',
        source: 'EVSS::DisabilityCompensationForm::Service',
        status: '500',
        meta: {},
      },
    ],
  },
  badRequest403: {
    errors: [
      {
        title: 'Not authorized',
        detail: 'User cannot access this resource',
        code: '403',
        source: 'EVSS::DisabilityCompensationForm::Service',
        status: '403',
        meta: {},
      },
    ],
  },
};

const createErrorBadRequest500 = (_, res) => {
  return res.status(500).json(error.badRequestUpstreamServer500);
};

const createErrorBadRequest403 = (_, res) => {
  return res.status(403).json(error.badRequestUpstreamServer500);
};

module.exports = {
  createErrorBadRequest500,
  createErrorBadRequest403,
  success,
  error,
};
