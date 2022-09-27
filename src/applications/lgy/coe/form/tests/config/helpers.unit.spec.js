import { expect } from 'chai';
import sinon from 'sinon';
import * as helpers from 'platform/forms-system/src/js/helpers';
import { customCOEsubmit } from '../../config/helpers';

const form = {
  data: {
    periodsOfService: [{ dateRange: { from: '2010-10-10', to: '2012-12-12' } }],
    relevantPriorLoans: [
      { dateRange: { from: '1990-01-XX', to: '1992-02-XX' } },
    ],
  },
};

const formattedProperties = {
  periodsOfService: [
    {
      dateRange: {
        from: '2010-10-10T00:00:00.000Z',
        to: '2012-12-12T00:00:00.000Z',
      },
    },
  ],
  relevantPriorLoans: [
    {
      dateRange: {
        from: '1990-01-01T05:00:00.000Z',
        to: '1992-02-01T05:00:00.000Z',
      },
      vaLoanNumber: '1-2-3-4-5-6-7-8-9-0-1-2',
    },
  ],
};

const result = JSON.stringify({
  lgyCoeClaim: {
    form: {
      ...formattedProperties,
    },
  },
});

let sandbox;

beforeEach(() => {
  sandbox = sinon.sandbox.create();
});

afterEach(() => {
  sandbox.restore();
});

describe('customCOEsubmit', () => {
  it('should correctly format the form data', () => {
    sandbox.stub(helpers, 'transformForSubmit').returns(formattedProperties);
    expect(customCOEsubmit({}, form)).to.equal(result);
  });
});
