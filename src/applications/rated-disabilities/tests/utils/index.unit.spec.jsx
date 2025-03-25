import { expect } from 'chai';
<<<<<<< HEAD
import { isClientError, isServerError } from '../../util';

describe('Error Handling', () => {
  it('should detect a server error', () => {
    expect(isServerError(503)).to.be.true;
    expect(isServerError(400)).to.be.false;
  });

  it('should detect a client error', () => {
    expect(isClientError(404)).to.be.true;
    expect(isClientError(500)).to.be.false;
=======
import sinon from 'sinon';
import * as api from '@department-of-veterans-affairs/platform-utilities/api';

import {
  isClientError,
  isServerError,
  getData,
  buildDateFormatter,
} from '../../util';

describe('rated-disabilities utils', () => {
  describe('getData', () => {
    let apiStub;
    before(() => {
      apiStub = sinon.stub(api, 'apiRequest');
    });
    after(() => {
      apiStub.restore();
    });
    it('should get rated disabilities', () => {
      apiStub.returns(Promise.resolve({ data: [] }));

      getData();
      expect(apiStub.called).to.be.true;
    });
  });

  describe('isServerError', () => {
    it('should detect a server error', () => {
      expect(isServerError(503)).to.be.true;
      expect(isServerError(400)).to.be.false;
    });
  });

  describe('isClientError', () => {
    it('should detect a client error', () => {
      expect(isClientError(404)).to.be.true;
      expect(isClientError(500)).to.be.false;
    });
  });

  describe('buildDateFormatter', () => {
    context('when date is valid', () => {
      it('should return a formatted date', () => {
        const date = '2025-03-03';
        const result = buildDateFormatter();
        expect(result(date)).to.eq('March 03, 2025');
      });
    });
    context('when date is invalid', () => {
      it('should return Invalid date error', () => {
        const date = 'TESTDATE';
        const result = buildDateFormatter();
        expect(result(date)).to.eq('Invalid date');
      });
    });
>>>>>>> main
  });
});
