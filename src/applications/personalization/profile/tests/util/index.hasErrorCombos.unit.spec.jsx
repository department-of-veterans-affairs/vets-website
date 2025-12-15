import { expect } from 'chai';
import sinon from 'sinon';

import mockDirectDeposits from '@@profile/mocks/endpoints/direct-deposits';
import * as apiModule from '~/platform/utilities/api';
import {
  DIRECT_DEPOSIT_ERROR_KEYS,
  hasErrorCombos,
  hasInvalidRoutingNumberError,
  hasInvalidAddressError,
  hasInvalidWorkPhoneNumberError,
  hasPaymentRestrictionIndicatorsError,
  recordApiEvent,
  getData,
} from '../../util';

describe('hasErrorCombos', () => {
  context('when errorTexts.length === 0', () => {
    it('returns true when errorKey matches without errorText', () => {
      expect(
        hasErrorCombos({
          errors: mockDirectDeposits.updates.errors.invalidRoutingNumber.errors,
          errorKeys: [DIRECT_DEPOSIT_ERROR_KEYS.ROUTING_NUMBER_INVALID],
          errorTexts: [],
        }),
      ).to.be.true;
    });

    it('returns false when errorKey does not match without errorText', () => {
      expect(
        hasErrorCombos({
          errors: mockDirectDeposits.updates.errors.invalidRoutingNumber.errors,
          errorKeys: [DIRECT_DEPOSIT_ERROR_KEYS.ACCOUNT_FLAGGED_FOR_FRAUD],
          errorTexts: [],
        }),
      ).to.be.false;
    });
  });

  context('when errorTexts.length > 0 with matching text', () => {
    it('returns true when errorText matches in error detail', () => {
      expect(
        hasErrorCombos({
          errors:
            mockDirectDeposits.updates.errors.invalidRoutingNumberUnspecified
              .errors,
          errorKeys: [DIRECT_DEPOSIT_ERROR_KEYS.UNSPECIFIED_ERROR],
          errorTexts: ['Invalid Routing Number'],
        }),
      ).to.be.true;
    });

    it('returns true when errorText matches case-insensitively', () => {
      expect(
        hasErrorCombos({
          errors:
            mockDirectDeposits.updates.errors.invalidRoutingNumberUnspecified
              .errors,
          errorKeys: [DIRECT_DEPOSIT_ERROR_KEYS.UNSPECIFIED_ERROR],
          errorTexts: ['invalid routing number'],
        }),
      ).to.be.true;
    });
  });

  context('when errorTexts.length > 0 but no matching text', () => {
    it('returns false when errorText does not match', () => {
      expect(
        hasErrorCombos({
          errors:
            mockDirectDeposits.updates.errors.invalidRoutingNumberUnspecified
              .errors,
          errorKeys: [DIRECT_DEPOSIT_ERROR_KEYS.UNSPECIFIED_ERROR],
          errorTexts: ['Some Other Text'],
        }),
      ).to.be.false;
    });

    it('returns false when errorKey matches but errorText does not', () => {
      expect(
        hasErrorCombos({
          errors: mockDirectDeposits.updates.errors.unspecified.errors,
          errorKeys: [DIRECT_DEPOSIT_ERROR_KEYS.UNSPECIFIED_ERROR],
          errorTexts: ['Invalid Routing Number'],
        }),
      ).to.be.false;
    });
  });

  context('with empty errors array', () => {
    it('returns false when errors array is empty', () => {
      expect(
        hasErrorCombos({
          errors: [],
          errorKeys: [DIRECT_DEPOSIT_ERROR_KEYS.ROUTING_NUMBER_INVALID],
        }),
      ).to.be.false;
    });

    it('returns false when errors array is empty with errorTexts', () => {
      expect(
        hasErrorCombos({
          errors: [],
          errorKeys: [DIRECT_DEPOSIT_ERROR_KEYS.UNSPECIFIED_ERROR],
          errorTexts: ['Invalid Routing Number'],
        }),
      ).to.be.false;
    });
  });

  context('with missing errorKey parameter', () => {
    it('returns false when errorKeys is empty array', () => {
      expect(
        hasErrorCombos({
          errors: mockDirectDeposits.updates.errors.invalidRoutingNumber.errors,
          errorKeys: [],
        }),
      ).to.be.false;
    });

    it('returns false when errorKeys is not provided', () => {
      expect(
        hasErrorCombos({
          errors: mockDirectDeposits.updates.errors.invalidRoutingNumber.errors,
        }),
      ).to.be.false;
    });

    it('returns false when no parameters are provided', () => {
      expect(hasErrorCombos()).to.be.false;
    });
  });

  context('cases for invalid routing number', () => {
    it('return true for routing number error', () => {
      expect(
        hasErrorCombos({
          errors: mockDirectDeposits.updates.errors.invalidRoutingNumber.errors,
          errorKeys: [DIRECT_DEPOSIT_ERROR_KEYS.ROUTING_NUMBER_INVALID],
        }),
      ).to.be.true;
    });
  });

  context('cases for phone number errors', () => {
    it('return true for Lighthouse day phone error', () => {
      expect(
        hasErrorCombos({
          errors: mockDirectDeposits.updates.errors.invalidDayPhone.errors,
          errorKeys: [DIRECT_DEPOSIT_ERROR_KEYS.DAY_PHONE_NUMBER_INVALID],
        }),
      ).to.be.true;
    });

    it('return true for Lighthouse day phone area error', () => {
      expect(
        hasErrorCombos({
          errors: mockDirectDeposits.updates.errors.invalidDayPhoneArea.errors,
          errorKeys: [DIRECT_DEPOSIT_ERROR_KEYS.DAY_PHONE_AREA_INVALID],
        }),
      ).to.be.true;
    });
  });
});

