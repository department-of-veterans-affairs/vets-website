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
} from '../../utils/constants';

import {
  getLetterList,
  getLetterListAndBSLOptions,
  getBenefitSummaryOptions,
  getLetterPdf,
  getLetterPdfLink,
  getLetterBlobUrl,
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

  it('dispatches SUCCESS action when fetch succeeds on IE10', done => {
    const ieDownloadSpy = sinon.spy();
    const blobObj = { test: '123 testing' };
    global.window.navigator.msSaveOrOpenBlob = ieDownloadSpy; // fakes IE
    setFetchBlobResponse(global.fetch.onCall(0), blobObj);
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
        const msBlobArgs = ieDownloadSpy.firstCall.args;
        expect(action.type).to.equal(GET_LETTER_PDF_SUCCESS);
        expect(msBlobArgs).to.have.members([blobObj, `${letterName}.pdf`]);
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

describe('getLetterPdfLink', () => {
  // We can't mock `getLetterBlobUrl` because it is in the same file
  // as the function we are purposefully calling. Instead,
  // we will use this to ensure we are grabbing the URL correctly.
  let stubCreateObjectUrl;

  beforeEach(() => {
    // setup and create the stub for the window.URL functionality
    setup();
    stubCreateObjectUrl = sinon.stub(window.URL, 'createObjectURL');
  });

  afterEach(() => {
    // reset / clear mocks for window.URL functionality
    stubCreateObjectUrl.restore();
  });

  const lettersArr = [
    {
      letterName: 'Benefit Summary Letter',
      letterType: LETTER_TYPES.benefitSummary,
      letterOptions: {
        militaryService: true,
        monthlyAward: true,
        serviceConnectedEvaluation: true,
        chapter35Eligibility: true,
        serviceConnectedDisabilities: true,
      },
    },
    {
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
    },
  ];

  it('dispatches enhanced letter downloading and success actions', done => {
    const dispatch = sinon.spy();
    const mockBlob = () => Promise.resolve(Buffer.from('PDF file content'));
    const mockUrlBenefitSummary =
      'http://fake-site.com/benefit-summary-letter.pdf';
    const mockUrlCivilServiceLetter =
      'http://fake-site.com/civil-service-letter.pdf';

    // set up first response
    stubCreateObjectUrl.onCall(0).returns(mockUrlBenefitSummary);
    setFetchJSONResponse(global.fetch.onCall(0), { blob: mockBlob });

    // set up second response
    stubCreateObjectUrl.onCall(1).returns(mockUrlCivilServiceLetter);
    setFetchJSONResponse(global.fetch.onCall(1), { blob: mockBlob });

    getLetterPdfLink(dispatch, migrationOptions, lettersArr)
      .then(() => {
        const action1 = dispatch.getCall(0).args[0];
        const action2 = dispatch.getCall(1).args[0];

        // assert first action is download request
        expect(action1.type).to.equal(GET_ENHANCED_LETTERS_DOWNLOADING);

        // assert second action is success with proper types and URLs
        expect(action2.type).to.equal(GET_ENHANCED_LETTERS_SUCCESS);
        expect(action2.data).to.have.length(2);
        expect(action2.data[0]).to.include({
          letterType: LETTER_TYPES.benefitSummary,
          downloadUrl: mockUrlBenefitSummary,
        });
        expect(action2.data[1]).to.include({
          letterType: LETTER_TYPES.civilService,
          downloadUrl: mockUrlCivilServiceLetter,
        });
      })
      .then(done, done);
  });

  it('dispatches enhanced letter failure action', done => {
    const dispatch = sinon.spy();
    const mockBlob = () => Promise.resolve(Buffer.from('PDF file content'));

    // set up first response
    stubCreateObjectUrl.onCall(0).returns('http://fake-site.com/letter.pdf');
    setFetchJSONResponse(global.fetch.onCall(0), { blob: mockBlob });

    // set up second response
    stubCreateObjectUrl.onCall(1).returns('http://fake-site.com/letter.pdf');
    setFetchJSONFailure(
      global.fetch.onCall(1),
      Promise.reject(new Error('error')),
    );

    getLetterPdfLink(dispatch, migrationOptions, lettersArr)
      .then(() => {
        const action1 = dispatch.getCall(0).args[0];
        const action2 = dispatch.getCall(1).args[0];

        // assert we're starting to collate PDFs
        expect(action1.type).to.equal(GET_ENHANCED_LETTERS_DOWNLOADING);

        // assert we're dispatching the failure action
        expect(action2.type).to.equal(GET_LETTER_PDF_FAILURE);
        expect(action2.data).to.equal(LETTER_TYPES.civilService);
      })
      .then(done, done);
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
