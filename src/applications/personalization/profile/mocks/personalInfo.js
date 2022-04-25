const set = require('lodash/set');

/* eslint-disable camelcase */
const getBasicUserPersonalInfo = (req, res) => {
  const response = {
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

  // if the now query is added we want to test that the UI hydrates with new info
  // primarily testing for if the preferred name hydrates correctly
  // TODO: how to send dummy updated gender identity info for testing?
  if (req?.query?.now) {
    return res.json(
      set(response, 'data.attributes.preferredName', 'nameupdated'),
    );
  }
  return res.json(response);
};

const putPreferredName = {
  'PUT /v0/profile/preferred_names': (req, res) => {
    // for testing if you submit a preferred name update with the text value of 'error' we can trigger the error response
    if (req?.body?.text === 'error') {
      return res.json({
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
      });
    }
    return res.json({
      text: req?.body?.text,
      source_system_user: '123498767V234859',
      source_date: '2022-04-08T15:09:23.000Z',
    });
  },
};

module.exports = {
  getBasicUserPersonalInfo,
  putPreferredName,
};