describe('hasInvalidRoutingNumberError', () => {
  context(
    'when first hasErrorCombos call returns false, second returns true',
    () => {
      it('returns true for unspecified error with Invalid Routing Number text', () => {
        expect(
          hasInvalidRoutingNumberError(
            mockDirectDeposits.updates.errors.invalidRoutingNumberUnspecified
              .errors,
          ),
        ).to.be.true;
      });

      it('returns true for generic error with Invalid Routing Number text', () => {
        const genericErrorWithRoutingNumber = {
          errors: [
            {
              title: 'Bad Request',
              detail: 'Invalid Routing Number',
              code: 'direct.deposit.generic.error',
              status: 400,
              source: 'Lighthouse Direct Deposit',
            },
          ],
        };
        expect(
          hasInvalidRoutingNumberError(genericErrorWithRoutingNumber.errors),
        ).to.be.true;
      });
    },
  );

  context('when both hasErrorCombos calls return false', () => {
    it('returns false when no routing number errors are present', () => {
      expect(
        hasInvalidRoutingNumberError(
          mockDirectDeposits.updates.errors.accountNumberFlagged.errors,
        ),
      ).to.be.false;
    });

    it('returns false when errors array is empty', () => {
      expect(hasInvalidRoutingNumberError([])).to.be.false;
    });

    it('returns false when unspecified error does not contain Invalid Routing Number text', () => {
      expect(
        hasInvalidRoutingNumberError(
          mockDirectDeposits.updates.errors.unspecified.errors,
        ),
      ).to.be.false;
    });
  });

  context('error text matching case for Invalid Routing Number', () => {
    it('returns true for checksum error code', () => {
      expect(
        hasInvalidRoutingNumberError(
          mockDirectDeposits.updates.errors.invalidChecksumRoutingNumber.errors,
        ),
      ).to.be.true;
    });

    it('returns true for invalid routing number error code', () => {
      expect(
        hasInvalidRoutingNumberError(
          mockDirectDeposits.updates.errors.invalidRoutingNumber.errors,
        ),
      ).to.be.true;
    });

    it('returns true when error detail contains Invalid Routing Number text', () => {
      expect(
        hasInvalidRoutingNumberError(
          mockDirectDeposits.updates.errors.invalidRoutingNumberUnspecified
            .errors,
        ),
      ).to.be.true;
    });
  });
});

