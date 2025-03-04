import { expect } from 'chai';
import sinon from 'sinon';
import { waitFor } from '@testing-library/react';

import * as api from 'platform/utilities/api';
import { transformForSubmit } from 'platform/forms-system/src/js/helpers';
import * as recordEventModule from 'platform/monitoring/record-event';
import { formatCurrency, isHomeAcreageMoreThanTwo } from '../../helpers';
import {
  getMarriageTitleWithCurrent,
  isMarried,
} from '../../config/chapters/04-household-information/helpers';
import { replacer, submit } from '../../config/submit';

describe('Pensions helpers', () => {
  describe('submit', () => {
    let apiRequestStub;
    let recordEventStub;
    const formConfig = {
      chapters: {},
    };
    const form = {
      data: {},
    };

    beforeEach(() => {
      window.VetsGov = { pollTimeout: 1 };
      localStorage.setItem('csrfToken', 'my-token');
      apiRequestStub = sinon
        .stub(api, 'apiRequest')
        .resolves({ data: { attributes: {} } });
      recordEventStub = sinon.stub(recordEventModule, 'default');
    });

    afterEach(() => {
      apiRequestStub.restore();
      localStorage.clear();
      recordEventStub.restore();
    });

    it('should not update csrf token on success', async () => {
      expect(localStorage.getItem('csrfToken')).to.eql('my-token');

      await submit(form, formConfig);

      expect(localStorage.getItem('csrfToken')).to.eql('my-token');

      await waitFor(() => {
        expect(apiRequestStub.callCount).to.equal(1);
      });
    });

    it('should reject if initial request fails', () => {
      apiRequestStub.onFirstCall().rejects({ message: 'fake error' });

      return submit(form, formConfig).then(
        () => {
          expect.fail();
        },
        err => {
          expect(err.message).to.equal('fake error');
        },
      );
    });

    describe('on 403 Invalid Authenticity Token error', () => {
      it('should reset csrfToken', async () => {
        expect(localStorage.getItem('csrfToken')).to.eql('my-token');
        const invalidAuthenticityTokenResponse = {
          errors: [{ status: '403', detail: 'Invalid Authenticity Token' }],
        };
        apiRequestStub.onFirstCall().rejects(invalidAuthenticityTokenResponse);

        await submit(form, formConfig);

        await waitFor(() => {
          // Submission attempt -> CSRF refresh -> submission attempt
          expect(apiRequestStub.callCount).to.equal(3);
        });
      });

      it('should only retry once', async () => {
        expect(localStorage.getItem('csrfToken')).to.eql('my-token');
        const invalidAuthenticityTokenResponse = {
          errors: [{ status: '403', detail: 'Invalid Authenticity Token' }],
        };
        apiRequestStub.onFirstCall().rejects(invalidAuthenticityTokenResponse);
        apiRequestStub.onSecondCall().resolves({});
        apiRequestStub.onThirdCall().rejects({ message: 'fake error' });

        await submit(form, formConfig).then(
          () => {
            expect.fail();
          },
          err => {
            expect(err.message).to.equal('fake error');
          },
        );

        await waitFor(() => {
          // Submission attempt -> CSRF refresh -> submission attempt
          expect(apiRequestStub.callCount).to.equal(3);
        });
      });
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
