import { expect } from 'chai';
import sinon from 'sinon';

import {
  mockFetch,
  setFetchJSONResponse as setFetchResponse,
} from 'platform/testing/unit/helpers';
import { transformForSubmit } from 'platform/forms-system/src/js/helpers';
import {
  formatCurrency,
  submit,
  replacer,
  isMarried,
  getMarriageTitleWithCurrent,
  validateWorkHours,
  isHomeAcreageMoreThanTwo,
} from '../../helpers';

describe('Pensions helpers', () => {
  describe('submit', () => {
    beforeEach(() => {
      window.VetsGov = { pollTimeout: 1 };
      window.URL = {
        createObjectURL: sinon.stub().returns('test'),
      };
    });
    it('should reject if initial request fails', () => {
      mockFetch(new Error('fake error'), false);
      const formConfig = {
        chapters: {},
      };
      const form = {
        data: {},
      };

      return submit(form, formConfig).then(
        () => {
          expect.fail();
        },
        err => {
          expect(err.message).to.equal('fake error');
        },
      );
    });
    it('should resolve if polling state is success', () => {
      mockFetch();
      setFetchResponse(global.fetch.onFirstCall(), {
        data: {
          attributes: {
            guid: 'test',
          },
        },
      });
      setFetchResponse(global.fetch.onSecondCall(), {
        data: {
          attributes: {
            state: 'pending',
          },
        },
      });
      const response = {};
      setFetchResponse(global.fetch.onThirdCall(), {
        data: {
          attributes: {
            state: 'success',
            response,
          },
        },
      });
      const formConfig = {
        chapters: {},
      };
      const form = {
        data: {},
      };

      return submit(form, formConfig).then(res => {
        expect(res).to.deep.equal(response);
      });
    });
    it('should reject if polling state is failed', () => {
      mockFetch();
      setFetchResponse(global.fetch.onFirstCall(), {
        data: {
          attributes: {
            guid: 'test',
          },
        },
      });
      setFetchResponse(global.fetch.onSecondCall(), {
        data: {
          attributes: {
            state: 'pending',
          },
        },
      });
      setFetchResponse(global.fetch.onThirdCall(), {
        data: {
          attributes: {
            state: 'failed',
          },
        },
      });
      const formConfig = {
        chapters: {},
      };
      const form = {
        data: {},
      };

      return submit(form, formConfig).then(
        () => {
          expect.fail();
        },
        err => {
          expect(err.message).to.equal(
            'vets_server_error_pensions: status failed',
          );
        },
      );
    });
    afterEach(() => {
      delete window.URL;
    });
  });
  describe('replacer', () => {
    it('should clean up empty objects', () => {
      const formConfig = {
        chapters: {},
      };
      const formData = { data: { mailingAddress: {} } };
      const transformed = transformForSubmit(formConfig, formData, replacer);

      expect(transformed).not.to.haveOwnProperty('data');
      expect(transformed).not.to.haveOwnProperty('mailingAddress');
    });

    it('should remove dashes from phone numbers', () => {
      const formConfig = {
        chapters: {},
      };
      const formData = { data: { mobilePhone: '123-123-1234' } };
      const transformed = JSON.parse(
        transformForSubmit(formConfig, formData, replacer),
      );

      expect(transformed).to.haveOwnProperty('mobilePhone');
      expect(transformed.mobilePhone).to.equal('1231231234');
    });
  });
  describe('getMarriageTitleWithCurrent', () => {
    it('should return current marriage title', () => {
      const form = {
        maritalStatus: 'Married',
        marriages: [{}, {}],
      };
      expect(getMarriageTitleWithCurrent(form, 1)).to.equal('Current marriage');
    });
  });
  describe('isMarried', () => {
    it('should return false for no data', () => {
      expect(isMarried()).to.be.false;
    });
  });
  describe('formatCurrency', () => {
    it('should format US currency', () => {
      expect(formatCurrency(0.01)).to.equal('$0.01');
      expect(formatCurrency(1000)).to.equal('$1,000');
      expect(formatCurrency(12.75)).to.equal('$12.75');
    });
  });
  describe('validateWorkHours', () => {
    it('should not allow more tthat 168 hours of work', () => {
      const errors = { addError() {} };
      const spy = sinon.spy(errors, 'addError');
      validateWorkHours(errors, 170);
      expect(spy.withArgs('Enter a number less than 169').calledOnce).to.be
        .true;
    });
  });
  describe('Pensions isHomeAcreageMoreThanTwo', () => {
    it('returns true if home acreage is more than two', () => {
      expect(
        isHomeAcreageMoreThanTwo({
          homeOwnership: true,
          homeAcreageMoreThanTwo: true,
        }),
      ).to.be.true;
    });
  });
});
