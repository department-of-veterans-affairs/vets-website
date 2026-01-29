import { expect } from 'chai';
import sinon from 'sinon';

import { testkit } from 'platform/testing/unit/sentry';
import {
  mockFetch,
  setFetchBlobFailure,
  setFetchBlobResponse,
  setFetchJSONFailure,
  setFetchJSONResponse,
} from 'platform/testing/unit/helpers';
import * as recordEventModule from 'platform/monitoring/record-event';
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
  GET_ENHANCED_LETTERS_DOWNLOADING,
  GET_ENHANCED_LETTERS_SUCCESS,
  GET_ENHANCED_LETTERS_FAILURE,
  INVALID_ADDRESS_PROPERTY,
  UPDATE_BENEFIT_SUMMARY_REQUEST_OPTION,
  GET_TSA_LETTER_ELIGIBILITY_SUCCESS,
  GET_TSA_LETTER_ELIGIBILITY_LOADING,
  GET_TSA_LETTER_ELIGIBILITY_ERROR,
} from '../../utils/constants';

import {
  getLetterList,
  getLetterListAndBSLOptions,
  getBenefitSummaryOptions,
  getLetterPdf,
  getLetterBlobUrl,
  getSingleLetterPDFLink,
  updateBenefitSummaryRequestOption,
  getTsaLetterEligibility,
} from '../../actions/letters';

/**
 * Setup() for each test requires setting userToken.
 * Teardown() resets it back to normal.
 */

const setup = () => {
  testkit.reset();
  mockFetch();
  setFetchJSONResponse(global.fetch.onCall(0), {});
  global.window.URL = {
    createObjectURL: () => {},
    revokeObjectURL: () => {},
  };
};

const migrationOptions = {
  listEndpoint: {
    method: 'GET',
    path: '/v0/letters',
  },
  summaryEndpoint: {
    method: 'GET',
    path: '/v0/letters/beneficiary',
  },
  downloadEndpoint: {
    method: 'POST',
    path: '/v0/letters',
  },
  dataEntryPoint: ['data', 'attributes'],
};

const getState = () => ({});

describe('getLettersList', () => {
  beforeEach(setup);

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
    },
  };

  it('dispatches GET_LETTERS_SUCCESS when GET succeeds', done => {
    setFetchJSONResponse(
      global.fetch.onCall(0),
      // LH_MIGRATION: EVSS wraps the meat of the response in data -> attributs
      // This can be unwrapped to just `mockResponse` when migration is complete
      { data: { attributes: lettersResponse } },
    );
    const dispatch = sinon.spy();
    getLetterList(dispatch, migrationOptions)
      .then(() => {
        const action = dispatch.firstCall.args[0];
        expect(action.type).to.equal(GET_LETTERS_SUCCESS);
        expect(action.data).to.eql(lettersResponse);
      })
      .then(done, done);
  });

  it('dispatches GET_LETTERS_FAILURE when GET fails with generic error', done => {
    setFetchJSONFailure(
      global.fetch.onCall(0),
      Promise.reject(new Error('error')),
    );
    const dispatch = sinon.spy();
    getLetterList(dispatch, migrationOptions)
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
    done();
  });

  const lettersErrors = {
    503: BACKEND_SERVICE_ERROR,
    504: BACKEND_SERVICE_ERROR,
    403: BACKEND_AUTHENTICATION_ERROR,
    502: LETTER_ELIGIBILITY_ERROR,
    500: GET_LETTERS_FAILURE,
    422: INVALID_ADDRESS_PROPERTY,
  };

  Object.keys(lettersErrors).forEach(code => {
    it(`dispatches ${
      lettersErrors[code]
    } when GET fails with ${code}`, done => {
      setFetchJSONFailure(global.fetch.onCall(0), {
        errors: [{ status: `${code}` }],
        code,
      });

      const dispatch = sinon.spy();
      getLetterList(dispatch, migrationOptions)
        // Just get to the test already!
        // Note: This could swallow unexpected errors
        .catch(() => Promise.resolve())
        .then(() => {
          const action = dispatch.firstCall.args[0];
          expect(action.type).to.equal(lettersErrors[code]);
          const reports = testkit.reports();
          expect(reports.length).to.equal(1);
          expect(reports[0].exception.values[0].value).to.equal(
            `vets_letters_error_getLetterList ${code}`,
          );
          expect(reports[0].fingerprint).to.eql(['{{ default }}', code]);
        })
        .then(done, done);
    });
  });
});

