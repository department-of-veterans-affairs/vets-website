import { expect } from 'chai';
import sinon from 'sinon';

import {
  ADDRESS_TYPES,
  BACKEND_SERVICE_ERROR,
  BACKEND_AUTHENTICATION_ERROR,
  GET_ADDRESS_COUNTRIES_SUCCESS,
  GET_ADDRESS_COUNTRIES_FAILURE,
  GET_ADDRESS_STATES_SUCCESS,
  GET_ADDRESS_STATES_FAILURE,
  GET_ADDRESS_SUCCESS,
  GET_ADDRESS_FAILURE,
  GET_BENEFIT_SUMMARY_OPTIONS_SUCCESS,
  GET_BENEFIT_SUMMARY_OPTIONS_FAILURE,
  GET_LETTERS_SUCCESS,
  GET_LETTERS_FAILURE,
  LETTER_ELIGIBILITY_ERROR,
  // LETTER_TYPES,
  SAVE_ADDRESS_PENDING,
  SAVE_ADDRESS_FAILURE,
  SAVE_ADDRESS_SUCCESS,
} from '../../../src/js/letters/utils/constants';

import {
  getLetterList,
  getMailingAddress,
  getBenefitSummaryOptions,
  // getLetterPdf,
  saveAddress,
  getAddressCountries,
  getAddressStates,
} from '../../../src/js/letters/actions/letters';

/**
 * Setup() for each test requires stubbing global fetch() and setting userToken
 * in global sessionStorage. Teardown() resets everything back to normal
 */
let oldFetch;
let oldSessionStorage;
const setup = () => {
  oldSessionStorage = global.sessionStorage;
  oldFetch = global.fetch;
  global.sessionStorage = {
    userToken: '123abc'
  };
  global.fetch = sinon.stub();
  global.fetch.returns(Promise.resolve({
    headers: { get: () => 'application/json' },
    ok: true,
    json: () => Promise.resolve({})
  }));
};
const teardown = () => {
  global.fetch = oldFetch;
  global.sessionStorage = oldSessionStorage;
};
const getState = () => ({});

describe('saveAddress', () => {
  const frontEndAddress = {
    type: ADDRESS_TYPES.military,
    city: 'apo',
    state: 'secret'
  };

  beforeEach(setup);
  afterEach(teardown);

  it('dispatches SAVE_ADDRESS_PENDING first', (done) => {
    const thunk = saveAddress(frontEndAddress);
    const dispatch = sinon.spy();
    thunk(dispatch, getState)
      .then(() => {
        const action = dispatch.firstCall.args[0];
        expect(action.type).to.equal(SAVE_ADDRESS_PENDING);
      }).then(done, done);
  });

  it('dispatches SAVE_ADDRESS_SUCCESS on update success', (done) => {
    const thunk = saveAddress(frontEndAddress);
    const dispatch = sinon.spy();
    thunk(dispatch, getState)
      .then(() => {
        const action = dispatch.secondCall.args[0];
        expect(action.type).to.equal(SAVE_ADDRESS_SUCCESS);
        expect(action.address).to.eql(frontEndAddress);
      }).then(done, done);
  });

  it('dispatches SAVE_ADDRESS_FAILURE on update failure', (done) => {
    global.fetch.returns(Promise.reject({}));
    const thunk = saveAddress(frontEndAddress);
    const dispatch = sinon.spy();
    thunk(dispatch, getState)
      .then(() => {
        const action = dispatch.secondCall.args[0];
        expect(action.type).to.equal(SAVE_ADDRESS_FAILURE);
      }).then(done, done);
  });
});

