import { expect } from 'chai';
import sinon from 'sinon';
// import * as Sentry from '@sentry/browser';
import sentryTestkit from 'sentry-testkit';

const { testkit } = sentryTestkit();
// const { testkit, sentryTransport } = sentryTestkit();

import {
  BACKEND_SERVICE_ERROR,
  BACKEND_AUTHENTICATION_ERROR,
  GET_BENEFIT_SUMMARY_OPTIONS_SUCCESS,
  GET_BENEFIT_SUMMARY_OPTIONS_FAILURE,
  GET_LETTER_PDF_DOWNLOADING,
  GET_LETTER_PDF_SUCCESS,
  GET_LETTER_PDF_FAILURE,
  GET_LETTERS_SUCCESS,
  GET_LETTERS_FAILURE,
  LETTER_ELIGIBILITY_ERROR,
  LETTER_TYPES,
} from '../../utils/constants';

import {
  getLetterList,
  getLetterListAndBSLOptions,
  getBenefitSummaryOptions,
  getLetterPdf,
} from '../../actions/letters';

/**
 * commenting this out due to this error that occurs when running all tests
 * after the JSDOM upgrade:
 *
 * node_modules/jsdom/lib/jsdom/living/helpers/create-event-accessor.js:9
 * el.addEventListener(eventName, event => {
 *    ^
 * TypeError: el.addEventListener is not a function:
 */
// Sentry.init({
//   dsn: 'http://one@fake/dsn',
//   transport: sentryTransport,
// });

/**
 * Setup() for each test requires stubbing global fetch() and setting userToken.
 * Teardown() resets everything back to normal.
 */
let oldFetch;
let oldWindow;
const setup = () => {
  testkit.reset();
  oldFetch = global.fetch;
  oldWindow = global.window;
  global.fetch = sinon.stub();
  global.fetch.returns(
    Promise.resolve({
      headers: { get: () => 'application/json' },
      ok: true,
      json: () => Promise.resolve({}),
    }),
  );
  global.window.dataLayer = [];
  global.window.URL = {
    createObjectURL: () => {},
    revokeObjectURL: () => {},
  };
};
const teardown = () => {
  global.fetch = oldFetch;
  global.window = oldWindow;
};
const getState = () => ({});

describe('getLettersList', () => {
  beforeEach(setup);
  afterEach(teardown);

  const lettersResponse = {
    data: {
      attributes: {
        letters: [
          { name: 'Proof of Service Letter', letterType: 'proof_of_service' },
          {
            name: 'Civil Service Preference Letter',
            letterType: 'civil_service',
          },
        ],
        fullName: 'Mark Webb',
      },
      id: null,
      type: 'evss_letters_letters_response',
    },
  };

  it('dispatches GET_LETTERS_SUCCESS when GET succeeds', done => {
    global.fetch.returns(
      Promise.resolve({
        headers: { get: () => 'application/json' },
        ok: true,
        json: () => Promise.resolve(lettersResponse),
      }),
    );
    const dispatch = sinon.spy();
    getLetterList(dispatch)
      .then(() => {
        const action = dispatch.firstCall.args[0];
        expect(action.type).to.equal(GET_LETTERS_SUCCESS);
        expect(action.data).to.eql(lettersResponse);
      })
      .then(done, done);
  });

  it('dispatches GET_LETTERS_FAILURE when GET fails with generic error', done => {
    global.fetch.returns(Promise.reject(new Error('something went wrong')));
    const dispatch = sinon.spy();
    getLetterList(dispatch)
      .then(() => {
        done(
          new Error('getLetterList should have rejected but resolved instead'),
        );
      })
      .catch(() => {
        const action = dispatch.firstCall.args[0];
        expect(action.type).to.equal(GET_LETTERS_FAILURE);
        expect(testkit.reports().length).to.equal(2); // One from apiRequest, one from getLetterList()
        done();
      });
  });

  const lettersErrors = {
    503: BACKEND_SERVICE_ERROR,
    504: BACKEND_SERVICE_ERROR,
    403: BACKEND_AUTHENTICATION_ERROR,
    502: LETTER_ELIGIBILITY_ERROR,
    500: GET_LETTERS_FAILURE,
  };

  Object.keys(lettersErrors).forEach(code => {
    it(`dispatches ${
      lettersErrors[code]
    } when GET fails with ${code}`, done => {
      global.fetch.returns(
        Promise.reject({
          errors: [{ status: `${code}` }],
        }),
      );

      const dispatch = sinon.spy();
      getLetterList(dispatch)
        // Just get to the test already!
        // Note: This could swallow unexpected errors
        .catch(() => Promise.resolve())
        .then(() => {
          const action = dispatch.firstCall.args[0];
          expect(action.type).to.equal(lettersErrors[code]);
          const reports = testkit.reports();
          expect(reports.length).to.equal(2);
          expect(reports[1].exception.values[0].value).to.equal(
            `vets_letters_error_getLetterList ${code}`,
          );
          expect(reports[1].fingerprint).to.eql(['{{ default }}', code]);
        })
        .then(done, done);
    });
  });
});