describe('getLetterListAndBSLOptions', () => {
  beforeEach(setup);

  it('should make the call to get the BSL options after the letter list call is complete', done => {
    const thunk = getLetterListAndBSLOptions(migrationOptions);
    const dispatch = () => {};

    thunk(dispatch)
      .then(() => {
        expect(global.fetch.callCount).to.equal(2);
        expect(global.fetch.firstCall.args[0].endsWith('/v0/letters')).to.be
          .true;
        expect(
          global.fetch.secondCall.args[0].endsWith('/v0/letters/beneficiary'),
        ).to.be.true;
        done();
      })
      .catch(e => {
        done(e);
      });
  });

  it('should not make the call to get the BSL options if the letter list call fails', done => {
    setFetchJSONFailure(global.fetch.onCall(0), Promise.reject());
    const thunk = getLetterListAndBSLOptions(migrationOptions);
    const dispatch = () => {};

    thunk(dispatch).then(() => {
      expect(global.fetch.callCount).to.equal(1);
      done();
    });
  });
});

describe('getBenefitSummaryOptions', () => {
  beforeEach(setup);

  const mockResponse = {
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
  };

  it('dispatches SUCCESS action with response when GET succeeds', done => {
    setFetchJSONResponse(
      global.fetch.onCall(0),
      // LH_MIGRATION: EVSS wraps the meat of the response in data -> attributs
      // This can be unwrapped to just `mockResponse` when migration is complete
      { data: { attributes: mockResponse } },
    );
    const dispatch = sinon.spy();

    getBenefitSummaryOptions(dispatch, migrationOptions)
      .then(() => {
        const action = dispatch.args[0][0]; // first call, first arg
        expect(action.type).to.equal(GET_BENEFIT_SUMMARY_OPTIONS_SUCCESS);
        expect(action.data).to.eql(mockResponse);
      })
      .then(done, done);
  });

  it('dispatches FAILURE action when GET fails', done => {
    setFetchBlobFailure(
      global.fetch.onCall(0),
      Promise.reject(new Error('error')),
    );
    const dispatch = sinon.spy();

    getBenefitSummaryOptions(dispatch, migrationOptions)
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
    const thunk = getLetterPdf(
      letterType,
      letterName,
      letterOptions,
      migrationOptions,
    );
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
    setFetchBlobResponse(global.fetch.onCall(0), { test: '123 testing' });
    const { letterType, letterName, letterOptions } = benefitSLetter;
    const thunk = getLetterPdf(
      letterType,
      letterName,
      letterOptions,
      migrationOptions,
    );
    const dispatch = sinon.spy();
    thunk(dispatch, getState)
      .then(() => {
        const action = dispatch.secondCall.args[0];
        expect(action.type).to.equal(GET_LETTER_PDF_SUCCESS);
      })
      .then(done, done);
  });

  it('dispatches SUCCESS action when fetch succeeds for non-BSL', done => {
    setFetchBlobResponse(global.fetch.onCall(0), { test: '123 testing' });
    const { letterType, letterName, letterOptions } = civilSLetter;
    const thunk = getLetterPdf(
      letterType,
      letterName,
      letterOptions,
      migrationOptions,
    );
    const dispatch = sinon.spy();
    thunk(dispatch, getState)
      .then(() => {
        const action = dispatch.secondCall.args[0];
        expect(action.type).to.equal(GET_LETTER_PDF_SUCCESS);
      })
      .then(done, done);
  });

  it('dispatches FAILURE action if download fails', done => {
    setFetchJSONFailure(global.fetch.onCall(0), new Error('Oops, this failed'));
    const { letterType, letterName, letterOptions } = benefitSLetter;
    const thunk = getLetterPdf(
      letterType,
      letterName,
      letterOptions,
      migrationOptions,
    );
    const dispatch = sinon.spy();
    thunk(dispatch, getState)
      .then(() => {
        const action = dispatch.secondCall.args[0];
        expect(action.type).to.equal(GET_LETTER_PDF_FAILURE);
      })
      .then(done, done);
  });
});