describe('hasInvalidAddressError', () => {
  context(
    'OR branch: error text matching (address update, Payment Address Data Not Found)',
    () => {
      it('returns true for unspecified error with address update text', () => {
        const unspecifiedErrorWithAddressUpdate = {
          errors: [
            {
              title: 'Bad Request',
              detail: 'address update failed',
              code: 'direct.deposit.unspecified.error',
              status: 400,
              source: 'Lighthouse Direct Deposit',
            },
          ],
        };
        expect(hasInvalidAddressError(unspecifiedErrorWithAddressUpdate.errors))
          .to.be.true;
      });

      it('returns true for unspecified error with Payment Address Data Not Found text', () => {
        const unspecifiedErrorWithPaymentAddress = {
          errors: [
            {
              title: 'Bad Request',
              detail: 'Payment Address Data Not Found',
              code: 'direct.deposit.unspecified.error',
              status: 400,
              source: 'Lighthouse Direct Deposit',
            },
          ],
        };
        expect(
          hasInvalidAddressError(unspecifiedErrorWithPaymentAddress.errors),
        ).to.be.true;
      });

      it('returns true for generic error with address update text', () => {
        const genericErrorWithAddressUpdate = {
          errors: [
            {
              title: 'Bad Request',
              detail: 'address update error occurred',
              code: 'direct.deposit.generic.error',
              status: 400,
              source: 'Lighthouse Direct Deposit',
            },
          ],
        };
        expect(hasInvalidAddressError(genericErrorWithAddressUpdate.errors)).to
          .be.true;
      });

      it('returns true for generic error with Payment Address Data Not Found text', () => {
        const genericErrorWithPaymentAddress = {
          errors: [
            {
              title: 'Bad Request',
              detail: 'Payment Address Data Not Found',
              code: 'direct.deposit.generic.error',
              status: 400,
              source: 'Lighthouse Direct Deposit',
            },
          ],
        };
        expect(hasInvalidAddressError(genericErrorWithPaymentAddress.errors)).to
          .be.true;
      });

      it('returns true for case-insensitive address update text', () => {
        const errorWithUpperCaseText = {
          errors: [
            {
              title: 'Bad Request',
              detail: 'ADDRESS UPDATE FAILED',
              code: 'direct.deposit.unspecified.error',
              status: 400,
              source: 'Lighthouse Direct Deposit',
            },
          ],
        };
        expect(hasInvalidAddressError(errorWithUpperCaseText.errors)).to.be
          .true;
      });

      it('returns false when unspecified error does not contain address-related text', () => {
        expect(
          hasInvalidAddressError(
            mockDirectDeposits.updates.errors.unspecified.errors,
          ),
        ).to.be.false;
      });

      it('returns false when generic error does not contain address-related text', () => {
        expect(
          hasInvalidAddressError(
            mockDirectDeposits.updates.errors.generic.errors,
          ),
        ).to.be.false;
      });
    },
  );

  context(
    'OR branch: direct error code matching (MAILING_ADDRESS_INVALID, PAYMENT_ADDRESS_MISSING)',
    () => {
      it('returns true for mailing address invalid error code', () => {
        expect(
          hasInvalidAddressError(
            mockDirectDeposits.updates.errors.invalidMailingAddress.errors,
          ),
        ).to.be.true;
      });

      it('returns true for payment address missing error code', () => {
        expect(
          hasInvalidAddressError(
            mockDirectDeposits.updates.errors.missingPaymentAddress.errors,
          ),
        ).to.be.true;
      });
    },
  );

  context('when both OR branches return false', () => {
    it('returns false when no address errors are present', () => {
      expect(
        hasInvalidAddressError(
          mockDirectDeposits.updates.errors.invalidRoutingNumber.errors,
        ),
      ).to.be.false;
    });

    it('returns false when errors array is empty', () => {
      expect(hasInvalidAddressError([])).to.be.false;
    });
  });
});

