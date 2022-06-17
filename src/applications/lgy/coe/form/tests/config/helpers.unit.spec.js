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

// console.log(stub);
describe('coe helpers', () => {
  let stub;
  beforeEach(function() {
    stub = sinon.stub(helpers, 'transformForSubmit');
  });
  afterEach(function() {
    stub.restore();
  });
  describe('customCOEsubmit', () => {
    it('should correctly format the form data', () => {
      stub.returns(formattedProperties);
      expect(customCOEsubmit({}, form)).to.equal(result);
    });
  });
});