describe('getLettersList', () => {
  beforeEach(setup);
  afterEach(teardown);

  const lettersResponse = {
    data: {
      attributes: {
        letters: [
          { name: 'Proof of Service Letter', letterType: 'proof_of_service' },
          { name: 'Civil Service Preference Letter', letterType: 'civil_service' }
        ],
        fullName: 'Mark Webb'
      },
      id: null,
      type: 'evss_letters_letters_response'
    }
  };

  it('dispatches GET_LETTERS_SUCCESS when GET succeeds', (done) => {
    global.fetch.returns(Promise.resolve({
      headers: { get: () => 'application/json' },
      ok: true,
      json: () => Promise.resolve(lettersResponse)
    }));
    const thunk = getLetterList();
    const dispatch = sinon.spy();
    thunk(dispatch, getState)
      .then(() => {
        const action = dispatch.firstCall.args[0];
        expect(action.type).to.equal(GET_LETTERS_SUCCESS);
        expect(action.data).to.eql(lettersResponse);
      }).then(done, done);
  });

  it('dispatches GET_LETTERS_FAILURE when GET fails with generic error', (done) => {
    global.fetch.returns(Promise.reject(new Error('something went wrong')));
    const thunk = getLetterList();
    const dispatch = sinon.spy();
    thunk(dispatch, getState)
      .then(() => {
        const action = dispatch.firstCall.args[0];
        expect(action.type).to.equal(GET_LETTERS_FAILURE);
      }).then(done, done);
  });

  const lettersErrors = {
    503: BACKEND_SERVICE_ERROR,
    504: BACKEND_SERVICE_ERROR,
    403: BACKEND_AUTHENTICATION_ERROR,
    502: LETTER_ELIGIBILITY_ERROR,
    500: GET_LETTERS_FAILURE
  };

  Object.keys(lettersErrors).forEach((code) => {
    it(`dispatches ${lettersErrors[code]} when GET fails with ${code}`, (done) => {
      global.fetch.returns(Promise.reject({
        errors: [{ status: `${code}` }]
      }));

      const thunk = getLetterList();
      const dispatch = sinon.spy();
      thunk(dispatch, getState)
        .then(() => {
          const action = dispatch.firstCall.args[0];
          expect(action.type).to.equal(lettersErrors[code]);
        }).then(done, done);
    });
  });
});

describe('getMailingAddress', () => {
  beforeEach(setup);
  afterEach(teardown);

  const addressResponse = {
    data: {
      attributes: {
        address: {
          type: 'DOMESTIC',
          addressEffectiveDate: '1973-01-01T05:00:00.000+00:00',
          addressOne: '140 Rock Creek Church Rd NW',
          addressTwo: '',
          addressThree: '',
          city: 'Washington',
          stateCode: 'DC',
          zipCode: '20011',
          zipSuffix: '1865'
        },
        controlInformation: {
          canUpdate: true,
          corpAvailIndicator: true,
          corpRecFoundIndicator: true,
          hasNoBdnPaymentsIndicator: true,
          isCompetentIndicator: true,
          indentityIndicator: true,
          indexIndicator: true,
          noFiduciaryAssignedIndicator: true,
          notDeceasedIndicator: true
        }
      }
    }
  };

  it('dispatches GET_ADDRESS_SUCCESS when GET succeeds', (done) => {
    global.fetch.returns(Promise.resolve({
      headers: { get: () => 'application/json' },
      ok: true,
      json: () => Promise.resolve(addressResponse)
    }));

    const thunk = getMailingAddress();
    const dispatch = sinon.spy();
    thunk(dispatch, getState)
      .then(() => {
        const action = dispatch.firstCall.args[0];
        expect(action.type).to.equal(GET_ADDRESS_SUCCESS);
      }).then(done, done);
  });

  it('dispatches GET_ADDRESS_FAILURE when GET fails', (done) => {
    global.fetch.returns(Promise.reject({}));
    const thunk = getMailingAddress();
    const dispatch = sinon.spy();
    thunk(dispatch, getState)
      .then(() => {
        const action = dispatch.firstCall.args[0];
        expect(action.type).to.equal(GET_ADDRESS_FAILURE);
      }).then(done, done);
  });

  it('dispatches GET_ADDRESS_FAILURE when response mangled', (done) => {
    global.fetch.returns(Promise.resolve({
      headers: { get: () => 'application/json' },
      ok: true,
      json: () => Promise.resolve({})
    }));
    const thunk = getMailingAddress();
    const dispatch = sinon.spy();
    thunk(dispatch, getState)
      .then(() => {
        const action = dispatch.firstCall.args[0];
        expect(action.type).to.equal(GET_ADDRESS_FAILURE);
      }).then(done, done);
  });

  // Note: not really sure we need to test this as long as the next test passes
  it('dispatches with clone of response object (not original)', (done) => {
    global.fetch.returns(Promise.resolve({
      headers: { get: () => 'application/json' },
      ok: true,
      json: () => Promise.resolve(addressResponse)
    }));
    const thunk = getMailingAddress();
    const dispatch = sinon.spy();
    thunk(dispatch, getState)
      .then(() => {
        const action = dispatch.firstCall.args[0];
        expect(action.data).to.not.equal(addressResponse);
      }).then(done, done);
  });

  it('modifies military addresses', (done) => {
    const militaryAddress = {
      ...addressResponse.data.attributes.address,
      type: 'MILITARY',
      militaryPostOfficeTypeCode: 'APO',
      militaryStateCode: 'AE'
    };

    const militaryResponse = { ...addressResponse };
    militaryResponse.data.attributes.address = {
      ...addressResponse.data.attributes.address,
      ...militaryAddress
    };

    global.fetch.returns(Promise.resolve({
      headers: { get: () => 'application/json' },
      ok: true,
      json: () => Promise.resolve(militaryResponse)
    }));
    const thunk = getMailingAddress();
    const dispatch = sinon.spy();
    thunk(dispatch, getState)
      .then(() => {
        const action = dispatch.firstCall.args[0];
        const { address } = action.data.data.attributes; // Actual
        const { militaryPostOfficeTypeCode, militaryStateCode } = militaryAddress; // Test
        expect(address.city).to.equal(militaryPostOfficeTypeCode);
        expect(address.stateCode).to.equal(militaryStateCode);
        expect(address.militaryPostOfficeTypeCode).to.be.undefined;
        expect(address.militaryStateCode).to.be.undefined;
      }).then(done, done);
  });
});