describe('hasInvalidWorkPhoneNumberError', () => {
  context(
    'OR branch: error text matching (day phone number, day area number)',
    () => {
      it('returns true for unspecified error with day phone number text', () => {
        const unspecifiedErrorWithDayPhone = {
          errors: [
            {
              title: 'Bad Request',
              detail: 'day phone number invalid',
              code: 'direct.deposit.unspecified.error',
              status: 400,
              source: 'Lighthouse Direct Deposit',
            },
          ],
        };
        expect(
          hasInvalidWorkPhoneNumberError(unspecifiedErrorWithDayPhone.errors),
        ).to.be.true;
      });

      it('returns true for unspecified error with day area number text', () => {
        const unspecifiedErrorWithDayArea = {
          errors: [
            {
              title: 'Bad Request',
              detail: 'day area number invalid',
              code: 'direct.deposit.unspecified.error',
              status: 400,
              source: 'Lighthouse Direct Deposit',
            },
          ],
        };
        expect(
          hasInvalidWorkPhoneNumberError(unspecifiedErrorWithDayArea.errors),
        ).to.be.true;
      });

      it('returns true for generic error with day phone number text', () => {
        const genericErrorWithDayPhone = {
          errors: [
            {
              title: 'Bad Request',
              detail: 'day phone number error occurred',
              code: 'direct.deposit.generic.error',
              status: 400,
              source: 'Lighthouse Direct Deposit',
            },
          ],
        };
        expect(hasInvalidWorkPhoneNumberError(genericErrorWithDayPhone.errors))
          .to.be.true;
      });

      it('returns true for generic error with day area number text', () => {
        const genericErrorWithDayArea = {
          errors: [
            {
              title: 'Bad Request',
              detail: 'day area number error occurred',
              code: 'direct.deposit.generic.error',
              status: 400,
              source: 'Lighthouse Direct Deposit',
            },
          ],
        };
        expect(hasInvalidWorkPhoneNumberError(genericErrorWithDayArea.errors))
          .to.be.true;
      });

      it('returns true for case-insensitive day phone number text', () => {
        const errorWithUpperCaseText = {
          errors: [
            {
              title: 'Bad Request',
              detail: 'DAY PHONE NUMBER INVALID',
              code: 'direct.deposit.unspecified.error',
              status: 400,
              source: 'Lighthouse Direct Deposit',
            },
          ],
        };
        expect(hasInvalidWorkPhoneNumberError(errorWithUpperCaseText.errors)).to
          .be.true;
      });

      it('returns false when unspecified error does not contain day phone-related text', () => {
        expect(
          hasInvalidWorkPhoneNumberError(
            mockDirectDeposits.updates.errors.unspecified.errors,
          ),
        ).to.be.false;
      });

      it('returns false when generic error does not contain day phone-related text', () => {
        expect(
          hasInvalidWorkPhoneNumberError(
            mockDirectDeposits.updates.errors.generic.errors,
          ),
        ).to.be.false;
      });
    },
  );

  context(
    'OR branch: direct error code matching (DAY_PHONE_NUMBER_INVALID, DAY_PHONE_AREA_INVALID)',
    () => {
      it('returns true for day phone number invalid error code', () => {
        expect(
          hasInvalidWorkPhoneNumberError(
            mockDirectDeposits.updates.errors.invalidDayPhone.errors,
          ),
        ).to.be.true;
      });

      it('returns true for day phone area invalid error code', () => {
        expect(
          hasInvalidWorkPhoneNumberError(
            mockDirectDeposits.updates.errors.invalidDayPhoneArea.errors,
          ),
        ).to.be.true;
      });
    },
  );

  context('when both OR branches return false', () => {
    it('returns false when no work phone errors are present', () => {
      expect(
        hasInvalidWorkPhoneNumberError(
          mockDirectDeposits.updates.errors.invalidRoutingNumber.errors,
        ),
      ).to.be.false;
    });

    it('returns false when errors array is empty', () => {
      expect(hasInvalidWorkPhoneNumberError([])).to.be.false;
    });

    it('returns false with multiple errors with text not matching desired error conditions', () => {
      const { errors } = mockDirectDeposits.updates.errors.generic;
      expect(
        !!hasInvalidWorkPhoneNumberError([
          ...errors,
          ...mockDirectDeposits.updates.errors.invalidAccountNumber.errors,
        ]),
      ).to.be.false;
    });
  });
});

