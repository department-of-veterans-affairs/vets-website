/* eslint-disable camelcase */
// camelcase coming from mock api response for PUT request success

const set = require('lodash/set');

// v0/personal_information successful user response
const basicUserPersonalInfo = {
  data: {
    id: '',
    type: 'mvi_models_mvi_profiles',
    attributes: {
      gender: 'M',
      birthDate: '1986-05-06',
      preferredName: '',
      pronouns: ['heHimHis', 'theyThemTheirs'],
      pronounsNotListedText: 'Other/pronouns/here',
      genderIdentity: { code: null, name: null },
      sexualOrientation: ['straightOrHeterosexual'],
      sexualOrientationNotListedText: 'Some other orientation',
    },
  },
};

// v0/personal_information failure response
const userPersonalInfoFailure = {
  errors: [
    {
      title: 'Unexpected response body',
      detail: 'MVI service responded without a birthday or a gender.',
      code: 'MVI_BD502',
      status: '502',
      source: 'V0::Profile::PersonalInformationsController',
    },
  ],
};

// v0/personal_information with none of the new demographics data set
const unsetUserPersonalInfo = {
  data: {
    id: '',
    type: 'mvi_models_mvi_profiles',
    attributes: {
      gender: 'M',
      birthDate: '',
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
const putBadRequestFailure400 = {
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

const putBadRequestFailure422 = {
  errors: [
    {
      title: "Text can't be blank",
      detail: "text - can't be blank",
      code: '100',
      source: {
        pointer: 'data/attributes/text',
      },
      status: '422',
    },
  ],
};

const createPutPreferredNameSuccess = name => {
  return {
    id: '',
    type: 'va_profile_demographics_preferred_name_responses',
    attributes: {
      preferredName: {
        text: name.toUpperCase(),
        sourceSystemUser: '1012832025V743496',
        sourceDate: 'mockSourceDateTimeStampPreferredName',
      },
    },
  };
};

// gender codes and 'names' that come from api
// our labels use different text but the same code
// we only need to send the code to update
const genders = {
  M: 'Male',
  B: 'Non-Binary',
  TM: 'Transgender Man',
  TW: 'Transgender Female',
  W: 'Female',
  N: 'Does not wish to disclose',
  O: 'Other',
};

const createPutGenderIdentitySuccess = code => {
  return {
    id: '',
    type: 'va_profile_demographics_gender_identities_responses',
    attributes: {
      genderIdentity: {
        code,
        name: genders[code],
        sourceSystemUser: '1012832025V743496',
        sourceDate: 'mockSourceDateTimeStampGenderIdentity',
      },
    },
  };
};

// below are server responses specifically for Dev Mock API

// if the now query is added we want to test that the UI hydrates with new info
// primarily testing for if the preferred name hydrates correctly
// TODO: how to send dummy updated gender identity info for testing?
const handleGetPersonalInformationRoute = (req, res) => {
  if (req?.query?.now) {
    return res.json(
      set(
        basicUserPersonalInfo,
        'data.attributes.preferredName',
        'nameupdated',
      ),
    );
  }
  // if the error query is added we want to test that the UI handles the error state
  if (req?.query?.error) {
    return res.json(
      set(basicUserPersonalInfo, 'data.attributes', userPersonalInfoFailure),
    );
  }
  // return res.json(userPersonalInfoFailure);
  return res.json(basicUserPersonalInfo);
};

const handlePutPreferredNameRoute = (req, res) => {
  // if the body doesn't include text then we should return an error
  if (!req?.body?.text) {
    return res.json(putBadRequestFailure422);
  }

  // for testing if you submit a preferred name update with the text value of 'error' we can trigger the error response
  if (req?.body?.text === 'error') {
    return res.json(putBadRequestFailure400);
  }

  return res.json(createPutPreferredNameSuccess(req.body.text));
};

const handlePutGenderIdentitiesRoute = (req, res) => {
  // if the body doesnt include a code then we should return and error
  // for testing we can simulate an error by attempting update with 'A gender not listed here' aka code: 'O'
  if (!req?.body?.code || req?.body?.code === 'O') {
    return res.json(putBadRequestFailure400);
  }

  return res.json(createPutGenderIdentitySuccess(req.body.code));
};

module.exports = {
  handleGetPersonalInformationRoute,
  handlePutGenderIdentitiesRoute,
  handlePutPreferredNameRoute,
  basicUserPersonalInfo,
  userPersonalInfoFailure,
  unsetUserPersonalInfo,
  createPutPreferredNameSuccess,
  createPutGenderIdentitySuccess,
  putBadRequestFailure400,
  putBadRequestFailure422,
};