describe('getLetterListAndBSLOptions', () => {
  beforeEach(setup);
  afterEach(teardown);

  it('should make the call to get the BSL options after the letter list call is complete', done => {
    const thunk = getLetterListAndBSLOptions();
    const dispatch = () => {};

    thunk(dispatch).then(() => {
      expect(global.fetch.callCount).to.equal(2);
      expect(global.fetch.firstCall.args[0].endsWith('/v0/letters')).to.be.true;
      expect(
        global.fetch.secondCall.args[0].endsWith('/v0/letters/beneficiary'),
      ).to.be.true;
      done();
    });
  });

  it('should not make the call to get the BSL options if the letter list call fails', done => {
    global.fetch.returns(Promise.reject());
    const thunk = getLetterListAndBSLOptions();
    const dispatch = () => {};

    thunk(dispatch).then(() => {
      expect(global.fetch.callCount).to.equal(1);
      done();
    });
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
          hasSpecialMonthlyCompensation: true,
        },
        militaryService: [
          {
            branch: 'ARMY',
            characterOfService: 'HONORABLE',
            enteredDate: '1973-01-01T05:00:00.000+00:00',
            releasedDate: '1977-10-01T04:00:00.000+00:00',
          },
        ],
      },
      id: null,
      type: 'evss_letters_letter_beneficiary_response',
    },
  };

  it('dispatches SUCCESS action with response when GET succeeds', done => {
    global.fetch.returns(
      Promise.resolve({
        headers: { get: () => 'application/json' },
        ok: true,
        json: () => Promise.resolve(mockResponse),
      }),
    );
    const dispatch = sinon.spy();

    getBenefitSummaryOptions(dispatch, getState)
      .then(() => {
        const action = dispatch.args[0][0]; // first call, first arg
        expect(action.type).to.equal(GET_BENEFIT_SUMMARY_OPTIONS_SUCCESS);
        expect(action.data).to.eql(mockResponse);
      })
      .then(done, done);
  });

  it('dispatches FAILURE action when GET fails', done => {
    global.fetch.returns(Promise.reject({}));
    const dispatch = sinon.spy();

    getBenefitSummaryOptions(dispatch, getState)
      .then(() => {
        done(
          new Error(
            'getBenefitSummaryOptions should have rejected but resolved instead',
          ),
        );
      })
      .catch(() => {
        expect(
          dispatch.calledWith({ type: GET_BENEFIT_SUMMARY_OPTIONS_FAILURE }),
        ).to.be.true;
        done();
      });
  });
});

