import { expect } from 'chai';
import sinon from 'sinon';

import formConfig from '../../config/form';
import maximal from './cfsr-unit-maximal.json';

import submitForm, { buildEventData } from '../../config/submitForm';

const debtOnly = {
  'view:enhancedFinancialStatusReport': false,
  selectedDebtsAndCopays: [
    { debtType: 'DEBT', deductionCode: 30, resolutionOption: 'waiver' },
  ],
  isStreamlinedShort: false,
  isStreamlinedLong: false,
};
const copayOnly = {
  'view:enhancedFinancialStatusReport': false,
  selectedDebtsAndCopays: [
    {
      debtType: 'COPAY',
      station: { facilityName: 'Bob Stump Medical Center' },
      resolutionOption: 'compromise',
    },
  ],
  isStreamlinedShort: false,
  isStreamlinedLong: true,
};
const combined = {
  'view:enhancedFinancialStatusReport': false,
  selectedDebtsAndCopays: [
    {
      debtType: 'COPAY',
      station: { facilityName: 'Bob Stump Medical Center' },
      resolutionOption: 'compromise',
    },
    { debtType: 'DEBT', deductionCode: 30, resolutionOption: 'waiver' },
  ],
  isStreamlinedShort: true,
  isStreamlinedLong: false,
};

describe('Submit event data', () => {
  it('should build submit event data', () => {
    expect(buildEventData(debtOnly)).to.deep.equal({
      'enhanced-submission': true,
      streamlined: 'streamlined-false',
      'submission-type': 'debt-submission',
      'resolution-and-debt-selection': ['debt-30-waiver'],
    });
    expect(buildEventData(copayOnly)).to.deep.equal({
      'enhanced-submission': true,
      streamlined: 'streamlined-long',
      'submission-type': 'copay-submission',
      'resolution-and-debt-selection': [
        'copay-Bob Stump Medical Center-compromise',
      ],
    });
    expect(buildEventData(combined)).to.deep.equal({
      'enhanced-submission': true,
      streamlined: 'streamlined-short',
      'submission-type': 'combo-submission',
      'resolution-and-debt-selection': [
        'copay-Bob Stump Medical Center-compromise',
        'debt-30-waiver',
      ],
    });
  });
});

describe('submitForm', () => {
  let xhr;
  let requests;

  beforeEach(() => {
    xhr = sinon.useFakeXMLHttpRequest();
    requests = [];
    xhr.onCreate = createdXhr => requests.push(createdXhr);
  });

  afterEach(() => {
    global.XMLHttpRequest = window.XMLHttpRequest;
    xhr.restore();
  });

  it('should submit at standard endpioint', done => {
    submitForm(maximal, formConfig);
    expect(requests[0].url).to.contain(
      '/debts_api/v0/financial_status_reports',
    );
    done();
  });

  it('should submit at Transform & Submit endpioint', done => {
    const adjustedMaximal = {
      data: {
        ...maximal.data,
        flippers: { serverSideTransform: true },
      },
    };
    submitForm(adjustedMaximal, formConfig);
    expect(requests[0].url).to.contain(
      '/debts_api/v0/financial_status_reports/transform_and_submit',
    );
    done();
  });
});