describe('hasPaymentRestrictionIndicatorsError', () => {
  it('returns true for payment restrictions present error code', () => {
    expect(
      hasPaymentRestrictionIndicatorsError(
        mockDirectDeposits.updates.errors.paymentRestrictionsPresent.errors,
      ),
    ).to.be.true;
  });

  it('returns false when no payment restriction errors are present', () => {
    expect(
      hasPaymentRestrictionIndicatorsError(
        mockDirectDeposits.updates.errors.invalidRoutingNumber.errors,
      ),
    ).to.be.false;
  });

  it('returns false when errors array is empty', () => {
    expect(hasPaymentRestrictionIndicatorsError([])).to.be.false;
  });

  it('returns false when errors contain other error types', () => {
    expect(
      hasPaymentRestrictionIndicatorsError(
        mockDirectDeposits.updates.errors.accountNumberFlagged.errors,
      ),
    ).to.be.false;
  });
});

describe('recordApiEvent', () => {
  let sandbox;
  let recordEventSpy;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    recordEventSpy = sandbox.spy();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('calls recordAnalyticsEvent with correct payload for GET request', () => {
    const endpoint = '/v0/profile/test';
    const status = 'success';

    recordApiEvent({ endpoint, status }, recordEventSpy);

    expect(recordEventSpy.calledOnce).to.be.true;
    expect(recordEventSpy.firstCall.args[0]).to.deep.equal({
      event: 'api_call',
      'api-name': 'GET /v0/profile/test',
      'api-status': status,
    });
  });

  it('calls recordAnalyticsEvent with correct payload for POST request', () => {
    const endpoint = '/v0/profile/test';
    const status = 'success';
    const method = 'POST';

    recordApiEvent({ endpoint, status, method }, recordEventSpy);

    expect(recordEventSpy.calledOnce).to.be.true;
    expect(recordEventSpy.firstCall.args[0]).to.deep.equal({
      event: 'api_call',
      'api-name': 'POST /v0/profile/test',
      'api-status': status,
    });
  });

  it('calls recordAnalyticsEvent with correct payload for PUT request', () => {
    const endpoint = '/v0/profile/test';
    const status = 'error';
    const method = 'PUT';

    recordApiEvent({ endpoint, status, method }, recordEventSpy);

    expect(recordEventSpy.calledOnce).to.be.true;
    expect(recordEventSpy.firstCall.args[0]).to.deep.equal({
      event: 'api_call',
      'api-name': 'PUT /v0/profile/test',
      'api-status': status,
    });
  });

  it('includes error-key in payload when extraProperties contains error-key', () => {
    const endpoint = '/v0/profile/test';
    const status = 'error';
    const extraProperties = {
      'error-key': 'direct.deposit.routing.number.invalid',
    };

    recordApiEvent({ endpoint, status, extraProperties }, recordEventSpy);

    expect(recordEventSpy.calledOnce).to.be.true;
    expect(recordEventSpy.firstCall.args[0]).to.deep.equal({
      event: 'api_call',
      'api-name': 'GET /v0/profile/test',
      'api-status': status,
      'error-key': 'direct.deposit.routing.number.invalid',
    });
  });

  it('does not include error-key when extraProperties does not contain error-key', () => {
    const endpoint = '/v0/profile/test';
    const status = 'success';
    const extraProperties = {
      'other-property': 'some-value',
    };

    recordApiEvent({ endpoint, status, extraProperties }, recordEventSpy);

    expect(recordEventSpy.calledOnce).to.be.true;
    expect(recordEventSpy.firstCall.args[0]).to.not.have.property('error-key');
    expect(recordEventSpy.firstCall.args[0]).to.deep.equal({
      event: 'api_call',
      'api-name': 'GET /v0/profile/test',
      'api-status': status,
    });
  });

  it('defaults to GET method when method is not provided', () => {
    const endpoint = '/v0/profile/test';
    const status = 'success';

    recordApiEvent({ endpoint, status }, recordEventSpy);

    expect(recordEventSpy.calledOnce).to.be.true;
    expect(recordEventSpy.firstCall.args[0]['api-name']).to.equal(
      'GET /v0/profile/test',
    );
  });

  it('defaults to empty extraProperties when extraProperties is not provided', () => {
    const endpoint = '/v0/profile/test';
    const status = 'success';

    recordApiEvent({ endpoint, status }, recordEventSpy);

    expect(recordEventSpy.calledOnce).to.be.true;
    expect(recordEventSpy.firstCall.args[0]).to.not.have.property('error-key');
  });

  it('uses custom recordAnalyticsEvent function when provided', () => {
    const endpoint = '/v0/profile/test';
    const status = 'success';
    const customRecordEventSpy = sandbox.spy();

    recordApiEvent({ endpoint, status }, customRecordEventSpy);

    expect(customRecordEventSpy.calledOnce).to.be.true;
    expect(recordEventSpy.called).to.be.false;
    expect(customRecordEventSpy.firstCall.args[0]).to.deep.equal({
      event: 'api_call',
      'api-name': 'GET /v0/profile/test',
      'api-status': status,
    });
  });

  it('uses custom recordAnalyticsEvent function with error-key', () => {
    const endpoint = '/v0/profile/test';
    const status = 'error';
    const extraProperties = {
      'error-key': 'test-error-key',
    };
    const customRecordEventSpy = sandbox.spy();

    recordApiEvent({ endpoint, status, extraProperties }, customRecordEventSpy);

    expect(customRecordEventSpy.calledOnce).to.be.true;
    expect(recordEventSpy.called).to.be.false;
    expect(customRecordEventSpy.firstCall.args[0]).to.deep.equal({
      event: 'api_call',
      'api-name': 'GET /v0/profile/test',
      'api-status': status,
      'error-key': 'test-error-key',
    });
  });
});

