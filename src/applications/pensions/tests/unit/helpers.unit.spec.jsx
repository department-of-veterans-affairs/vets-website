import { expect } from 'chai';
import sinon from 'sinon';

import { mockFetch } from 'platform/testing/unit/helpers';
import { transformForSubmit } from 'platform/forms-system/src/js/helpers';
import { formatCurrency, isHomeAcreageMoreThanTwo } from '../../helpers';
import {
  getMarriageTitleWithCurrent,
  isMarried,
} from '../../config/chapters/04-household-information/helpers';
import { replacer, submit } from '../../config/submit';

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
        maritalStatus: 'MARRIED',
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