describe('getSingleLetterPDFLink', () => {
  let stubCreateObjectUrl;

  beforeEach(() => {
    setup();
    // Stub URL.createObjectURL
    stubCreateObjectUrl = sinon.stub(window.URL, 'createObjectURL');
  });

  afterEach(() => {
    stubCreateObjectUrl.restore();
  });

  const letterType = LETTER_TYPES.proofOfService;

  it('dispatches downloading and success actions with the correct blob URL', async () => {
    const dispatch = sinon.spy();
    const mockUrl = 'http://fake-site.com/letter.pdf';
    stubCreateObjectUrl.onCall(0).returns(mockUrl);

    const blob = new Blob(['PDF content'], { type: 'application/pdf' });
    const response = new Response(blob, {
      status: 200,
      headers: { 'Content-Type': 'application/pdf' },
    });
    setFetchBlobResponse(global.fetch.onCall(0), response);

    await getSingleLetterPDFLink(
      dispatch,
      letterType,
      migrationOptions,
      getState,
    );

    const action1 = dispatch.getCall(0).args[0];
    const action2 = dispatch.getCall(1).args[0];

    expect(action1.type).to.equal(GET_ENHANCED_LETTERS_DOWNLOADING);
    expect(action1.letterType).to.equal(letterType);

    expect(action2.type).to.equal(GET_ENHANCED_LETTERS_SUCCESS);
    expect(action2.data).to.deep.equal([
      {
        letterType,
        downloadUrl: mockUrl,
      },
    ]);
  });

  it('dispatches failure action if blob fetch fails', async () => {
    const dispatch = sinon.spy();

    setFetchJSONFailure(global.fetch, Promise.reject(new Error('error')));

    await getSingleLetterPDFLink(
      dispatch,
      letterType,
      migrationOptions,
      getState,
    );

    const action1 = dispatch.getCall(0).args[0];
    const action2 = dispatch.getCall(2).args[0];

    expect(action1.type).to.equal(GET_ENHANCED_LETTERS_DOWNLOADING);
    expect(action2.type).to.equal(GET_ENHANCED_LETTERS_FAILURE);
    expect(action2.letterType).to.equal(letterType);
  });
});
describe('getLetterBlobUrl', () => {
  let stubCreateObjectUrl;

  beforeEach(() => {
    setup();
    stubCreateObjectUrl = sinon.stub(window.URL, 'createObjectURL');
  });

  afterEach(() => {
    stubCreateObjectUrl.restore();
  });

  it('should return the blob URL string', done => {
    const dispatch = sinon.spy();
    const mockBlob = () => Promise.resolve(Buffer.from('PDF file content'));
    setFetchJSONResponse(global.fetch.onCall(0), { blob: mockBlob });

    stubCreateObjectUrl.onCall(0).returns('blob:http://example.com/letter.pdf');

    getLetterBlobUrl(dispatch, LETTER_TYPES.civilService, migrationOptions)
      .then(() => {
        expect(stubCreateObjectUrl.called).to.be.true;
        expect(stubCreateObjectUrl.returnValues.length).to.equal(1);
        expect(stubCreateObjectUrl.returnValues[0]).to.equal(
          'blob:http://example.com/letter.pdf',
        );
      })
      .then(done, done);
  });

  it('should dispatch an error if something goes wrong', done => {
    const dispatch = sinon.spy();
    setFetchJSONFailure(
      global.fetch.onCall(0),
      Promise.reject(new Error('error')),
    );

    getLetterBlobUrl(dispatch, LETTER_TYPES.civilService, migrationOptions)
      .catch(() => {
        const action1 = dispatch.getCall(0).args[0];
        expect(dispatch.called).to.be.true;
        expect(action1.type).to.equal(GET_LETTER_PDF_FAILURE);
        expect(action1.data).to.equal(LETTER_TYPES.civilService);
      })
      .then(done, done);
  });
});

