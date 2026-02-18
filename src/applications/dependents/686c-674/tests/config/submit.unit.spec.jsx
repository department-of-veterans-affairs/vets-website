import { expect } from 'chai';
import sinon from 'sinon';
import { waitFor } from '@testing-library/react';

import * as api from 'platform/utilities/api';
import * as recordEventModule from 'platform/monitoring/record-event';
import { submit } from '../../config/submit';

describe('submit', () => {
  let apiRequestStub;
  let recordEventStub;
  const formConfig = {
    chapters: {},
  };
  const form = {
    data: {
      'view:selectable686Options': {},
    },
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