describe('getBenefitSummaryOptions', () => {
  beforeEach(setup);
  afterEach(teardown);

  const mockResponse = {
    data: {
      attributes: {
        benefitInformation: {
          hasNonServiceConnectedPension: true,
          hasServiceConnectedDisabilities: true,
          hasSurvivorsIndemnityCompensationAward: true,
          hasSurvivorsPensionAward: true,
          monthlyAwardAmount: 123.5,
          serviceConnectedPercentage: 2,
          awardEffectiveDate: true,
          hasAdaptedHousing: true,
          hasChapter35Eligibility: true,
          hasDeathResultOfDisability: true,
          hasIndividualUnemployabilityGranted: true,
          hasSpecialMonthlyCompensation: true
        },
        militaryService: [
          {
            branch: 'ARMY',
            characterOfService: 'HONORABLE',
            enteredDate: '1973-01-01T05:00:00.000+00:00',
            releasedDate: '1977-10-01T04:00:00.000+00:00'
          }
        ]
      },
      id: null,
      type: 'evss_letters_letter_beneficiary_response'
    }
  };

  it('dispatches SUCCESS action with response when GET succeeds', (done) => {
    global.fetch.returns(Promise.resolve({
      headers: { get: () => 'application/json' },
      ok: true,
      json: () => Promise.resolve(mockResponse)
    }));
    const thunk = getBenefitSummaryOptions();
    const dispatch = sinon.spy();

    thunk(dispatch, getState)
      .then(() => {
        const action = dispatch.args[0][0]; // first call, first arg
        expect(action.type).to.equal(GET_BENEFIT_SUMMARY_OPTIONS_SUCCESS);
        expect(action.data).to.eql(mockResponse);
      }).then(done, done);
  });

  it('dispatches FAILURE action when GET fails', (done) => {
    global.fetch.returns(Promise.reject({}));
    const thunk = getBenefitSummaryOptions();
    const dispatch = sinon.spy();

    thunk(dispatch, getState)
      .then(() => {
        expect(dispatch.calledWith({ type: GET_BENEFIT_SUMMARY_OPTIONS_FAILURE })).to.be.true;
      }).then(done, done);
  });
});