describe('updateBenefitSummaryRequestOption', () => {
  it('returns the correct action object', () => {
    const propertyPath = 'serviceInfo.includesServiceBefore1978';
    const value = true;

    const action = updateBenefitSummaryRequestOption(propertyPath, value);

    expect(action).to.eql({
      type: UPDATE_BENEFIT_SUMMARY_REQUEST_OPTION,
      propertyPath,
      value,
    });
  });
});

describe('getTsaLetterEligibility', () => {
  let recordEventStub;

  beforeEach(() => {
    setup();
    recordEventStub = sinon.stub(recordEventModule, 'default');
  });

  afterEach(() => {
    recordEventStub.restore();
  });

  it('dispatches LOADING action first', async () => {
    setFetchJSONResponse(global.fetch.onCall(0), { data: [] });
    const dispatch = sinon.spy();
    const thunk = getTsaLetterEligibility();
    await thunk(dispatch);
    const action = dispatch.firstCall.args[0];
    expect(action.type).to.equal(GET_TSA_LETTER_ELIGIBILITY_LOADING);
  });

  it('dispatches SUCCESS action when fetch succeeds for determining eligibility', async () => {
    setFetchJSONResponse(global.fetch.onFirstCall(), {
      data: [
        {
          attributes: {
            documentId: '456',
          },
        },
        {
          attributes: {
            documentId: '123',
            receivedAt: '2025-01-01',
          },
        },
        {
          attributes: {
            documentId: '789',
            receivedAt: '2024-01-01',
          },
        },
      ],
    });
    const dispatch = sinon.spy();
    const thunk = getTsaLetterEligibility();
    await thunk(dispatch);
    const successAction = dispatch.secondCall.args[0];
    expect(successAction.type).to.equal(GET_TSA_LETTER_ELIGIBILITY_SUCCESS);
    expect(successAction.data.attributes.documentId).to.equal('123');
    expect(recordEventStub.called).to.be.true;
    expect(recordEventStub.getCall(0).args[0]).to.deep.equal({
      event: 'api_call',
      'api-name': 'GET /v0/tsa_letter',
      'api-status': 'successful',
      'has-letter': true,
    });
  });

  it('dispatches ERROR action when fetch fails for determining eligibility', async () => {
    setFetchJSONFailure(global.fetch.onCall(0), new Error('error'));
    const dispatch = sinon.spy();
    const thunk = getTsaLetterEligibility();
    await thunk(dispatch);
    const errorAction = dispatch.secondCall.args[0];
    expect(errorAction.type).to.equal(GET_TSA_LETTER_ELIGIBILITY_ERROR);
    expect(recordEventStub.called).to.be.true;
    expect(recordEventStub.getCall(0).args[0]).to.deep.equal({
      event: 'api_call',
      'api-name': 'GET /v0/tsa_letter',
      'api-status': 'error',
    });
  });

  it('dispatches SUCCESS action when fetch succeeds for determining eligibility (no letter)', async () => {
    setFetchJSONResponse(global.fetch.onFirstCall(), {
      data: [],
    });
    const dispatch = sinon.spy();
    const thunk = getTsaLetterEligibility();
    await thunk(dispatch);
    const successAction = dispatch.secondCall.args[0];
    expect(successAction.type).to.equal(GET_TSA_LETTER_ELIGIBILITY_SUCCESS);
    expect(recordEventStub.called).to.be.true;
    expect(recordEventStub.getCall(0).args[0]).to.deep.equal({
      event: 'api_call',
      'api-name': 'GET /v0/tsa_letter',
      'api-status': 'successful',
      'has-letter': false,
    });
  });
});
