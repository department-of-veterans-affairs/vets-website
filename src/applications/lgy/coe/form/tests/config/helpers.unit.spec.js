import { expect } from 'chai';
import sinon from 'sinon';
import * as helpers from 'platform/forms-system/src/js/helpers';
import {
  customCOEsubmit,
  validateDocumentDescription,
} from '../../config/helpers';

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

let sandbox;

beforeEach(() => {
  sandbox = sinon.sandbox.create();
});

afterEach(() => {
  sandbox.restore();
});

describe('coe helpers', () => {
  describe('customCOEsubmit', () => {
    it('should correctly format the form data', () => {
      sandbox.stub(helpers, 'transformForSubmit').returns(formattedProperties);
      expect(customCOEsubmit({}, form)).to.equal(result);
    });
  });
  describe('validateDocumentDescription', () => {
    const errors = addError => [{ attachmentDescription: { addError } }];
    const fileList = (type, descrip) => [
      {
        attachmentType: type,
        attachmentDescription: descrip,
      },
    ];
    it('should not add an error for non-other type', () => {
      const spy = sinon.spy();
      validateDocumentDescription(errors(spy), fileList('ALTA statement', ''));
      expect(spy.called).to.be.false;
    });
    it('should not add an error for Other-type with description', () => {
      const spy = sinon.spy();
      validateDocumentDescription(errors(spy), fileList('Other', 'ok'));
      expect(spy.called).to.be.false;
    });
    it('should add an error for a missing attachmentDescription', () => {
      const spy = sinon.spy();
      validateDocumentDescription(errors(spy), fileList('Other', ''));
      expect(spy.called).to.be.true;
      expect(spy.calledWith('Please provide a description'));
    });
  });
});