describe.skip('getLetterPdf', () => {
  beforeEach(setup);
  afterEach(teardown);

  // const civilSLetter = {
  //   letterName: 'Civil Service Preference Letter',
  //   letterType: LETTER_TYPES.civilService,
  //   letterOptions: {
  //     // Opts only relevant for BSL but ATM required in every download link
  //     militaryService: true,
  //     monthlyAward: true,
  //     serviceConnectedEvaluation: true,
  //     chapter35Eligibility: true,
  //     serviceConnectedDisabilities: true
  //   }
  // };

  // const benefitSLetter = {
  //   letterName: 'Benefit Summary Letter',
  //   letterType: LETTER_TYPES.benefitSummary,
  //   letterOptions: {
  //     // Opts only relevant for BSL but ATM required in every download link
  //     militaryService: true,
  //     monthlyAward: true,
  //     serviceConnectedEvaluation: true,
  //     chapter35Eligibility: true,
  //     serviceConnectedDisabilities: true
  //   }
  // };

  it('sets up fetch for benefit summary letter', () => {});

  it('sets up fetch for non-benefit-summary letters', () => {});

  it('dispatches PENDING action when download initiated', () => {});

  it('handles ie10 stuff', () => {});

  it('downloads stuff conditionally', () => {});

  it('dispatches DOWNLOAD_SUCCESS once download succeeds', () => {});

  it('dispatches DOWNLOAD_FAILED if download or fetch fails', () => {});
});

describe('getAddressCountries', () => {
  beforeEach(setup);
  afterEach(teardown);

  const countriesResponse = {
    data: {
      attributes: {
        countries: [
          { name: 'USA' },
          { name: 'Afghanistan' }
        ]
      }
    }
  };

  it('dispatches SUCCESS when GET succeeds', (done) => {
    global.fetch.returns(Promise.resolve({
      headers: { get: () => 'application/json' },
      ok: true,
      json: () => Promise.resolve(countriesResponse)
    }));
    const thunk = getAddressCountries();
    const dispatch = sinon.spy();

    thunk(dispatch, getState)
      .then(() => {
        const action = dispatch.args[0][0]; // first call, first arg
        expect(action.type).to.equal(GET_ADDRESS_COUNTRIES_SUCCESS);
        expect(action.countries).to.eql(countriesResponse);
      }).then(done, done);
  });

  it('dispatches FAILURE when GET fails', (done) => {
    global.fetch.returns(Promise.reject({}));
    const thunk = getAddressCountries();
    const dispatch = sinon.spy();

    thunk(dispatch, getState)
      .then(() => {
        const action = dispatch.args[0][0]; // first call, first arg
        expect(action.type).to.equal(GET_ADDRESS_COUNTRIES_FAILURE);
      }).then(done, done);
  });
});

describe('getAddressStates', () => {
  beforeEach(setup);
  afterEach(teardown);

  const statesResponse = {
    data: {
      attributes: {
        states: [
          { name: 'CA' },
          { name: 'AK' }
        ]
      }
    }
  };

  it('dispatches SUCCESS when GET succeeds', (done) => {
    global.fetch.returns(Promise.resolve({
      headers: { get: () => 'application/json' },
      ok: true,
      json: () => Promise.resolve(statesResponse)
    }));
    const thunk = getAddressStates();
    const dispatch = sinon.spy();

    thunk(dispatch, getState)
      .then(() => {
        const action = dispatch.args[0][0]; // first call, first arg
        expect(action.type).to.equal(GET_ADDRESS_STATES_SUCCESS);
        expect(action.states).to.eql(statesResponse);
      }).then(done, done);
  });

  it('dispatches FAILURE when GET fails', (done) => {
    global.fetch.returns(Promise.reject({}));
    const thunk = getAddressStates();
    const dispatch = sinon.spy();

    thunk(dispatch, getState)
      .then(() => {
        const action = dispatch.args[0][0]; // first call, first arg
        expect(action.type).to.equal(GET_ADDRESS_STATES_FAILURE);
      }).then(done, done);
  });
});
