/* eslint-disable camelcase */
// camelcase coming from mock api response for PUT request success

const set = require('lodash/set');

// v0/personal_information route basic user response
export const basicUserPersonalInfoResponse = {
  data: {
    id: '',
    type: 'mvi_models_mvi_profiles',
    attributes: {
      gender: 'M',
      birthDate: '1986-05-06',
      preferredName: 'WES',
      pronouns: ['heHimHis', 'theyThemTheirs'],
      pronounsNotListedText: 'Other/pronouns/here',
      genderIdentity: { code: 'M', name: 'Male' },
      sexualOrientation: ['straightOrHeterosexual'],
      sexualOrientationNotListedText: 'Some other orientation',
    },
  },
};

// v0/personal_information with none of the new demographics data set
export const unsetUserPersonalInfoResponse = {
  data: {
    id: '',
    type: 'mvi_models_mvi_profiles',
    attributes: {
      gender: 'M',
      birthDate: '1986-05-06',
      preferredName: null,
      pronouns: null,
      pronounsNotListedText: null,
      genderIdentity: { code: null, name: null },
      sexualOrientation: null,
      sexualOrientationNotListedText: null,
    },
  },
};

// example of api error from vets-api for PUT request
export const putPreferredNameFailureResponse = {
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

export const makePutPreferredNameSuccessResponse = name => {
  return {
    text: name,
    source_system_user: '123498767V234859',
    source_date: '2022-04-08T15:09:23.000Z',
  };
};

// below are server responses specifically for Dev Mock API

// if the now query is added we want to test that the UI hydrates with new info
// primarily testing for if the preferred name hydrates correctly
// TODO: how to send dummy updated gender identity info for testing?
const getBasicUserPersonalInfo = (req, res) => {
  if (req?.query?.now) {
    return res.json(
      set(
        basicUserPersonalInfoResponse,
        'data.attributes.preferredName',
        'nameupdated',
      ),
    );
  }
  return res.json(basicUserPersonalInfoResponse);
};

const putPreferredName = {
  'PUT /v0/profile/preferred_names': (req, res) => {
    // if the body doesnt include text then we should return an error
    // for testing if you submit a preferred name update with the text value of 'error' we can trigger the error response
    if (!req?.body?.text || req?.body?.text === 'error') {
      return res.json(putPreferredNameFailureResponse);
    }
    return res.json(makePutPreferredNameSuccessResponse(req.body.tex));
  },
};

module.exports = {
  getBasicUserPersonalInfo,
  putPreferredName,
};