describe('getData', () => {
  let sandbox;
  let apiRequestStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    apiRequestStub = sandbox.stub(apiModule, 'apiRequest');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('returns response.data.attributes on successful API response', async () => {
    const apiRoute = '/v0/profile/test';
    const options = { method: 'GET' };
    const mockResponse = {
      data: {
        attributes: {
          accountType: 'Checking',
          accountNumber: '******1234',
        },
      },
    };

    apiRequestStub.resolves(mockResponse);

    const result = await getData(apiRoute, options);

    expect(apiRequestStub.calledOnce).to.be.true;
    expect(apiRequestStub.firstCall.args[0]).to.equal(apiRoute);
    expect(apiRequestStub.firstCall.args[1]).to.equal(options);
    expect(result).to.deep.equal({
      accountType: 'Checking',
      accountNumber: '******1234',
    });
  });

  it('returns { error } on API error', async () => {
    const apiRoute = '/v0/profile/test';
    const options = { method: 'GET' };
    const mockError = new Error('Network error');

    apiRequestStub.rejects(mockError);

    const result = await getData(apiRoute, options);

    expect(apiRequestStub.calledOnce).to.be.true;
    expect(apiRequestStub.firstCall.args[0]).to.equal(apiRoute);
    expect(apiRequestStub.firstCall.args[1]).to.equal(options);
    expect(result).to.deep.equal({ error: mockError });
  });

  it('returns { error } when apiRequest throws different error types', async () => {
    const apiRoute = '/v0/profile/test';
    const mockError = { message: 'Custom error', code: 'CUSTOM_ERROR' };

    apiRequestStub.rejects(mockError);

    const result = await getData(apiRoute);

    expect(result).to.deep.equal({ error: mockError });
  });

  it('handles empty options parameter', async () => {
    const apiRoute = '/v0/profile/test';
    const mockResponse = {
      data: {
        attributes: {
          test: 'value',
        },
      },
    };

    apiRequestStub.resolves(mockResponse);

    const result = await getData(apiRoute);

    expect(apiRequestStub.calledOnce).to.be.true;
    expect(apiRequestStub.firstCall.args[0]).to.equal(apiRoute);
    expect(result).to.deep.equal({ test: 'value' });
  });
});