describe('getLetterPdf', () => {
  beforeEach(setup);
  afterEach(teardown);

  const benefitSLetter = {
    letterName: 'Benefit Summary Letter',
    letterType: LETTER_TYPES.benefitSummary,
    letterOptions: {
      militaryService: true,
      monthlyAward: true,
      serviceConnectedEvaluation: true,
      chapter35Eligibility: true,
      serviceConnectedDisabilities: true,
    },
  };

  const civilSLetter = {
    letterName: 'Civil Service Preference Letter',
    letterType: LETTER_TYPES.civilService,
    letterOptions: {
      // Opts only relevant for BSL but ATM required in every download link
      militaryService: true,
      monthlyAward: true,
      serviceConnectedEvaluation: true,
      chapter35Eligibility: true,
      serviceConnectedDisabilities: true,
    },
  };

  it('dispatches download pending action first', done => {
    const { letterType, letterName, letterOptions } = benefitSLetter;
    const thunk = getLetterPdf(letterType, letterName, letterOptions);
    const dispatch = sinon.spy();
    thunk(dispatch, getState)
      .then(() => {
        const action = dispatch.firstCall.args[0];
        expect(action.type).to.equal(GET_LETTER_PDF_DOWNLOADING);
        expect(action.data).to.equal(letterType);
      })
      .then(done, done);
  });

  it('dispatches SUCCESS action when fetch succeeds for BSL', done => {
    global.fetch.returns(
      Promise.resolve({
        headers: { get: () => 'application/octet-stream' },
        ok: true,
        blob: () => Promise.resolve({ test: '123 testing' }),
      }),
    );
    const { letterType, letterName, letterOptions } = benefitSLetter;
    const thunk = getLetterPdf(letterType, letterName, letterOptions);
    const dispatch = sinon.spy();
    thunk(dispatch, getState)
      .then(() => {
        const action = dispatch.secondCall.args[0];
        expect(action.type).to.equal(GET_LETTER_PDF_SUCCESS);
      })
      .then(done, done);
  });

  it('dispatches SUCCESS action when fetch succeeds for non-BSL', done => {
    global.fetch.returns(
      Promise.resolve({
        headers: { get: () => 'application/octet-stream' },
        ok: true,
        blob: () => Promise.resolve({ test: '123 testing' }),
      }),
    );
    const { letterType, letterName, letterOptions } = civilSLetter;
    const thunk = getLetterPdf(letterType, letterName, letterOptions);
    const dispatch = sinon.spy();
    thunk(dispatch, getState)
      .then(() => {
        const action = dispatch.secondCall.args[0];
        expect(action.type).to.equal(GET_LETTER_PDF_SUCCESS);
      })
      .then(done, done);
  });

  it('dispatches SUCCESS action when fetch succeeds on IE10', done => {
    const ieDownloadSpy = sinon.spy();
    const blobObj = { test: '123 testing' };
    global.window.navigator.msSaveOrOpenBlob = ieDownloadSpy; // fakes IE
    global.fetch.returns(
      Promise.resolve({
        headers: { get: () => 'application/octet-stream' },
        ok: true,
        blob: () => Promise.resolve(blobObj),
      }),
    );
    const { letterType, letterName, letterOptions } = civilSLetter;
    const thunk = getLetterPdf(letterType, letterName, letterOptions);
    const dispatch = sinon.spy();
    thunk(dispatch, getState)
      .then(() => {
        const action = dispatch.secondCall.args[0];
        const msBlobArgs = ieDownloadSpy.firstCall.args;
        expect(action.type).to.equal(GET_LETTER_PDF_SUCCESS);
        expect(msBlobArgs).to.have.members([blobObj, `${letterName}.pdf`]);
      })
      .then(done, done);
  });

  it('dispatches FAILURE action if download fails', done => {
    global.fetch.returns(Promise.reject(new Error('Oops, this failed')));
    const { letterType, letterName, letterOptions } = benefitSLetter;
    const thunk = getLetterPdf(letterType, letterName, letterOptions);
    const dispatch = sinon.spy();
    thunk(dispatch, getState)
      .then(() => {
        const action = dispatch.secondCall.args[0];
        expect(action.type).to.equal(GET_LETTER_PDF_FAILURE);
      })
      .then(done, done);
  });
});
