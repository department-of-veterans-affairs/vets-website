import { expect } from 'chai';
import sinon from 'sinon';

import formConfig from '../../config/form';
import maximal from './efsr-unit-maximal.json';

import submitForm, { buildEventData } from '../../config/submitForm';

const debtOnly = {
  selectedDebtsAndCopays: [{ debtType: 'DEBT' }],
};
const copayOnly = {
  selectedDebtsAndCopays: [{ debtType: 'COPAY' }],
};
const combined = {
  selectedDebtsAndCopays: [{ debtType: 'COPAY' }, { debtType: 'DEBT' }],
};

describe('Submit event data', () => {
  it('should build submit event data', () => {
    expect(buildEventData(debtOnly)).to.deep.equal({
      'request-includes-copay': false,
      'request-includes-debt': true,
    });
    expect(buildEventData(copayOnly)).to.deep.equal({
      'request-includes-copay': true,
      'request-includes-debt': false,
    });
    expect(buildEventData(combined)).to.deep.equal({
      'request-includes-copay': true,
      'request-includes-debt': true,
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

  it('should submit at endpioint', done => {
    submitForm(maximal, formConfig);
    expect(requests[0].url).to.contain('/v0/financial_status_reports');
    done();
  });
});
