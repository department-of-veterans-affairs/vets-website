import { expect } from 'chai';
import sinon from 'sinon';
import * as helpers from 'platform/forms-system/src/js/helpers';
import { customCOEsubmit, getLoanIntent } from '../../config/helpers';
import { LOAN_INTENT, TOGGLE_KEY } from '../../constants';

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

  it('sets version to 2 when the toggle view key is truthy', () => {
    const viewKey = `view:${TOGGLE_KEY}`;
    const formWithToggle = {
      data: {
        [viewKey]: true,
        periodsOfService: [],
        relevantPriorLoans: [],
      },
    };

    sandbox
      .stub(helpers, 'transformForSubmit')
      .callsFake((_, formattedForm) => formattedForm);

    const res = customCOEsubmit({}, formWithToggle);
    const outer = JSON.parse(res);
    const inner = outer.lgyCoeClaim.form;

    expect(inner.data.version).to.equal(2);
  });

  it('sets version to 1 when the toggle view key is falsy', () => {
    const viewKey = `view:${TOGGLE_KEY}`;
    const formWithToggle = {
      data: {
        [viewKey]: false,
        periodsOfService: [],
        relevantPriorLoans: [],
      },
    };

    sandbox
      .stub(helpers, 'transformForSubmit')
      .callsFake((_, formattedForm) => formattedForm);

    const res = customCOEsubmit({}, formWithToggle);
    const outer = JSON.parse(res);
    const inner = outer.lgyCoeClaim.form;

    expect(inner.data.version).to.equal(1);
  });
});

describe('getLoanIntent', () => {
  it('should return the loan intent object based on the value', () => {
    Object.keys(LOAN_INTENT).forEach(type => {
      const obj = getLoanIntent(LOAN_INTENT[type].value);
      expect(obj).to.deep.equal(LOAN_INTENT[type]);
    });
  });
});
